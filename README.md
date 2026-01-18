# @o-zakstam/voltagent-convex

Convex Storage Adapter for [VoltAgent](https://voltagent.dev) - A StorageAdapter implementation that persists conversation history, working memory, and workflow state to a [Convex](https://convex.dev) database using Convex Components.

## Features

- Full `StorageAdapter` interface implementation
- Convex Component architecture for clean integration
- Conversation and message persistence
- Working memory support (conversation and user scopes)
- Workflow state management for suspendable workflows
- Conversation steps for observability
- Real-time updates with Convex subscriptions
- TypeScript support with full type definitions

## Installation

```bash
npm install @o-zakstam/voltagent-convex convex
# or
pnpm add @o-zakstam/voltagent-convex convex
# or
yarn add @o-zakstam/voltagent-convex convex
```

## Quick Start

### 1. Install the VoltAgent Component

In your `convex/convex.config.ts`, import and install the VoltAgent component:

```typescript
import { defineApp } from "convex/server";
import voltagent from "@o-zakstam/voltagent-convex/convex.config";

const app = defineApp();
app.use(voltagent);

export default app;
```

### 2. Create the API Wrapper Functions

Create a `convex/voltagent.ts` file that generates the public API functions:

```typescript
import { components } from "./_generated/api";
import { defineVoltAgentAPI } from "@o-zakstam/voltagent-convex/api";

export const {
  createConversation,
  getConversation,
  getConversations,
  getConversationsByUserId,
  queryConversations,
  updateConversation,
  deleteConversation,
  addMessage,
  addMessages,
  getMessages,
  clearMessages,
  saveConversationSteps,
  getConversationSteps,
  getWorkingMemory,
  setWorkingMemory,
  deleteWorkingMemory,
  getWorkflowState,
  queryWorkflowRuns,
  setWorkflowState,
  updateWorkflowState,
  getSuspendedWorkflowStates,
} = defineVoltAgentAPI(components.voltagent);
```

### 3. Run Convex code generation

After updating your config and creating the wrapper file, run:

```bash
npx convex dev
```

This will generate the component types in your `convex/_generated/` directory.

### 4. Use the adapter in your VoltAgent

```typescript
import { Agent, Memory, VoltAgent } from "@voltagent/core";
import { ConvexHttpClient } from "convex/browser";
import { ConvexMemoryAdapter } from "@o-zakstam/voltagent-convex";
import { api } from "./convex/_generated/api";
import { openai } from "@ai-sdk/openai";

// Create a Convex client
const convexClient = new ConvexHttpClient(process.env.CONVEX_URL!);

// Create the memory adapter
const memory = new Memory({
  storage: new ConvexMemoryAdapter({
    client: convexClient,
    api: api.voltagent,
    debug: process.env.NODE_ENV === "development",
  }),
});

// Create your agent with Convex-backed memory
const agent = new Agent({
  name: "Assistant",
  instructions: "A helpful assistant that remembers conversations.",
  model: openai("gpt-4o-mini"),
  memory,
});

// Run VoltAgent
new VoltAgent({
  agents: { agent },
});
```

## Configuration Options

```typescript
interface ConvexMemoryAdapterOptions {
  /**
   * The Convex client instance.
   * Can be ConvexHttpClient or ConvexReactClient.
   */
  client: ConvexClient;

  /**
   * The VoltAgent API from your Convex generated code.
   * Import from "./convex/_generated/api" and use api.voltagent
   */
  api: VoltAgentApi;

  /**
   * Enable debug logging (default: false)
   */
  debug?: boolean;

  /**
   * Custom logger instance
   */
  logger?: Logger;
}
```

## Component Architecture

This package uses [Convex Components](https://docs.convex.dev/components) to provide a clean, isolated integration. The component:

- Creates its own isolated set of tables
- Manages all schema and functions internally
- Doesn't conflict with your existing Convex tables
- Updates automatically when you update the package

## Table Structure

The component creates the following tables (isolated in the component namespace):

| Table | Description |
|-------|-------------|
| `conversations` | Stores conversation metadata |
| `messages` | Stores individual messages |
| `users` | Stores user-level working memory |
| `workflowStates` | Stores workflow execution state |
| `conversationSteps` | Stores detailed steps for observability |

## Working Memory

The adapter supports both conversation-scoped and user-scoped working memory:

```typescript
const memory = new Memory({
  storage: new ConvexMemoryAdapter({ client, api: api.voltagent }),
  workingMemory: {
    enabled: true,
    scope: "conversation", // or "user"
  },
});
```

## Workflow State

For suspendable workflows, the adapter persists workflow state including:

- Workflow execution status
- Suspension checkpoints
- Workflow events for visualization
- Output and cancellation data

## Using with React

With Convex React, you can use the `ConvexReactClient`:

```typescript
import { useConvex } from "convex/react";
import { ConvexMemoryAdapter } from "@o-zakstam/voltagent-convex";
import { api } from "./convex/_generated/api";

function useMemoryAdapter() {
  const convex = useConvex();
  
  return new ConvexMemoryAdapter({
    client: convex,
    api: api.voltagent,
  });
}
```

## Known Limitations

### OperationContext Not Supported

The `OperationContext` parameter is accepted by all methods for interface compatibility but is currently not used. This means the following features from the VoltAgent interface are not implemented:

- **Multi-tenancy isolation**: Context-based tenant separation is not applied
- **Audit logging**: Operation context is not logged or stored
- **Access control**: Context-based permissions are not enforced

If you need these features, you can extend `ConvexMemoryAdapter` and override the relevant methods to implement custom context handling:

```typescript
import { ConvexMemoryAdapter } from "@o-zakstam/voltagent-convex";
import type { OperationContext } from "@voltagent/core";

class CustomConvexMemoryAdapter extends ConvexMemoryAdapter {
  async addMessage(
    message: UIMessage,
    userId: string,
    conversationId: string,
    context?: OperationContext,
  ): Promise<void> {
    // Custom context handling
    if (context) {
      const tenantId = context.context.get("tenantId");
      // Apply tenant isolation logic
    }
    return super.addMessage(message, userId, conversationId, context);
  }
}
```

## API Reference

### ConvexMemoryAdapter

Implements the `StorageAdapter` interface from `@voltagent/core`:

#### Message Operations
- `addMessage(message, userId, conversationId)` - Add a single message
- `addMessages(messages, userId, conversationId)` - Add multiple messages
- `getMessages(userId, conversationId, options?)` - Get messages with filtering
- `clearMessages(userId, conversationId?)` - Clear messages

#### Conversation Operations
- `createConversation(input)` - Create a new conversation
- `getConversation(id)` - Get a conversation by ID
- `getConversations(resourceId)` - Get conversations by resource
- `getConversationsByUserId(userId, options?)` - Get user's conversations
- `queryConversations(options)` - Query with filters
- `updateConversation(id, updates)` - Update a conversation
- `deleteConversation(id)` - Delete a conversation

#### Working Memory Operations
- `getWorkingMemory(params)` - Get working memory content
- `setWorkingMemory(params)` - Set working memory content
- `deleteWorkingMemory(params)` - Delete working memory

#### Workflow State Operations
- `getWorkflowState(executionId)` - Get workflow state
- `queryWorkflowRuns(query)` - Query workflow runs
- `setWorkflowState(executionId, state)` - Set workflow state
- `updateWorkflowState(executionId, updates)` - Update workflow state
- `getSuspendedWorkflowStates(workflowId)` - Get suspended workflows

#### Conversation Steps Operations
- `saveConversationSteps(steps)` - Save conversation steps
- `getConversationSteps(userId, conversationId, options?)` - Get steps

## License

MIT

## Links

- [VoltAgent Documentation](https://voltagent.dev/docs/)
- [Convex Documentation](https://docs.convex.dev/)
- [Convex Components Documentation](https://docs.convex.dev/components)
- [GitHub Repository](https://github.com/zakstam/voltagent-convex)
