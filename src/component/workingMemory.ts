/**
 * Working memory functions for conversation and user-scoped memory
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get working memory content
 */
export const get = query({
  args: {
    conversationId: v.optional(v.string()),
    userId: v.optional(v.string()),
    scope: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.scope === "conversation" && args.conversationId) {
      const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_visible_id", (q) =>
          q.eq("visibleId", args.conversationId!)
        )
        .first();

      if (!conversation) return null;
      return (conversation.metadata as Record<string, unknown>)
        ?.workingMemory as string | null;
    }

    if (args.scope === "user" && args.userId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_visible_id", (q) => q.eq("visibleId", args.userId!))
        .first();

      if (!user) return null;
      return (user.metadata as Record<string, unknown>)?.workingMemory as
        | string
        | null;
    }

    return null;
  },
});

/**
 * Set working memory content
 */
export const set = mutation({
  args: {
    conversationId: v.optional(v.string()),
    userId: v.optional(v.string()),
    content: v.string(),
    scope: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    if (args.scope === "conversation" && args.conversationId) {
      const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_visible_id", (q) =>
          q.eq("visibleId", args.conversationId!)
        )
        .first();

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const metadata = {
        ...(conversation.metadata || {}),
        workingMemory: args.content,
      };
      await ctx.db.patch(conversation._id, { metadata, updatedAt: now });

      return { success: true };
    }

    if (args.scope === "user" && args.userId) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_visible_id", (q) => q.eq("visibleId", args.userId!))
        .first();

      if (existing) {
        const metadata = {
          ...(existing.metadata || {}),
          workingMemory: args.content,
        };
        await ctx.db.patch(existing._id, { metadata, updatedAt: now });
      } else {
        await ctx.db.insert("users", {
          visibleId: args.userId!,
          metadata: { workingMemory: args.content },
          createdAt: now,
          updatedAt: now,
        });
      }

      return { success: true };
    }

    return { success: false };
  },
});

/**
 * Delete working memory content
 */
export const remove = mutation({
  args: {
    conversationId: v.optional(v.string()),
    userId: v.optional(v.string()),
    scope: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    if (args.scope === "conversation" && args.conversationId) {
      const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_visible_id", (q) =>
          q.eq("visibleId", args.conversationId!)
        )
        .first();

      if (
        conversation &&
        (conversation.metadata as Record<string, unknown>)?.workingMemory
      ) {
        const metadata = {
          ...(conversation.metadata as Record<string, unknown>),
        };
        delete metadata.workingMemory;
        await ctx.db.patch(conversation._id, { metadata, updatedAt: now });
      }

      return { success: true };
    }

    if (args.scope === "user" && args.userId) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_visible_id", (q) => q.eq("visibleId", args.userId!))
        .first();

      if (user && (user.metadata as Record<string, unknown>)?.workingMemory) {
        const metadata = { ...(user.metadata as Record<string, unknown>) };
        delete metadata.workingMemory;
        await ctx.db.patch(user._id, { metadata, updatedAt: now });
      }

      return { success: true };
    }

    return { success: false };
  },
});
