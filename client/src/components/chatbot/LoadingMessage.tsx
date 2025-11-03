"use client";

import { Bot } from "lucide-react";

type LoadingMessageProps = {
  content: string;
};

export function LoadingMessage({ content }: LoadingMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="group flex max-w-[80%] items-start space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border">
          <Bot className="h-5 w-5 text-foreground" />
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-3 text-card-foreground">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{content}</span>
            <div className="flex space-x-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
