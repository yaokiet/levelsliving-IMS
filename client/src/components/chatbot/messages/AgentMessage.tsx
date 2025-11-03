"use client";

import { Bot } from "lucide-react";
import { ResponseSchema } from "@/app/(pages)/levels-ai/page";
import { ChatbotChart } from "../ChatbotChart";

type AgentMessageProps = {
  content: ResponseSchema;
};

export function AgentMessage({ content }: AgentMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="group flex max-w-[80%] items-start space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border">
          <Bot className="h-5 w-5 text-foreground" />
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-3 text-card-foreground">
          <p className="whitespace-pre-wrap text-sm">{content.response}</p>

          {content.data && (
            <div className="mt-4 pt-3 border-t border-border">
              <ChatbotChart chartData={content.data as any} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
