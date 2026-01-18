"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, FormEvent, useMemo } from "react";
import { DefaultChatTransport } from "ai";

interface MessagePart {
  type: string;
  text?: string;
}

interface DisplayMessage {
  id: string;
  role: string;
  parts: MessagePart[];
  isStreaming?: boolean;
}

export function Chat() {
  const [conversationId] = useState("demo-conversation");
  const [userId] = useState("demo-user");
  const [input, setInput] = useState("");

  // Real-time messages from Convex subscription (persisted messages)
  const convexMessages = useQuery(api.voltagent.getMessages, {
    conversationId,
    userId,
  });

  // AI SDK v6 for sending messages and streaming
  const {
    sendMessage,
    status,
    messages: streamingMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId, userId },
    }),
  });

  const isStreaming = status === "streaming";
  const isLoading = isStreaming || status === "submitted";

  // Merge persisted messages with streaming response
  const displayMessages = useMemo((): DisplayMessage[] => {
    const persisted: DisplayMessage[] = (convexMessages || []).map(
      (m: { id: string; role: string; parts: MessagePart[] }) => ({
        id: m.id,
        role: m.role,
        parts: m.parts as MessagePart[],
      }),
    );

    // If streaming, show the current streaming assistant message
    if (isStreaming && streamingMessages.length > 0) {
      const lastStreamingMsg = streamingMessages[streamingMessages.length - 1];
      if (lastStreamingMsg.role === "assistant") {
        // Check if this message is already in persisted (by checking if it has content)
        const alreadyPersisted = persisted.some(
          (p) => p.role === "assistant" && p.id === lastStreamingMsg.id,
        );

        if (!alreadyPersisted) {
          // Add the streaming message
          const streamingParts: MessagePart[] = lastStreamingMsg.parts
            .filter((p) => p.type === "text")
            .map((p) => ({
              type: "text",
              text: p.type === "text" ? p.text : "",
            }));

          if (streamingParts.length > 0) {
            persisted.push({
              id: lastStreamingMsg.id,
              role: "assistant",
              parts: streamingParts,
              isStreaming: true,
            });
          }
        }
      }
    }

    return persisted;
  }, [convexMessages, streamingMessages, isStreaming]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: message }],
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">VoltAgent + Convex Chat</h1>
      <p className="text-sm text-gray-500 mb-4">
        Messages sync in real-time across tabs via Convex subscriptions
      </p>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-gray-50">
        {convexMessages === undefined ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : displayMessages.length === 0 ? (
          <div className="text-center text-gray-400">
            No messages yet. Start a conversation!
          </div>
        ) : (
          displayMessages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white border shadow-sm"
              }`}
            >
              {m.parts.map((part, i) => (
                <span key={i}>{part.type === "text" ? part.text : null}</span>
              ))}
              {m.isStreaming && (
                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
              )}
            </div>
          ))
        )}

        {status === "submitted" && (
          <div className="bg-white border shadow-sm p-3 rounded-lg max-w-[80%] animate-pulse">
            <span className="text-gray-400">Thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
