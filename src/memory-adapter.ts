/**
 * Convex Memory Adapter for VoltAgent
 *
 * A StorageAdapter implementation that persists conversation data
 * to Convex database using the VoltAgent Convex component.
 */

import {
  ConversationAlreadyExistsError,
  ConversationNotFoundError,
} from "@voltagent/core";
import type {
  Conversation,
  ConversationQueryOptions,
  ConversationStepRecord,
  CreateConversationInput,
  GetConversationStepsOptions,
  GetMessagesOptions,
  OperationContext,
  StorageAdapter,
  WorkflowStateEntry,
  WorkingMemoryScope,
} from "@voltagent/core";
import type { UIMessage } from "ai";
import type {
  ConvexClient,
  ConvexMemoryAdapterOptions,
  Logger,
  VoltAgentApi,
} from "./types";

/**
 * Default console logger implementation
 */
const defaultLogger: Logger = {
  debug: (message: string, ...args: unknown[]) =>
    console.debug(`[ConvexMemory] ${message}`, ...args),
  info: (message: string, ...args: unknown[]) =>
    console.info(`[ConvexMemory] ${message}`, ...args),
  warn: (message: string, ...args: unknown[]) =>
    console.warn(`[ConvexMemory] ${message}`, ...args),
  error: (message: string, ...args: unknown[]) =>
    console.error(`[ConvexMemory] ${message}`, ...args),
};

/**
 * Convex Memory Adapter for VoltAgent
 *
 * Implements the StorageAdapter interface to persist conversation history,
 * working memory, and workflow state to a Convex database.
 *
 * @example
 * ```ts
 * import { ConvexHttpClient } from "convex/browser";
 * import { api } from "./convex/_generated/api";
 * import { ConvexMemoryAdapter } from "@voltagent/convex";
 *
 * const client = new ConvexHttpClient(process.env.CONVEX_URL);
 *
 * const adapter = new ConvexMemoryAdapter({
 *   client,
 *   api: api.voltagent,
 * });
 *
 * const memory = new Memory({ storage: adapter });
 * ```
 */
export class ConvexMemoryAdapter implements StorageAdapter {
  private client: ConvexClient;
  private api: VoltAgentApi;
  private debug: boolean;
  private logger: Logger;

  constructor(options: ConvexMemoryAdapterOptions) {
    if (!options.client) {
      throw new Error("Convex client is required");
    }
    if (!options.api) {
      throw new Error("Convex API is required");
    }

    this.client = options.client;
    this.api = options.api;
    this.debug = options.debug ?? false;
    this.logger = options.logger ?? defaultLogger;

    this.log("Convex Memory adapter initialized");
  }

  /**
   * Log debug messages
   */
  private log(message: string, ...args: unknown[]): void {
    if (this.debug) {
      this.logger.debug(message, ...args);
    }
  }

  /**
   * Generate a cryptographically secure random ID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ============================================================================
  // Message Operations
  // ============================================================================

  /**
   * Add a single message to a conversation
   */
  async addMessage(
    message: UIMessage,
    userId: string,
    conversationId: string,
    _context?: OperationContext,
  ): Promise<void> {
    await this.client.mutation(this.api.addMessage, {
      id: message.id || this.generateId(),
      conversationId,
      userId,
      role: message.role,
      parts: message.parts,
      metadata: message.metadata || null,
    });

    this.log(`Added message to conversation ${conversationId}`);
  }

  /**
   * Add multiple messages to a conversation
   */
  async addMessages(
    messages: UIMessage[],
    userId: string,
    conversationId: string,
    _context?: OperationContext,
  ): Promise<void> {
    const messagesToAdd = messages.map((message) => ({
      id: message.id || this.generateId(),
      conversationId,
      userId,
      role: message.role,
      parts: message.parts,
      metadata: message.metadata || null,
    }));

    await this.client.mutation(this.api.addMessages, {
      messages: messagesToAdd,
    });

    this.log(
      `Added ${messages.length} messages to conversation ${conversationId}`,
    );
  }

