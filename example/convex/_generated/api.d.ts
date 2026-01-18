/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as voltagent from "../voltagent.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  voltagent: typeof voltagent;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  voltagent: {
    conversations: {
      create: FunctionReference<
        "mutation",
        "internal",
        {
          id: string;
          metadata: Record<string, any>;
          resourceId: string;
          title: string;
          userId: string;
        },
        any
      >;
      get: FunctionReference<"query", "internal", { id: string }, any>;
      getByResourceId: FunctionReference<
        "query",
        "internal",
        { resourceId: string },
        any
      >;
      getByUserId: FunctionReference<
        "query",
        "internal",
        {
          limit?: number;
          offset?: number;
          orderBy?: string;
          orderDirection?: string;
          userId: string;
        },
        any
      >;
      queryConversations: FunctionReference<
        "query",
        "internal",
        {
          limit?: number;
          offset?: number;
          orderBy?: string;
          orderDirection?: string;
          resourceId?: string;
          userId?: string;
        },
        any
      >;
      remove: FunctionReference<"mutation", "internal", { id: string }, any>;
      update: FunctionReference<
        "mutation",
        "internal",
        {
          id: string;
          metadata?: Record<string, any>;
          resourceId?: string;
          title?: string;
        },
        any
      >;
    };
    messages: {
      add: FunctionReference<
        "mutation",
        "internal",
        {
          conversationId: string;
          id: string;
          metadata?: Record<string, any>;
          parts: Array<
            | {
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                text: string;
                type: "text";
              }
            | {
                image: string;
                mimeType?: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                type: "image";
              }
            | {
                data: string;
                filename?: string;
                mimeType: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                type: "file";
              }
            | {
                args: Record<string, any>;
                providerExecuted?: boolean;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                state?: "partial-call" | "call";
                toolCallId: string;
                toolName: string;
                type: "tool-call";
              }
            | {
                isError?: boolean;
                providerExecuted?: boolean;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                result?: any;
                toolCallId: string;
                toolName: string;
                type: "tool-result";
              }
            | {
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                signature?: string;
                text: string;
                type: "reasoning";
              }
            | {
                data: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                type: "redacted-reasoning";
              }
            | {
                filename?: string;
                id: string;
                mediaType?: string;
                providerMetadata?: Record<string, Record<string, any>>;
                providerOptions?: Record<string, Record<string, any>>;
                sourceType: "url" | "document";
                title?: string;
                type: "source";
                url?: string;
              }
          >;
          role: string;
          userId: string;
        },
        any
      >;
      addMany: FunctionReference<
        "mutation",
        "internal",
        {
          messages: Array<{
            conversationId: string;
            id: string;
            metadata?: Record<string, any>;
            parts: Array<
              | {
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  text: string;
                  type: "text";
                }
              | {
                  image: string;
                  mimeType?: string;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  type: "image";
                }
              | {
                  data: string;
                  filename?: string;
                  mimeType: string;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  type: "file";
                }
              | {
                  args: Record<string, any>;
                  providerExecuted?: boolean;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  state?: "partial-call" | "call";
                  toolCallId: string;
                  toolName: string;
                  type: "tool-call";
                }
              | {
                  isError?: boolean;
                  providerExecuted?: boolean;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  result?: any;
                  toolCallId: string;
                  toolName: string;
                  type: "tool-result";
                }
              | {
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  signature?: string;
                  text: string;
                  type: "reasoning";
                }
              | {
                  data: string;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  type: "redacted-reasoning";
                }
              | {
                  filename?: string;
                  id: string;
                  mediaType?: string;
                  providerMetadata?: Record<string, Record<string, any>>;
                  providerOptions?: Record<string, Record<string, any>>;
                  sourceType: "url" | "document";
                  title?: string;
                  type: "source";
                  url?: string;
                }
            >;
            role: string;
            userId: string;
          }>;
        },
        any
      >;
      clear: FunctionReference<
        "mutation",
        "internal",
        { conversationId?: string; userId: string },
        any
      >;
      get: FunctionReference<
        "query",
        "internal",
        {
          after?: string;
          before?: string;
          conversationId: string;
          limit?: number;
          roles?: Array<string>;
          userId: string;
        },
        any
      >;
    };
    steps: {
      get: FunctionReference<
        "query",
        "internal",
        {
          conversationId: string;
          limit?: number;
          operationId?: string;
          userId: string;
        },
        any
      >;
      save: FunctionReference<
        "mutation",
        "internal",
        {
          steps: Array<{
            agentId: string;
            agentName?: string;
            arguments?: Record<string, any>;
            content?: string;
            conversationId: string;
            createdAt?: string;
            id: string;
            operationId?: string;
            result?: any;
            role: string;
            stepIndex: number;
            subAgentId?: string;
            subAgentName?: string;
            type: string;
            usage?: {
              cachedInputTokens?: number;
              completionTokens?: number;
              promptTokens?: number;
              reasoningTokens?: number;
              totalTokens?: number;
            };
            userId: string;
          }>;
        },
        any
      >;
    };
    workflows: {
      get: FunctionReference<"query", "internal", { executionId: string }, any>;
      getSuspended: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        any
      >;
      queryRuns: FunctionReference<
        "query",
        "internal",
        {
          from?: string;
          limit?: number;
          offset?: number;
          status?: string;
          to?: string;
          workflowId?: string;
        },
        any
      >;
      set: FunctionReference<
        "mutation",
        "internal",
        {
          cancellation?: { cancelledAt: string; reason?: string };
          context?: Array<Array<any>>;
          conversationId?: string;
          createdAt: string;
          events?: Array<{
            context?: Record<string, any>;
            endTime?: string;
            from?: string;
            id: string;
            input?: any;
            metadata?: Record<string, any>;
            name?: string;
            output?: any;
            startTime: string;
            status?: string;
            type: string;
          }>;
          executionId: string;
          input?: any;
          metadata?: Record<string, any>;
          output?: any;
          status: string;
          suspension?: {
            checkpoint?: {
              completedStepsData?: Array<any>;
              stepExecutionState?: any;
            };
            lastEventSequence?: number;
            reason?: string;
            suspendData?: any;
            suspendedAt: string;
            suspendedStepIndex?: number;
          };
          updatedAt: string;
          userId?: string;
          workflowId: string;
          workflowName: string;
        },
        any
      >;
      update: FunctionReference<
        "mutation",
        "internal",
        {
          cancellation?: { cancelledAt: string; reason?: string };
          events?: Array<{
            context?: Record<string, any>;
            endTime?: string;
            from?: string;
            id: string;
            input?: any;
            metadata?: Record<string, any>;
            name?: string;
            output?: any;
            startTime: string;
            status?: string;
            type: string;
          }>;
          executionId: string;
          metadata?: Record<string, any>;
          output?: any;
          status?: string;
          suspension?: {
            checkpoint?: {
              completedStepsData?: Array<any>;
              stepExecutionState?: any;
            };
            lastEventSequence?: number;
            reason?: string;
            suspendData?: any;
            suspendedAt: string;
            suspendedStepIndex?: number;
          };
        },
        any
      >;
    };
    workingMemory: {
      get: FunctionReference<
        "query",
        "internal",
        { conversationId?: string; scope: string; userId?: string },
        any
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { conversationId?: string; scope: string; userId?: string },
        any
      >;
      set: FunctionReference<
        "mutation",
        "internal",
        {
          content: string;
          conversationId?: string;
          scope: string;
          userId?: string;
        },
        any
      >;
    };
  };
};
