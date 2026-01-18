/**
 * VoltAgent Convex API
 *
 * Generates VoltAgent wrapper functions that call the component.
 * This makes the functions available via api.voltagent.*
 */
import { components } from "./_generated/api";
import { defineVoltAgentAPI } from "@voltagent/convex/api";

export const {
  // Conversations
  createConversation,
  getConversation,
  getConversations,
  getConversationsByUserId,
  queryConversations,
  updateConversation,
  deleteConversation,
  // Messages
  addMessage,
  addMessages,
  getMessages,
  clearMessages,
  // Conversation Steps
  saveConversationSteps,
  getConversationSteps,
  // Working Memory
  getWorkingMemory,
  setWorkingMemory,
  deleteWorkingMemory,
  // Workflow State
  getWorkflowState,
  queryWorkflowRuns,
  setWorkflowState,
  updateWorkflowState,
  getSuspendedWorkflowStates,
} = defineVoltAgentAPI(components.voltagent);