  /**
   * Get messages from a conversation with optional filtering
   */
  async getMessages(
    userId: string,
    conversationId: string,
    options?: GetMessagesOptions,
    _context?: OperationContext,
  ): Promise<UIMessage<{ createdAt: Date }>[]> {
    const { limit, before, after, roles } = options || {};

    const messages = await this.client.query(this.api.getMessages, {
      userId,
      conversationId,
      limit,
      before: before?.toISOString(),
      after: after?.toISOString(),
      roles,
    });

    return (
      messages as Array<{
        id: string;
        role: string;
        parts: unknown[];
        metadata?: Record<string, unknown> & { createdAt?: string };
      }>
    ).map((msg) => ({
      id: msg.id,
      role: msg.role as "system" | "user" | "assistant",
      parts: msg.parts as UIMessage["parts"],
      metadata: {
        ...msg.metadata,
        createdAt: msg.metadata?.createdAt
          ? new Date(msg.metadata.createdAt as string)
          : new Date(),
      },
    }));
  }

  /**
   * Clear messages for a user (optionally for a specific conversation)
   */
  async clearMessages(
    userId: string,
    conversationId?: string,
    _context?: OperationContext,
  ): Promise<void> {
    await this.client.mutation(this.api.clearMessages, {
      userId,
      conversationId,
    });

    this.log(`Cleared messages for user ${userId}`);
  }

  // ============================================================================
  // Conversation Steps Operations
  // ============================================================================

  /**
   * Save conversation steps for observability
   */
  async saveConversationSteps(steps: ConversationStepRecord[]): Promise<void> {
    if (steps.length === 0) {
      return;
    }

    await this.client.mutation(this.api.saveConversationSteps, {
      steps: steps.map((step) => ({
        id: step.id,
        conversationId: step.conversationId,
        userId: step.userId,
        agentId: step.agentId,
        agentName: step.agentName,
        operationId: step.operationId,
        stepIndex: step.stepIndex,
        type: step.type,
        role: step.role,
        content: step.content,
        arguments: step.arguments,
        result: step.result,
        usage: step.usage,
        subAgentId: step.subAgentId,
        subAgentName: step.subAgentName,
        createdAt: step.createdAt,
      })),
    });

    this.log(`Saved ${steps.length} conversation steps`);
  }

  /**
   * Get conversation steps for observability
   */
  async getConversationSteps(
    userId: string,
    conversationId: string,
    options?: GetConversationStepsOptions,
  ): Promise<ConversationStepRecord[]> {
    const steps = await this.client.query(this.api.getConversationSteps, {
      userId,
      conversationId,
      limit: options?.limit,
      operationId: options?.operationId,
    });

    return steps as ConversationStepRecord[];
  }

  // ============================================================================
  // Conversation Operations
  // ============================================================================

