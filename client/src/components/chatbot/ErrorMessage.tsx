"use client";

import { Bot } from "lucide-react";

type ErrorMessageProps = {
  content: string;
};

export function ErrorMessage({ content }: ErrorMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="group flex max-w-[80%] items-start space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20 text-destructive">
          <Bot className="h-5 w-5" />
        </div>
        <div className="rounded-[var(--radius-xl)] border border-destructive/50 bg-destructive/10 p-3 text-destructive-foreground">
          <p className="whitespace-pre-wrap text-sm font-medium">
            Error: {content}
          </p>
        </div>
      </div>
    </div>
  );
}