/**
 * VoltAgent Convex Storage Adapter
 *
 * A StorageAdapter implementation for VoltAgent that persists
 * conversation data to Convex database using a Convex component.
 *
 * @packageDocumentation
 */

// Main adapter class
export { ConvexMemoryAdapter } from "./memory-adapter";

// Types
export type {
  ConvexMemoryAdapterOptions,
  ConvexClient,
  Logger,
  VoltAgentApi,
  ConvexConversation,
  ConvexMessage,
  ConvexUser,
  ConvexWorkflowState,
  ConvexConversationStep,
} from "./types";
