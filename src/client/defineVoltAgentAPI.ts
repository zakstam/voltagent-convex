/**
 * VoltAgent API Generator
 *
 * This function generates public Convex query/mutation functions that wrap
 * the VoltAgent component's internal functions. This allows external HTTP
 * clients to call the functions via ConvexHttpClient.
 *
 * Usage:
 * ```typescript
 * // convex/voltagent.ts
 * import { components } from "./_generated/api";
 * import { defineVoltAgentAPI } from "@voltagent/convex/api";
 *
 * export const {
 *   createConversation,
 *   getConversation,
 *   // ... other functions
 * } = defineVoltAgentAPI(components.voltagent);
 * ```
 */
import {
  queryGeneric,
  mutationGeneric,
  type ApiFromModules,
} from "convex/server";
import { v } from "convex/values";

// Use a minimal interface that matches the component structure
// This avoids deep type instantiation when combined with other Convex components
interface VoltAgentComponentLike {
  conversations: {
    create: any;
    get: any;
    getByResourceId: any;
    getByUserId: any;
    queryConversations: any;
    update: any;
    remove: any;
  };
  messages: {
    add: any;
    addMany: any;
    get: any;
    clear: any;
  };
  steps: {
    save: any;
    get: any;
  };
  workingMemory: {
    get: any;
    set: any;
    remove: any;
  };
  workflows: {
    get: any;
    getSuspended: any;
    queryRuns: any;
    set: any;
    update: any;
  };
}

/**
 * Define the VoltAgent API functions.
 *
 * @param component - The VoltAgent component reference (components.voltagent)
 * @returns An object containing all VoltAgent API functions
 */
