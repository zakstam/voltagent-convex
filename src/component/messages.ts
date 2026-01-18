/**
 * Message-related Convex functions
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { vMessageParts, vMetadata } from "./validators";

/**
 * Add a single message to a conversation
 */
export const add = mutation({
  args: {
    id: v.string(),
    conversationId: v.string(),
    userId: v.string(),
    role: v.string(),
    parts: vMessageParts,
    metadata: v.optional(vMetadata),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("messages")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.id))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: args.role,
        parts: args.parts,
        metadata: args.metadata,
      });
      return { id: args.id, updated: true };
    }

    await ctx.db.insert("messages", {
      visibleId: args.id,
      conversationId: args.conversationId,
      userId: args.userId,
      role: args.role,
      parts: args.parts,
      metadata: args.metadata,
      createdAt: now,
    });

    return { id: args.id, created: true };
  },
});

/**
 * Add multiple messages to a conversation
 */
export const addMany = mutation({
  args: {
    messages: v.array(
      v.object({
        id: v.string(),
        conversationId: v.string(),
        userId: v.string(),
        role: v.string(),
        parts: vMessageParts,
        metadata: v.optional(vMetadata),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const results: Array<{ id: string; created?: boolean; updated?: boolean }> =
      [];

    for (const msg of args.messages) {
      const existing = await ctx.db
        .query("messages")
        .withIndex("by_visible_id", (q) => q.eq("visibleId", msg.id))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          role: msg.role,
          parts: msg.parts,
          metadata: msg.metadata,
        });
        results.push({ id: msg.id, updated: true });
      } else {
        await ctx.db.insert("messages", {
          visibleId: msg.id,
          conversationId: msg.conversationId,
          userId: msg.userId,
          role: msg.role,
          parts: msg.parts,
          metadata: msg.metadata,
          createdAt: now,
        });
        results.push({ id: msg.id, created: true });
      }
    }

    return results;
  },
});

/**
 * Get messages from a conversation with optional filtering
 */
export const get = query({
  args: {
    userId: v.string(),
    conversationId: v.string(),
    limit: v.optional(v.number()),
    before: v.optional(v.string()),
    after: v.optional(v.string()),
    roles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Use compound index for efficient filtering by both conversationId and userId
    let messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_id_and_user_id", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", args.userId),
      )
      .collect();

    if (args.roles && args.roles.length > 0) {
      messages = messages.filter((m) => args.roles!.includes(m.role));
    }

    if (args.before) {
      messages = messages.filter((m) => m.createdAt < args.before!);
    }
    if (args.after) {
      messages = messages.filter((m) => m.createdAt > args.after!);
    }

    messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const limit = args.limit || 100;
    if (messages.length > limit) {
      messages = messages.slice(-limit);
    }

    return messages.map((m) => ({
      id: m.visibleId,
      role: m.role,
      parts: m.parts,
      metadata: {
        ...m.metadata,
        createdAt: m.createdAt,
      },
    }));
  },
});

/**
 * Clear messages for a user (optionally for a specific conversation)
 */
export const clear = mutation({
  args: {
    userId: v.string(),
    conversationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.conversationId) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation_id", (q) =>
          q.eq("conversationId", args.conversationId!),
        )
        .collect();

      const userMessages = messages.filter((m) => m.userId === args.userId);
      for (const message of userMessages) {
        await ctx.db.delete(message._id);
      }

      const steps = await ctx.db
        .query("conversationSteps")
        .withIndex("by_conversation_id", (q) =>
          q.eq("conversationId", args.conversationId!),
        )
        .collect();

      const userSteps = steps.filter((s) => s.userId === args.userId);
      for (const step of userSteps) {
        await ctx.db.delete(step._id);
      }
    } else {
      const conversations = await ctx.db
        .query("conversations")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .collect();

      for (const conversation of conversations) {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation_id", (q) =>
            q.eq("conversationId", conversation.visibleId),
          )
          .collect();

        for (const message of messages) {
          await ctx.db.delete(message._id);
        }

        const steps = await ctx.db
          .query("conversationSteps")
          .withIndex("by_conversation_id", (q) =>
            q.eq("conversationId", conversation.visibleId),
          )
          .collect();

        for (const step of steps) {
          await ctx.db.delete(step._id);
        }
      }
    }

    return { success: true };
  },
});
