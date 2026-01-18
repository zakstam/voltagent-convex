/**
 * Conversation steps functions for observability
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { vMetadata, vUsage } from "./validators";

/**
 * Save conversation steps
 */
export const save = mutation({
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
        arguments: v.optional(vMetadata),
        result: v.optional(v.any()), // Keep as v.any() - tool results can be any shape
        usage: v.optional(vUsage),
        subAgentId: v.optional(v.string()),
        subAgentName: v.optional(v.string()),
        createdAt: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    for (const step of args.steps) {
      const existing = await ctx.db
        .query("conversationSteps")
        .withIndex("by_visible_id", (q) => q.eq("visibleId", step.id))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
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
        });
      } else {
        await ctx.db.insert("conversationSteps", {
          visibleId: step.id,
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
          createdAt: step.createdAt || now,
        });
      }
    }

    return { success: true, count: args.steps.length };
  },
});

/**
 * Get conversation steps
 */
export const get = query({
  args: {
    userId: v.string(),
    conversationId: v.string(),
    limit: v.optional(v.number()),
    operationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let steps = await ctx.db
      .query("conversationSteps")
      .withIndex("by_conversation_id", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    steps = steps.filter((s) => s.userId === args.userId);

    if (args.operationId) {
      steps = steps.filter((s) => s.operationId === args.operationId);
    }

    steps.sort((a, b) => a.stepIndex - b.stepIndex);

    if (args.limit && args.limit > 0 && steps.length > args.limit) {
      steps = steps.slice(-args.limit);
    }

    return steps.map((s) => ({
      id: s.visibleId,
      conversationId: s.conversationId,
      userId: s.userId,
      agentId: s.agentId,
      agentName: s.agentName,
      operationId: s.operationId,
      stepIndex: s.stepIndex,
      type: s.type,
      role: s.role,
      content: s.content,
      arguments: s.arguments,
      result: s.result,
      usage: s.usage,
      subAgentId: s.subAgentId,
      subAgentName: s.subAgentName,
      createdAt: s.createdAt,
    }));
  },
});
