/**
 * Workflow state functions for suspendable workflows
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  vMetadata,
  vSuspension,
  vCancellation,
  vWorkflowEvents,
  vWorkflowContext,
} from "./validators";

/**
 * Get workflow state by execution ID
 */
export const get = query({
  args: { executionId: v.string() },
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query("workflowStates")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.executionId))
      .first();

    if (!state) return null;

    return {
      id: state.visibleId,
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
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
    };
  },
});

/**
 * Query workflow runs with filters
 */
export const queryRuns = query({
  args: {
    workflowId: v.optional(v.string()),
    status: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let states = await ctx.db.query("workflowStates").collect();

    if (args.workflowId) {
      states = states.filter((s) => s.workflowId === args.workflowId);
    }
    if (args.status) {
      states = states.filter((s) => s.status === args.status);
    }
    if (args.from) {
      states = states.filter((s) => s.createdAt >= args.from!);
    }
    if (args.to) {
      states = states.filter((s) => s.createdAt <= args.to!);
    }

    states.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const offset = args.offset || 0;
    const limit = args.limit;
    if (limit !== undefined) {
      states = states.slice(offset, offset + limit);
    } else if (offset > 0) {
      states = states.slice(offset);
    }

    return states.map((s) => ({
      id: s.visibleId,
      workflowId: s.workflowId,
      workflowName: s.workflowName,
      status: s.status,
      input: s.input,
      context: s.context,
      suspension: s.suspension,
      events: s.events,
      output: s.output,
      cancellation: s.cancellation,
      userId: s.userId,
      conversationId: s.conversationId,
      metadata: s.metadata,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  },
});

/**
 * Set workflow state (create or replace)
 */
export const set = mutation({
  args: {
    executionId: v.string(),
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workflowStates")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.executionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        workflowId: args.workflowId,
        workflowName: args.workflowName,
        status: args.status,
        input: args.input,
        context: args.context,
        suspension: args.suspension,
        events: args.events,
        output: args.output,
        cancellation: args.cancellation,
        userId: args.userId,
        conversationId: args.conversationId,
        metadata: args.metadata,
        updatedAt: args.updatedAt,
      });
    } else {
      await ctx.db.insert("workflowStates", {
        visibleId: args.executionId,
        workflowId: args.workflowId,
        workflowName: args.workflowName,
        status: args.status,
        input: args.input,
        context: args.context,
        suspension: args.suspension,
        events: args.events,
        output: args.output,
        cancellation: args.cancellation,
        userId: args.userId,
        conversationId: args.conversationId,
        metadata: args.metadata,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
      });
    }

    return { success: true };
  },
});

/**
 * Update workflow state
 */
export const update = mutation({
  args: {
    executionId: v.string(),
    status: v.optional(v.string()),
    suspension: v.optional(vSuspension),
    events: v.optional(vWorkflowEvents),
    output: v.optional(v.any()), // Keep as v.any() - workflow output can be any shape
    cancellation: v.optional(vCancellation),
    metadata: v.optional(vMetadata),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workflowStates")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.executionId))
      .first();

    if (!existing) {
      throw new Error("Workflow state not found");
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.status !== undefined) updates.status = args.status;
    if (args.suspension !== undefined) updates.suspension = args.suspension;
    if (args.events !== undefined) updates.events = args.events;
    if (args.output !== undefined) updates.output = args.output;
    if (args.cancellation !== undefined)
      updates.cancellation = args.cancellation;
    if (args.metadata !== undefined) updates.metadata = args.metadata;

    await ctx.db.patch(existing._id, updates);

    return { success: true };
  },
});

/**
 * Get suspended workflow states for a workflow
 * Returns full WorkflowStateEntry to match the interface contract
 */
export const getSuspended = query({
  args: { workflowId: v.string() },
  handler: async (ctx, args) => {
    const states = await ctx.db
      .query("workflowStates")
      .withIndex("by_workflow_id_and_status", (q) =>
        q.eq("workflowId", args.workflowId).eq("status", "suspended"),
      )
      .collect();

    states.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // Return all fields to match WorkflowStateEntry interface
    return states.map((s) => ({
      id: s.visibleId,
      workflowId: s.workflowId,
      workflowName: s.workflowName,
      status: s.status,
      input: s.input,
      context: s.context,
      suspension: s.suspension,
      events: s.events,
      output: s.output,
      cancellation: s.cancellation,
      userId: s.userId,
      conversationId: s.conversationId,
      metadata: s.metadata,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  },
});
