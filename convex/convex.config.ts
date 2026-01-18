/**
 * VoltAgent Convex Component Configuration
 *
 * This file defines the VoltAgent component for Convex.
 * When users install this component in their Convex project,
 * they get isolated tables and functions for VoltAgent memory storage.
 */
import { defineComponent } from "convex/server";

/**
 * VoltAgent component definition.
 *
 * This component provides:
 * - Conversation storage with metadata
 * - Message persistence with UIMessage format
 * - Working memory (conversation and user scoped)
 * - Workflow state management for suspendable workflows
 * - Conversation steps for observability
 */
const component = defineComponent("voltagent");

export default component;