export function defineVoltAgentAPI<T extends VoltAgentComponentLike>(
  component: T,
) {
  // ============================================================================
  // Conversation Functions
  // ============================================================================

  const createConversation = mutationGeneric({
    args: {
      id: v.string(),
      resourceId: v.string(),
      userId: v.string(),
      title: v.string(),
      metadata: v.any(),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.conversations.create, args);
    },
  });

  const getConversation = queryGeneric({
    args: { id: v.string() },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.conversations.get, args);
    },
  });

  const getConversations = queryGeneric({
    args: { resourceId: v.string() },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.conversations.getByResourceId, args);
    },
  });

  const getConversationsByUserId = queryGeneric({
    args: {
      userId: v.string(),
      limit: v.optional(v.number()),
      offset: v.optional(v.number()),
      orderBy: v.optional(v.string()),
      orderDirection: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.conversations.getByUserId, args);
    },
  });

  const queryConversations = queryGeneric({
    args: {
      userId: v.optional(v.string()),
      resourceId: v.optional(v.string()),
      limit: v.optional(v.number()),
      offset: v.optional(v.number()),
      orderBy: v.optional(v.string()),
      orderDirection: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.conversations.queryConversations, args);
    },
  });

  const updateConversation = mutationGeneric({
    args: {
      id: v.string(),
      title: v.optional(v.string()),
      resourceId: v.optional(v.string()),
      metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.conversations.update, args);
    },
  });

  const deleteConversation = mutationGeneric({
    args: { id: v.string() },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.conversations.remove, args);
    },
  });

  // ============================================================================
  // Message Functions
  // ============================================================================

  const addMessage = mutationGeneric({
    args: {
      id: v.string(),
      conversationId: v.string(),
      userId: v.string(),
      role: v.string(),
      parts: v.any(),
      metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.messages.add, args);
    },
  });

  const addMessages = mutationGeneric({
    args: {
      messages: v.array(
        v.object({
          id: v.string(),
          conversationId: v.string(),
          userId: v.string(),
          role: v.string(),
          parts: v.any(),
          metadata: v.optional(v.any()),
        }),
      ),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.messages.addMany, args);
    },
  });

  const getMessages = queryGeneric({
    args: {
      userId: v.string(),
      conversationId: v.string(),
      limit: v.optional(v.number()),
      before: v.optional(v.string()),
      after: v.optional(v.string()),
      roles: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.messages.get, args);
    },
  });

  const clearMessages = mutationGeneric({
    args: {
      userId: v.string(),
      conversationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.messages.clear, args);
    },
  });

  // ============================================================================
  // Conversation Steps Functions
  // ============================================================================

  const saveConversationSteps = mutationGeneric({
    args: {
      steps: v.array(
        v.object({
          id: v.string(),
          conversationId: v.string(),
          userId: v.string(),
          agentId: v.string(),
          agentName: v.optional(v.string()),
          operationId: v.optional(v.string()),
          stepIndex: v.number(),
          type: v.string(),
          role: v.string(),
          content: v.optional(v.string()),
          arguments: v.optional(v.any()),
          result: v.optional(v.any()),
          usage: v.optional(v.any()),
          subAgentId: v.optional(v.string()),
          subAgentName: v.optional(v.string()),
          createdAt: v.optional(v.string()),
        }),
      ),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.steps.save, args);
    },
  });

  const getConversationSteps = queryGeneric({
    args: {
      userId: v.string(),
      conversationId: v.string(),
      limit: v.optional(v.number()),
      operationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.steps.get, args);
    },
  });

  // ============================================================================
  // Working Memory Functions
  // ============================================================================

  const getWorkingMemory = queryGeneric({
    args: {
      conversationId: v.optional(v.string()),
      userId: v.optional(v.string()),
      scope: v.string(),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.workingMemory.get, args);
    },
  });

  const setWorkingMemory = mutationGeneric({
    args: {
      conversationId: v.optional(v.string()),
      userId: v.optional(v.string()),
      content: v.string(),
      scope: v.string(),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.workingMemory.set, args);
    },
  });

  const deleteWorkingMemory = mutationGeneric({
    args: {
      conversationId: v.optional(v.string()),
      userId: v.optional(v.string()),
      scope: v.string(),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.workingMemory.remove, args);
    },
  });

  // ============================================================================
  // Workflow State Functions
  // ============================================================================

  const getWorkflowState = queryGeneric({
    args: { executionId: v.string() },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.workflows.get, args);
    },
  });

  const queryWorkflowRuns = queryGeneric({
    args: {
      workflowId: v.optional(v.string()),
      status: v.optional(v.string()),
      from: v.optional(v.string()),
      to: v.optional(v.string()),
      limit: v.optional(v.number()),
      offset: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.workflows.queryRuns, args);
    },
  });

  const setWorkflowState = mutationGeneric({
    args: {
      executionId: v.string(),
      workflowId: v.string(),
      workflowName: v.string(),
      status: v.string(),
      input: v.optional(v.any()),
      context: v.optional(v.any()),
      suspension: v.optional(v.any()),
      events: v.optional(v.any()),
      output: v.optional(v.any()),
      cancellation: v.optional(v.any()),
      userId: v.optional(v.string()),
      conversationId: v.optional(v.string()),
      metadata: v.optional(v.any()),
      createdAt: v.string(),
      updatedAt: v.string(),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.workflows.set, args);
    },
  });

  const updateWorkflowState = mutationGeneric({
    args: {
      executionId: v.string(),
      status: v.optional(v.string()),
      suspension: v.optional(v.any()),
      events: v.optional(v.any()),
      output: v.optional(v.any()),
      cancellation: v.optional(v.any()),
      metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
      return ctx.runMutation(component.workflows.update, args);
    },
  });

  const getSuspendedWorkflowStates = queryGeneric({
    args: { workflowId: v.string() },
    handler: async (ctx, args) => {
      return ctx.runQuery(component.workflows.getSuspended, args);
    },
  });

  return {
    // Conversations
    createConversation,
    getConversation,
    getConversations,
    getConversationsByUserId,
    queryConversations,
    updateConversation,
    deleteConversation,
    // Messages
    addMessage,
    addMessages,
    getMessages,
    clearMessages,
    // Conversation Steps
    saveConversationSteps,
    getConversationSteps,
    // Working Memory
    getWorkingMemory,
    setWorkingMemory,
    deleteWorkingMemory,
    // Workflow State
    getWorkflowState,
    queryWorkflowRuns,
    setWorkflowState,
    updateWorkflowState,
    getSuspendedWorkflowStates,
  };
}

/**
 * Type for the VoltAgent API when used with ApiFromModules.
 *
 * Usage:
 * ```typescript
 * import type { VoltAgentAPI } from "@voltagent/convex/api";
 * ```
 */
export type VoltAgentAPI = ApiFromModules<{
  voltagent: ReturnType<typeof defineVoltAgentAPI>;
}>["voltagent"];
