"use client";

// DataTableAddSelected
// A small, reusable toolbar button for TanStack Table instances.
// It collects the currently selected rows and calls a callback (e.g., add to cart).
// - Disabled when nothing is selected.
// - Styled with shadcn/ui Button tokens (works in both light/dark themes).
// - Optional icon and badge to show selected count.

import * as React from "react";
import type { Table as TanTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props for the DataTableAddSelected toolbar button.
 * @template TData Row data type of the table.
 */
interface DataTableAddSelectedProps<TData> {
  /** The TanStack Table instance (from useReactTable). */
  table: TanTable<TData>;
  /** Callback invoked with the selected row originals when the button is clicked. */
  onAddSelected: (items: TData[]) => void;
  /** Button label text. Defaults to "Add to cart". */
  label?: string;
  /** If true, clears the table row selection after adding. */
  clearAfterAdd?: boolean;
  /** Optional className for custom spacing/placement. */
  className?: string;
  /** shadcn/ui Button variant. */
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  /** shadcn/ui Button size. */
  size?: "default" | "sm" | "lg" | "icon";
  /** Show a small badge with the selected count. */
  showCountBadge?: boolean;
  /** Hide the leading ShoppingCart icon. */
  hideIcon?: boolean;
}

/**
 * Renders an action button that operates on the currently selected rows.
 * Typical usage:
 *   renderToolbarExtras={({ table }) => (
 *     <DataTableAddSelected table={table} onAddSelected={(rows) => addToCart(rows)} />
 *   )}
 */
export function DataTableAddSelected<TData>({
  table,
  onAddSelected,
  label = "Add to cart",
  clearAfterAdd = false,
  className,
  variant = "secondary",
  size = "sm",
  showCountBadge = true,
  hideIcon = false,
}: DataTableAddSelectedProps<TData>) {
  // Number of selected rows on the current page/model.
  const count = table.getSelectedRowModel().flatRows.length;

  // On click, collect the selected row originals and invoke the callback.
  // Optionally clear the selection afterward.
  const handleClick = React.useCallback(() => {
    const items = table.getSelectedRowModel().flatRows.map((r) => r.original as TData);
    onAddSelected(items);
    if (clearAfterAdd) {
      table.resetRowSelection();
    }
  }, [table, onAddSelected, clearAfterAdd]);

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={count === 0} // Disabled when no rows are selected
      variant={variant}
      size={size}
      className={cn(
        // gap for icon/label/badge; relies on shadcn theme tokens for light/dark
        "gap-2",
        className
      )}
      aria-label={label}
      title={label}
    >
      {/* Optional leading icon for better affordance */}
      {!hideIcon && <ShoppingCart className="h-4 w-4" aria-hidden="true" />}
      <span className="whitespace-nowrap">{label}</span>
      {showCountBadge && count > 0 && (
        <span
          className="ml-1 inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
          aria-live="polite"
        >
          {count}
        </span>
      )}
    </Button>
  );
}
