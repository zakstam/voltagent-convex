import { getAgent } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const {
      messages,
      conversationId = "default",
      userId = "anonymous",
    } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const agent = getAgent();

    const result = await agent.streamText([lastMessage], {
      userId,
      conversationId,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[API] Chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
