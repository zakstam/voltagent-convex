import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Agent, Memory } from "@voltagent/core";
import { ConvexHttpClient } from "convex/browser";
import { ConvexMemoryAdapter } from "@voltagent/convex";
import { api } from "../convex/_generated/api";

// Lazy initialization to avoid build-time errors
let _agent: Agent | null = null;

export function getAgent(): Agent {
  if (!_agent) {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
    });

    const convexClient = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL!,
    );

    const memoryAdapter = new ConvexMemoryAdapter({
      client: convexClient,
      api: api.voltagent,
    });

    _agent = new Agent({
      name: "Assistant",
      instructions: `You are a helpful assistant that remembers conversations.
You can recall past discussions and maintain context across sessions.
Be friendly, concise, and helpful.`,
      model: openrouter("google/gemini-2.0-flash-001"),
      memory: new Memory({ storage: memoryAdapter }),
    });
  }
  return _agent;
}
