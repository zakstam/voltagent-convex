/**
 * Conversation-related Convex functions
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { vMetadata } from "./validators";

/**
 * Create a new conversation
 */
export const create = mutation({
  args: {
    id: v.string(),
    resourceId: v.string(),
    userId: v.string(),
    title: v.string(),
    metadata: vMetadata,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.id))
      .first();

    if (existing) {
      throw new Error("Conversation already exists");
    }

    const now = new Date().toISOString();
    const id = await ctx.db.insert("conversations", {
      visibleId: args.id,
      resourceId: args.resourceId,
      userId: args.userId,
      title: args.title,
      metadata: args.metadata || {},
      createdAt: now,
      updatedAt: now,
    });

    return {
      _id: id,
      id: args.id,
      resourceId: args.resourceId,
      userId: args.userId,
      title: args.title,
      metadata: args.metadata || {},
      createdAt: now,
      updatedAt: now,
    };
  },
});

/**
 * Get a conversation by visible ID
 */
export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.id))
      .first();

    if (!conversation) {
      return null;
    }

    return {
      id: conversation.visibleId,
      resourceId: conversation.resourceId,
      userId: conversation.userId,
      title: conversation.title,
      metadata: conversation.metadata,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  },
});

/**
 * Get conversations by resource ID
 */
export const getByResourceId = query({
  args: { resourceId: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_resource_id", (q) => q.eq("resourceId", args.resourceId))
      .collect();

    return conversations.map((c) => ({
      id: c.visibleId,
      resourceId: c.resourceId,
      userId: c.userId,
      title: c.title,
      metadata: c.metadata,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },
});

/**
 * Get conversations by user ID with pagination and ordering
 */
// Map API field names to Convex schema field names
const orderByFieldMap: Record<string, string> = {
  created_at: "createdAt",
  updated_at: "updatedAt",
  title: "title",
  // Also support camelCase for flexibility
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};

export const getByUserId = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    orderBy: v.optional(v.string()),
    orderDirection: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Map the orderBy field and default to createdAt DESC per VoltAgent spec
    const sortField = orderByFieldMap[args.orderBy || ""] || "createdAt";
    const orderDir = args.orderDirection === "ASC" ? 1 : -1;

    conversations.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] as string;
      const bVal = b[sortField as keyof typeof b] as string;
      return orderDir * aVal.localeCompare(bVal);
    });

    const offset = args.offset || 0;
    const limit = args.limit || 50;
    conversations = conversations.slice(offset, offset + limit);

    return conversations.map((c) => ({
      id: c.visibleId,
      resourceId: c.resourceId,
      userId: c.userId,
      title: c.title,
      metadata: c.metadata,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },
});

/**
 * Query conversations with filters
 * Uses indexed queries to avoid loading all data into memory
 */
export const queryConversations = query({
  args: {
    userId: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    orderBy: v.optional(v.string()),
    orderDirection: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Use indexed queries based on available filters to avoid full table scans
    let conversations;

    if (args.userId) {
      // Use user_id index - most common query pattern
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId!))
        .collect();

      // Apply secondary filter if needed
      if (args.resourceId) {
        conversations = conversations.filter(
          (c) => c.resourceId === args.resourceId
        );
      }
    } else if (args.resourceId) {
      // Use resource_id index
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_resource_id", (q) => q.eq("resourceId", args.resourceId!))
        .collect();
    } else {
      // No filters - apply a reasonable limit to prevent memory issues
      // Return most recent conversations by default
      const maxUnfilteredResults = 1000;
      conversations = await ctx.db
        .query("conversations")
        .order("desc")
        .take(maxUnfilteredResults);
    }

    // Map the orderBy field and default to createdAt DESC per VoltAgent spec
    const sortField = orderByFieldMap[args.orderBy || ""] || "createdAt";
    const orderDir = args.orderDirection === "ASC" ? 1 : -1;

    conversations.sort((a, b) => {
      const aVal = a[sortField as keyof typeof a] as string;
      const bVal = b[sortField as keyof typeof b] as string;
      return orderDir * aVal.localeCompare(bVal);
    });

    const offset = args.offset || 0;
    const limit = args.limit || 50;
    conversations = conversations.slice(offset, offset + limit);

    return conversations.map((c) => ({
      id: c.visibleId,
      resourceId: c.resourceId,
      userId: c.userId,
      title: c.title,
      metadata: c.metadata,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  },
});

/**
 * Update a conversation
 */
export const update = mutation({
  args: {
    id: v.string(),
    title: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    metadata: v.optional(vMetadata),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.id))
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.resourceId !== undefined) updates.resourceId = args.resourceId;
    if (args.metadata !== undefined) updates.metadata = args.metadata;

    await ctx.db.patch(conversation._id, updates);

    const updated = await ctx.db.get(conversation._id);
    return {
      id: updated!.visibleId,
      resourceId: updated!.resourceId,
      userId: updated!.userId,
      title: updated!.title,
      metadata: updated!.metadata,
      createdAt: updated!.createdAt,
      updatedAt: updated!.updatedAt,
    };
  },
});

/**
 * Delete a conversation and all associated data
 */
export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_visible_id", (q) => q.eq("visibleId", args.id))
      .first();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Delete associated messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete associated steps
    const steps = await ctx.db
      .query("conversationSteps")
      .withIndex("by_conversation_id", (q) => q.eq("conversationId", args.id))
      .collect();

    for (const step of steps) {
      await ctx.db.delete(step._id);
    }

    await ctx.db.delete(conversation._id);

    return { success: true };
  },
});
