/**
 * Type definitions for VoltAgent Convex Memory Adapter
 */

/**
 * Logger interface for the adapter
 */
export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

/**
 * Convex client interface - compatible with ConvexHttpClient and ConvexReactClient.
 *
 * This interface is intentionally loose to accommodate different Convex client
 * implementations (ConvexHttpClient, ConvexReactClient) which have slightly
 * different method signatures.
 */
export interface ConvexClient {
  query: (functionReference: any, ...args: any[]) => Promise<any>;
  mutation: (functionReference: any, ...args: any[]) => Promise<any>;
}

/**
 * The VoltAgent API structure.
 * This matches the wrapper functions exported from the convex/api.ts file.
 */
export interface VoltAgentApi {
  createConversation: unknown;
  getConversation: unknown;
  getConversations: unknown;
  getConversationsByUserId: unknown;
  queryConversations: unknown;
  updateConversation: unknown;
  deleteConversation: unknown;
  addMessage: unknown;
  addMessages: unknown;
  getMessages: unknown;
  clearMessages: unknown;
  saveConversationSteps: unknown;
  getConversationSteps: unknown;
  getWorkingMemory: unknown;
  setWorkingMemory: unknown;
  deleteWorkingMemory: unknown;
  getWorkflowState: unknown;
  queryWorkflowRuns: unknown;
  setWorkflowState: unknown;
  updateWorkflowState: unknown;
  getSuspendedWorkflowStates: unknown;
}

/**
 * Configuration options for ConvexMemoryAdapter
 */
export interface ConvexMemoryAdapterOptions {
  /**
   * The Convex client instance to use for queries and mutations.
   * Can be a ConvexHttpClient or ConvexReactClient.
   */
  client: ConvexClient;

  /**
   * Whether to enable debug logging.
   * @default false
   */
  debug?: boolean;

  /**
   * Custom logger instance.
   * If not provided, a default console logger will be used when debug is enabled.
   */
  logger?: Logger;

  /**
   * The VoltAgent API from your Convex generated code.
   *
   * After adding the voltagent.ts file to your convex folder that re-exports
   * the wrapper functions, import the api and pass api.voltagent here.
   *
   * @example
   * ```ts
   * import { api } from "./convex/_generated/api";
   *
   * const adapter = new ConvexMemoryAdapter({
   *   client,
   *   api: api.voltagent,
   * });
   * ```
   */
  api: VoltAgentApi;
}

/**
 * Internal representation of a conversation in Convex
 */
export interface ConvexConversation {
  _id: string;
  visibleId: string;
  resourceId: string;
  userId: string;
  title: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Internal representation of a message in Convex
 */
export interface ConvexMessage {
  _id: string;
  visibleId: string;
  conversationId: string;
  userId: string;
  role: string;
  parts: unknown[];
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Internal representation of a user in Convex
 */
export interface ConvexUser {
  _id: string;
  visibleId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Internal representation of a workflow state in Convex
 */
export interface ConvexWorkflowState {
  _id: string;
  visibleId: string;
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
}

/**
 * Internal representation of a conversation step in Convex
 */
export interface ConvexConversationStep {
  _id: string;
  visibleId: string;
  conversationId: string;
  userId: string;
  agentId: string;
  agentName?: string;
  operationId?: string;
  stepIndex: number;
  type: string;
  role: string;
  content?: string;
  arguments?: Record<string, unknown>;
  result?: Record<string, unknown>;
  usage?: Record<string, unknown>;
  subAgentId?: string;
  subAgentName?: string;
  createdAt: string;
}
