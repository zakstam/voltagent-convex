/* eslint-disable */
/**
 * Generated `ComponentApi` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { FunctionReference } from "convex/server";

/**
 * A utility for referencing a Convex component's exposed API.
 *
 * Useful when expecting a parameter like `components.myComponent`.
 * Usage:
 * ```ts
 * async function myFunction(ctx: QueryCtx, component: ComponentApi) {
 *   return ctx.runQuery(component.someFile.someQuery, { ...args });
 * }
 * ```
 */
export type ComponentApi<Name extends string | undefined = string | undefined> =
  {
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
        any,
        Name
      >;
      get: FunctionReference<"query", "internal", { id: string }, any, Name>;
      getByResourceId: FunctionReference<
        "query",
        "internal",
        { resourceId: string },
        any,
        Name
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
        any,
        Name
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
        any,
        Name
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { id: string },
        any,
        Name
      >;
      update: FunctionReference<
        "mutation",
        "internal",
        {
          id: string;
          metadata?: Record<string, any>;
          resourceId?: string;
          title?: string;
        },
        any,
        Name
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
        any,
        Name
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
        any,
        Name
      >;
      clear: FunctionReference<
        "mutation",
        "internal",
        { conversationId?: string; userId: string },
        any,
        Name
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
        any,
        Name
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
        any,
        Name
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
        any,
        Name
      >;
    };
    workflows: {
      get: FunctionReference<
        "query",
        "internal",
        { executionId: string },
        any,
        Name
      >;
      getSuspended: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        any,
        Name
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
        any,
        Name
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
        any,
        Name
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
        any,
        Name
      >;
    };
    workingMemory: {
      get: FunctionReference<
        "query",
        "internal",
        { conversationId?: string; scope: string; userId?: string },
        any,
        Name
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { conversationId?: string; scope: string; userId?: string },
        any,
        Name
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
        any,
        Name
      >;
    };
  };
