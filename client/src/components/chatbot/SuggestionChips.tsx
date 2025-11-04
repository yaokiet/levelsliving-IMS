"use client";

type SuggestionChipsProps = {
  onClick: (suggestion: string) => void;
};

export function SuggestionChips({ onClick }: SuggestionChipsProps) {
  const suggestions = [
    "How many 'Wireless Mouse' are in stock?",
    "List all suppliers",
    "Generate a visualisation for items with the highest threshold quantity",
    "Do I need to order more LED bulbs?"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onClick(text)}
          className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
