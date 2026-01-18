/**
 * VoltAgent Convex Component Schema
 *
 * Defines all tables used by the VoltAgent storage adapter.
 * These tables are isolated within the component namespace.
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  vMessageParts,
  vMetadata,
  vUsage,
  vSuspension,
  vCancellation,
  vWorkflowEvents,
  vWorkflowContext,
} from "./validators";

/**
 * Conversations table - stores conversation metadata
 */
const conversations = defineTable({
  visibleId: v.string(),
  resourceId: v.string(),
  userId: v.string(),
  title: v.string(),
  metadata: vMetadata,
  createdAt: v.string(),
  updatedAt: v.string(),
})
  .index("by_visible_id", ["visibleId"])
  .index("by_user_id", ["userId"])
  .index("by_resource_id", ["resourceId"])
  .index("by_user_id_and_updated_at", ["userId", "updatedAt"]);

/**
 * Messages table - stores conversation messages in UIMessage format
 */
const messages = defineTable({
  visibleId: v.string(),
  conversationId: v.string(),
  userId: v.string(),
  role: v.string(),
  parts: vMessageParts,
  metadata: v.optional(vMetadata),
  createdAt: v.string(),
})
  .index("by_conversation_id", ["conversationId"])
  .index("by_conversation_id_and_created_at", ["conversationId", "createdAt"])
  .index("by_conversation_id_and_user_id", ["conversationId", "userId"])
  .index("by_user_id", ["userId"])
  .index("by_visible_id", ["visibleId"]);

/**
 * Users table - stores user-level working memory
 */
const users = defineTable({
  visibleId: v.string(),
  metadata: v.optional(vMetadata),
  createdAt: v.string(),
  updatedAt: v.string(),
}).index("by_visible_id", ["visibleId"]);

/**
 * Workflow States table - stores workflow execution state for suspendable workflows
 */
const workflowStates = defineTable({
  visibleId: v.string(),
  workflowId: v.string(),
  workflowName: v.string(),
  status: v.string(),
  input: v.optional(v.any()), // Keep as v.any() - workflow input can be any shape
  context: v.optional(vWorkflowContext),
  suspension: v.optional(vSuspension),
  events: v.optional(vWorkflowEvents),
  output: v.optional(v.any()), // Keep as v.any() - workflow output can be any shape
  cancellation: v.optional(vCancellation),
  userId: v.optional(v.string()),
  conversationId: v.optional(v.string()),
  metadata: v.optional(vMetadata),
  createdAt: v.string(),
  updatedAt: v.string(),
})
  .index("by_visible_id", ["visibleId"])
  .index("by_workflow_id", ["workflowId"])
  .index("by_status", ["status"])
  .index("by_workflow_id_and_status", ["workflowId", "status"])
  .index("by_created_at", ["createdAt"]);

/**
 * Conversation Steps table - stores detailed conversation steps for observability
 */
const conversationSteps = defineTable({
  visibleId: v.string(),
  conversationId: v.string(),
  userId: v.string(),
  agentId: v.string(),
  agentName: v.optional(v.string()),
  operationId: v.optional(v.string()),
  stepIndex: v.number(),
  type: v.string(),
  role: v.string(),
  content: v.optional(v.string()),
  arguments: v.optional(vMetadata),
  result: v.optional(v.any()), // Keep as v.any() - tool results can be any shape
  usage: v.optional(vUsage),
  subAgentId: v.optional(v.string()),
  subAgentName: v.optional(v.string()),
  createdAt: v.string(),
})
  .index("by_visible_id", ["visibleId"])
  .index("by_conversation_id", ["conversationId"])
  .index("by_conversation_id_and_step_index", ["conversationId", "stepIndex"])
  .index("by_conversation_id_and_operation_id", [
    "conversationId",
    "operationId",
  ])
  .index("by_user_id", ["userId"]);

export default defineSchema({
  conversations,
  messages,
  users,
  workflowStates,
  conversationSteps,
});
