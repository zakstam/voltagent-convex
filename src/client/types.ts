/**
 * VoltAgent Convex Component API Types
 *
 * These types define the structure of the VoltAgent component's API,
 * allowing type-safe access to component functions.
 */
import type { FunctionReference } from "convex/server";

/**
 * The VoltAgent Component API type.
 * This matches the structure of `components.voltagent` after installing the component.
 */
export type VoltAgentComponent = {
  conversations: {
    create: FunctionReference<
      "mutation",
      "internal",
      {
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: unknown;
      },
      {
        _id: string;
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }
    >;
    get: FunctionReference<
      "query",
      "internal",
      { id: string },
      {
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      } | null
    >;
    getByResourceId: FunctionReference<
      "query",
      "internal",
      { resourceId: string },
      Array<{
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }>
    >;
    getByUserId: FunctionReference<
      "query",
      "internal",
      {
        userId: string;
        limit?: number;
        offset?: number;
        orderBy?: string;
        orderDirection?: string;
      },
      Array<{
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }>
    >;
    queryConversations: FunctionReference<
      "query",
      "internal",
      {
        userId?: string;
        resourceId?: string;
        limit?: number;
        offset?: number;
        orderBy?: string;
        orderDirection?: string;
      },
      Array<{
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }>
    >;
    update: FunctionReference<
      "mutation",
      "internal",
      {
        id: string;
        title?: string;
        resourceId?: string;
        metadata?: unknown;
      },
      {
        id: string;
        resourceId: string;
        userId: string;
        title: string;
        metadata: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      }
    >;
    remove: FunctionReference<"mutation", "internal", { id: string }, null>;
  };
  messages: {
    add: FunctionReference<
      "mutation",
      "internal",
      {
        id: string;
        conversationId: string;
        userId: string;
        role: string;
        parts: unknown;
        metadata?: unknown;
      },
      { id: string }
    >;
    addMany: FunctionReference<
      "mutation",
      "internal",
      {
        messages: Array<{
          id: string;
          conversationId: string;
          userId: string;
          role: string;
          parts: unknown;
          metadata?: unknown;
        }>;
      },
      { count: number }
    >;
    get: FunctionReference<
      "query",
      "internal",
      {
        userId: string;
        conversationId: string;
        limit?: number;
        before?: string;
        after?: string;
        roles?: string[];
      },
      Array<{
        id: string;
        role: string;
        parts: unknown[];
        metadata?: Record<string, unknown>;
      }>
    >;
    clear: FunctionReference<
      "mutation",
      "internal",
      { userId: string; conversationId?: string },
      { count: number }
    >;
  };
  steps: {
    save: FunctionReference<
      "mutation",
      "internal",
      {
        steps: Array<{
          id: string;
          conversationId: string;
          userId: string;
          agentId: string;
          agentName?: string;
          operationId?: string;
          stepIndex: number;
          type: string;
          role: string;
          content?: string;
          arguments?: unknown;
          result?: unknown;
          usage?: unknown;
          subAgentId?: string;
          subAgentName?: string;
          createdAt?: string;
        }>;
      },
      { count: number }
    >;
    get: FunctionReference<
      "query",
      "internal",
      {
        userId: string;
        conversationId: string;
        limit?: number;
        operationId?: string;
      },
      Array<{
        id: string;
        conversationId: string;
        userId: string;
        agentId: string;
        agentName?: string;
        operationId?: string;
        stepIndex: number;
        type: string;
        role: string;
        content?: string;
        arguments?: unknown;
        result?: unknown;
        usage?: unknown;
        subAgentId?: string;
        subAgentName?: string;
        createdAt?: string;
      }>
    >;
  };
  workingMemory: {
    get: FunctionReference<
      "query",
      "internal",
      { conversationId?: string; userId?: string; scope: string },
      string | null
    >;
    set: FunctionReference<
      "mutation",
      "internal",
      {
        conversationId?: string;
        userId?: string;
        content: string;
        scope: string;
      },
      null
    >;
    remove: FunctionReference<
      "mutation",
      "internal",
      { conversationId?: string; userId?: string; scope: string },
      null
    >;
  };
  workflows: {
    get: FunctionReference<
      "query",
      "internal",
      { executionId: string },
      {
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
      } | null
    >;
    queryRuns: FunctionReference<
      "query",
      "internal",
      {
        workflowId?: string;
        status?: string;
        from?: string;
        to?: string;
        limit?: number;
        offset?: number;
      },
      Array<{
        id: string;
        workflowId: string;
        workflowName: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      }>
    >;
    set: FunctionReference<
      "mutation",
      "internal",
      {
        executionId: string;
        workflowId: string;
        workflowName: string;
        status: string;
        input?: unknown;
        context?: unknown;
        suspension?: unknown;
        events?: unknown;
        output?: unknown;
        cancellation?: unknown;
        userId?: string;
        conversationId?: string;
        metadata?: unknown;
        createdAt: string;
        updatedAt: string;
      },
      null
    >;
    update: FunctionReference<
      "mutation",
      "internal",
      {
        executionId: string;
        status?: string;
        suspension?: unknown;
        events?: unknown;
        output?: unknown;
        cancellation?: unknown;
        metadata?: unknown;
      },
      null
    >;
    getSuspended: FunctionReference<
      "query",
      "internal",
      { workflowId: string },
      Array<{
        id: string;
        workflowId: string;
        workflowName: string;
        status: "suspended";
        suspension?: unknown;
        createdAt: string;
        updatedAt: string;
      }>
    >;
  };
};
