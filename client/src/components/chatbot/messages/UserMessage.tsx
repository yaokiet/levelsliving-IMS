"use client";

import { User } from "lucide-react";

type UserMessageProps = {
  content: string;
};

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="group flex max-w-[80%] items-start space-x-3">
        <div className="rounded-[var(--radius-xl)] bg-primary p-3 text-primary-foreground">
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