  /**
   * Create a new conversation
   */
  async createConversation(
    input: CreateConversationInput,
  ): Promise<Conversation> {
    try {
      const result = await this.client.mutation(this.api.createConversation, {
        id: input.id,
        resourceId: input.resourceId,
        userId: input.userId,
        title: input.title,
        metadata: input.metadata || {},
      });

      this.log(`Created conversation ${input.id}`);

      return result as Conversation;
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw new ConversationAlreadyExistsError(input.id);
      }
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | null> {
    const conversation = await this.client.query(this.api.getConversation, {
      id,
    });

    return conversation as Conversation | null;
  }

  /**
   * Get conversations by resource ID
   */
  async getConversations(resourceId: string): Promise<Conversation[]> {
    const conversations = await this.client.query(this.api.getConversations, {
      resourceId,
    });

    return conversations as Conversation[];
  }

  /**
   * Get conversations by user ID with optional query options
   */
  async getConversationsByUserId(
    userId: string,
    options?: Omit<ConversationQueryOptions, "userId">,
  ): Promise<Conversation[]> {
    const conversations = await this.client.query(
      this.api.getConversationsByUserId,
      {
        userId,
        limit: options?.limit,
        offset: options?.offset,
        orderBy: options?.orderBy,
        orderDirection: options?.orderDirection,
      },
    );

    return conversations as Conversation[];
  }

  /**
   * Query conversations with filters
   */
  async queryConversations(
    options: ConversationQueryOptions,
  ): Promise<Conversation[]> {
    const conversations = await this.client.query(this.api.queryConversations, {
      userId: options.userId,
      resourceId: options.resourceId,
      limit: options.limit,
      offset: options.offset,
      orderBy: options.orderBy,
      orderDirection: options.orderDirection,
    });

    return conversations as Conversation[];
  }

  /**
   * Update a conversation
   */
  async updateConversation(
    id: string,
    updates: Partial<Omit<Conversation, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Conversation> {
    try {
      const result = await this.client.mutation(this.api.updateConversation, {
        id,
        title: updates.title,
        resourceId: updates.resourceId,
        metadata: updates.metadata,
      });

      this.log(`Updated conversation ${id}`);

      return result as Conversation;
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new ConversationNotFoundError(id);
      }
      throw error;
    }
  }

  /**
   * Delete a conversation and its associated data
   */
  async deleteConversation(id: string): Promise<void> {
    try {
      await this.client.mutation(this.api.deleteConversation, { id });
      this.log(`Deleted conversation ${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new ConversationNotFoundError(id);
      }
      throw error;
    }
  }

  // ============================================================================
  // Working Memory Operations
  // ============================================================================

  /**
   * Get working memory content
   */
  async getWorkingMemory(params: {
    conversationId?: string;
    userId?: string;
    scope: WorkingMemoryScope;
  }): Promise<string | null> {
    const result = await this.client.query(this.api.getWorkingMemory, {
      conversationId: params.conversationId,
      userId: params.userId,
      scope: params.scope,
    });

    return result as string | null;
  }

  /**
   * Set working memory content
   */
  async setWorkingMemory(params: {
    conversationId?: string;
    userId?: string;
    content: string;
    scope: WorkingMemoryScope;
  }): Promise<void> {
    try {
      await this.client.mutation(this.api.setWorkingMemory, {
        conversationId: params.conversationId,
        userId: params.userId,
        content: params.content,
        scope: params.scope,
      });

      this.log(`Set working memory for ${params.scope}`);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("not found") &&
        params.conversationId
      ) {
        throw new ConversationNotFoundError(params.conversationId);
      }
      throw error;
    }
  }

  /**
   * Delete working memory content
   */
  async deleteWorkingMemory(params: {
    conversationId?: string;
    userId?: string;
    scope: WorkingMemoryScope;
  }): Promise<void> {
    await this.client.mutation(this.api.deleteWorkingMemory, {
      conversationId: params.conversationId,
      userId: params.userId,
      scope: params.scope,
    });

    this.log(`Deleted working memory for ${params.scope}`);
  }

  // ============================================================================
  // Workflow State Operations
  // ============================================================================

  /**
   * Get workflow state by execution ID
   */
  async getWorkflowState(
    executionId: string,
  ): Promise<WorkflowStateEntry | null> {
    const state = await this.client.query(this.api.getWorkflowState, {
      executionId,
    });

    if (!state) return null;

    const typedState = state as {
      id: string;
      workflowId: string;
      workflowName: string;
      status: string;
      input?: unknown;
      context?: unknown;
      suspension?: unknown;
      events?: unknown[];
      output?: unknown;
      cancellation?: unknown;
      userId?: string;
      conversationId?: string;
      metadata?: Record<string, unknown>;
      createdAt: string;
      updatedAt: string;
    };

    return {
      id: typedState.id,
      workflowId: typedState.workflowId,
      workflowName: typedState.workflowName,
      status: typedState.status as WorkflowStateEntry["status"],
      input: typedState.input,
      context: typedState.context as WorkflowStateEntry["context"],
      suspension: typedState.suspension as WorkflowStateEntry["suspension"],
      events: typedState.events as WorkflowStateEntry["events"],
      output: typedState.output,
      cancellation:
        typedState.cancellation as WorkflowStateEntry["cancellation"],
      userId: typedState.userId,
      conversationId: typedState.conversationId,
      metadata: typedState.metadata,
      createdAt: new Date(typedState.createdAt),
      updatedAt: new Date(typedState.updatedAt),
    };
  }

  /**
   * Query workflow runs with optional filters
   */
  async queryWorkflowRuns(query: {
    workflowId?: string;
    status?: WorkflowStateEntry["status"];
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }): Promise<WorkflowStateEntry[]> {
    const states = await this.client.query(this.api.queryWorkflowRuns, {
      workflowId: query.workflowId,
      status: query.status,
      from: query.from?.toISOString(),
      to: query.to?.toISOString(),
      limit: query.limit,
      offset: query.offset,
    });

    return (
      states as Array<{
        id: string;
        workflowId: string;
        workflowName: string;
        status: string;
        input?: unknown;
        context?: unknown;
        suspension?: unknown;
        events?: unknown[];
        output?: unknown;
        cancellation?: unknown;
        userId?: string;
        conversationId?: string;
        metadata?: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }>
    ).map((s) => ({
      id: s.id,
      workflowId: s.workflowId,
      workflowName: s.workflowName,
      status: s.status as WorkflowStateEntry["status"],
      input: s.input,
      context: s.context as WorkflowStateEntry["context"],
      suspension: s.suspension as WorkflowStateEntry["suspension"],
      events: s.events as WorkflowStateEntry["events"],
      output: s.output,
      cancellation: s.cancellation as WorkflowStateEntry["cancellation"],
      userId: s.userId,
      conversationId: s.conversationId,
      metadata: s.metadata,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  }

  /**
   * Set workflow state
   */
  async setWorkflowState(
    executionId: string,
    state: WorkflowStateEntry,
  ): Promise<void> {
    await this.client.mutation(this.api.setWorkflowState, {
      executionId,
      workflowId: state.workflowId,
      workflowName: state.workflowName,
      status: state.status,
      input: state.input,
      context: state.context,
      suspension: state.suspension,
      events: state.events,
      output: state.output,
      cancellation: state.cancellation,
      userId: state.userId,
      conversationId: state.conversationId,
      metadata: state.metadata,
      createdAt: state.createdAt.toISOString(),
      updatedAt: state.updatedAt.toISOString(),
    });

    this.log(`Set workflow state ${executionId}`);
  }

  /**
   * Update workflow state
   */
  async updateWorkflowState(
    executionId: string,
    updates: Partial<WorkflowStateEntry>,
  ): Promise<void> {
    await this.client.mutation(this.api.updateWorkflowState, {
      executionId,
      status: updates.status,
      suspension: updates.suspension,
      events: updates.events,
      output: updates.output,
      cancellation: updates.cancellation,
      metadata: updates.metadata,
    });

    this.log(`Updated workflow state ${executionId}`);
  }

  /**
   * Get suspended workflow states for a workflow
   */
  async getSuspendedWorkflowStates(
    workflowId: string,
  ): Promise<WorkflowStateEntry[]> {
    const states = await this.client.query(
      this.api.getSuspendedWorkflowStates,
      {
        workflowId,
      },
    );

    return (
      states as Array<{
        id: string;
        workflowId: string;
        workflowName: string;
        status: string;
        input?: unknown;
        context?: unknown;
        suspension?: unknown;
        events?: unknown[];
        output?: unknown;
        cancellation?: unknown;
        userId?: string;
        conversationId?: string;
        metadata?: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }>
    ).map((s) => ({
      id: s.id,
      workflowId: s.workflowId,
      workflowName: s.workflowName,
      status: s.status as WorkflowStateEntry["status"],
      input: s.input,
      context: s.context as WorkflowStateEntry["context"],
      suspension: s.suspension as WorkflowStateEntry["suspension"],
      events: s.events as WorkflowStateEntry["events"],
      output: s.output,
      cancellation: s.cancellation as WorkflowStateEntry["cancellation"],
      userId: s.userId,
      conversationId: s.conversationId,
      metadata: s.metadata,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  }
}
