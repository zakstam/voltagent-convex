/**
 * Shared Convex validators for type-safe data validation
 *
 * These validators replace v.any() usages with properly typed validators
 * for better type safety throughout the VoltAgent storage adapter.
 */
import { v } from "convex/values";

// === Provider Options/Metadata ===
// These are optional nested records that providers can attach to parts
export const vProviderOptions = v.record(
  v.string(),
  v.record(v.string(), v.any()),
);
const providerOptions = v.optional(vProviderOptions);
const providerMetadata = v.optional(vProviderOptions);

// === Message Parts ===

export const vTextPart = v.object({
  type: v.literal("text"),
  text: v.string(),
  providerOptions,
  providerMetadata,
});

export const vImagePart = v.object({
  type: v.literal("image"),
  image: v.string(), // base64 or URL
  mimeType: v.optional(v.string()),
  providerOptions,
  providerMetadata,
});

export const vFilePart = v.object({
  type: v.literal("file"),
  data: v.string(),
  filename: v.optional(v.string()),
  mimeType: v.string(),
  providerOptions,
  providerMetadata,
});

export const vToolCallPart = v.object({
  type: v.literal("tool-call"),
  toolCallId: v.string(),
  toolName: v.string(),
  args: v.record(v.string(), v.any()), // Tool args remain flexible but typed as record
  state: v.optional(v.union(v.literal("partial-call"), v.literal("call"))),
  providerExecuted: v.optional(v.boolean()),
  providerOptions,
  providerMetadata,
});

export const vToolResultPart = v.object({
  type: v.literal("tool-result"),
  toolCallId: v.string(),
  toolName: v.string(),
  result: v.optional(v.any()), // Result can be any JSON-serializable value
  isError: v.optional(v.boolean()),
  providerExecuted: v.optional(v.boolean()),
  providerOptions,
  providerMetadata,
});

export const vReasoningPart = v.object({
  type: v.literal("reasoning"),
  text: v.string(),
  signature: v.optional(v.string()),
  providerOptions,
  providerMetadata,
});

export const vRedactedReasoningPart = v.object({
  type: v.literal("redacted-reasoning"),
  data: v.string(),
  providerOptions,
  providerMetadata,
});

export const vSourcePart = v.object({
  type: v.literal("source"),
  sourceType: v.union(v.literal("url"), v.literal("document")),
  id: v.string(),
  url: v.optional(v.string()),
  title: v.optional(v.string()),
  mediaType: v.optional(v.string()),
  filename: v.optional(v.string()),
  providerOptions,
  providerMetadata,
});

// Union of all message part types
export const vMessagePart = v.union(
  vTextPart,
  vImagePart,
  vFilePart,
  vToolCallPart,
  vToolResultPart,
  vReasoningPart,
  vRedactedReasoningPart,
  vSourcePart,
);

export const vMessageParts = v.array(vMessagePart);

// === Metadata ===

export const vMetadata = v.record(v.string(), v.any());

// === Usage Statistics ===

export const vUsage = v.object({
  promptTokens: v.optional(v.number()),
  completionTokens: v.optional(v.number()),
  totalTokens: v.optional(v.number()),
  reasoningTokens: v.optional(v.number()),
  cachedInputTokens: v.optional(v.number()),
});

// === Workflow Types ===

export const vSuspension = v.object({
  suspendedAt: v.string(),
  reason: v.optional(v.string()),
  suspendedStepIndex: v.optional(v.number()),
  lastEventSequence: v.optional(v.number()),
  suspendData: v.optional(v.any()),
  checkpoint: v.optional(
    v.object({
      stepExecutionState: v.optional(v.any()),
      completedStepsData: v.optional(v.array(v.any())),
    }),
  ),
});

export const vCancellation = v.object({
  cancelledAt: v.string(),
  reason: v.optional(v.string()),
});

export const vWorkflowEvent = v.object({
  id: v.string(),
  type: v.string(),
  name: v.optional(v.string()),
  from: v.optional(v.string()),
  startTime: v.string(),
  endTime: v.optional(v.string()),
  status: v.optional(v.string()),
  input: v.optional(v.any()),
  output: v.optional(v.any()),
  metadata: v.optional(vMetadata),
  context: v.optional(vMetadata),
});

export const vWorkflowEvents = v.array(vWorkflowEvent);

// Context is stored as array of key-value pairs (from Map serialization)
export const vWorkflowContext = v.array(
  v.array(v.any()), // [key, value] pairs
);
