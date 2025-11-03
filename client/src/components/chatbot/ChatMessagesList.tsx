"use client";

import React from "react";
import { Message } from "@/app/(pages)/levels-ai/page";
import { UserMessage } from "./messages/UserMessage";
import { AgentMessage } from "./messages/AgentMessage";
import { LoadingMessage } from "./LoadingMessage";
import { ErrorMessage } from "./ErrorMessage";

type ChatMessagesListProps = {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement> | null;
};

export function ChatMessagesList({
  messages,
  messagesEndRef,
}: ChatMessagesListProps) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-4">
      {messages.map((msg) => {
        switch (msg.type) {
          case "MESSAGE":
            return msg.role === "user" ? (
              <UserMessage key={msg.id} content={msg.content} />
            ) : null;
          case "RESPONSE":
            return <AgentMessage key={msg.id} content={msg.content} />;
          case "LOADING":
            return <LoadingMessage key={msg.id} content={msg.content} />;
          case "ERROR":
            return <ErrorMessage key={msg.id} content={msg.content} />;
          default:
            return null;
        }
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
