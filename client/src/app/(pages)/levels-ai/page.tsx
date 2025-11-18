"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessagesList } from "@/components/chatbot/ChatMessagesList";
import { ChatInputForm } from "@/components/chatbot/ChatInputForm";
import { ConnectionStatus } from "@/components/chatbot/ConnectionStatus";

// --- Type Definitions ---

export type Message = {
  id: string;
  role: "user" | "agent";
  type: "MESSAGE" | "LOADING" | "RESPONSE" | "ERROR";
  content: any;
};

export type ResponseSchema = {
  response: string;
  data: any;
};

// --- Page Component ---

export default function ChatbotPage() {
  // --- State Hooks ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now().toString(),
      role: "agent",
      type: "RESPONSE",
      content: {
        response: "Click the 'Connect' button to start your session.",
        data: null,
      },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- WebSocket Connection Handlers ---

  /**
   * Establishes the WebSocket connection and sets up event listeners.
   */
  const connectWebSocket = () => {
    // Prevent multiple connections
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected.");
      return;
    }

    const WEBSOCKET_URL = `${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}/levelsliving/app/api/v1/llm/query`;
    ws.current = new WebSocket(WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
      // Clear messages and set welcome message
      setMessages([
        {
          id: Date.now().toString(),
          role: "agent",
          type: "RESPONSE",
          content: {
            response:
              "Hello! I'm the database assistant. How can I help you today?",
            data: null,
          },
        },
      ]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsConnected(false);
      // Add a disconnected message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "agent",
          type: "ERROR",
          content: "Connection closed. Click 'Connect' to restart.",
        },
      ]);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      setMessages((prev) => [
        ...prev.filter((m) => m.type !== "LOADING"),
        {
          id: Date.now().toString(),
          role: "agent",
          type: "ERROR",
          content:
            "Sorry, a connection error occurred. Please try connecting again.",
        },
      ]);
    };

    ws.current.onmessage = (event) => {
      console.log("RAW WEBSOCKET DATA:", event.data);
      const message = JSON.parse(event.data);
      const eventType = message.type;
      const eventData = message.data;

      setMessages((currentMessages) => {
        const messagesWithoutLoading = currentMessages.filter(
          (msg) => msg.type !== "LOADING"
        );

        if (eventType === "loading_text") {
          return [
            ...messagesWithoutLoading,
            {
              id: Date.now().toString(),
              role: "agent",
              type: "LOADING",
              content: eventData,
            },
          ];
        }

        if (eventType === "response") {
          const lastMessage = currentMessages[currentMessages.length - 1];

          if (
            lastMessage?.role === "agent" &&
            lastMessage?.type === "RESPONSE"
          ) {
            return [
              ...currentMessages.slice(0, -1),
              {
                id: lastMessage.id,
                role: "agent",
                type: "RESPONSE",
                content: eventData,
              },
            ];
          } else {
            return [
              ...messagesWithoutLoading,
              {
                id: Date.now().toString(),
                role: "agent",
                type: "RESPONSE",
                content: eventData,
              },
            ];
          }
        }

        if (eventType === "error") {
          return [
            ...messagesWithoutLoading,
            {
              id: Date.now().toString(),
              role: "agent",
              type: "ERROR",
              content: eventData.toString(),
            },
          ];
        }
        return currentMessages;
      });
    };
  };

  /**
   * Manually closes the WebSocket connection.
   */
  const closeWebSocket = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  };

  // --- Auto-Scrolling Effect ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Form & Input Handlers ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = inputValue.trim();

    if (
      !messageText ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    ws.current.send(messageText);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        type: "MESSAGE",
        content: messageText,
      },
    ]);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.current.send(suggestion);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        type: "MESSAGE",
        content: suggestion,
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // --- Render ---

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col rounded-lg border border-border bg-card shadow-lg h-[80vh]">
        {/* Header with Connection Buttons */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h1 className="text-xl font-bold">LevelsAI </h1>
            <p className="text-xs pt-2 text-muted-foreground text-wrap w-5/6">
              Note: This feature is still a work in progress, LevelsAI is prone to hallucination. If your queries fail, reconnect or refresh your browser and try again. 
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <ConnectionStatus isConnected={isConnected} />
            {!isConnected ? (
              <button
                onClick={connectWebSocket}
                className="px-3 py-1 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Connect
              </button>
            ) : (
              <button
                onClick={closeWebSocket}
                className="px-3 py-1 text-sm text-white font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Message List */}
        <ChatMessagesList messages={messages} messagesEndRef={messagesEndRef} />

        <div className="p-4 border-t border-border">
          <ChatInputForm
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            handleKeyDown={handleKeyDown}
            handleSuggestionClick={handleSuggestionClick}
            isConnected={isConnected} // This prop will correctly disable the form
          />
        </div>
      </div>
    </div>
  );
}
