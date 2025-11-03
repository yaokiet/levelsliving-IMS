"use client";

import React from "react";
import { Send, Signal, CornerDownLeft } from "lucide-react";
import { SuggestionChips } from "./SuggestionChips";

type ChatInputFormProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSuggestionClick: (suggestion: string) => void;
  isConnected: boolean;
};

export function ChatInputForm({
  inputValue,
  setInputValue,
  handleSubmit,
  handleKeyDown,
  handleSuggestionClick,
  isConnected,
}: ChatInputFormProps) {
  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col space-y-3">
      <SuggestionChips onClick={handleSuggestionClick} />
      <form onSubmit={handleSubmit} className="flex items-start space-x-2">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type your message..."
          className="flex-1 rounded-md border border-input bg-transparent p-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[150px] resize-none"
          rows={1}
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || !isConnected}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isConnected ? (
            <Send className="h-4 w-4" />
          ) : (
            <Signal className="h-4 w-4" />
          )}
        </button>
      </form>
      <p className="text-xs text-muted-foreground ml-2">
        <CornerDownLeft className="inline h-3 w-3" />
        <span className="font-semibold">Enter</span> to send,{" "}
        <span className="font-semibold">Shift+Enter</span> for new line.
      </p>
    </div>
  );
}