"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "@/types/cart-item";

interface CartItemsListProps {
  cartItems: CartItem[];
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onQtyChange: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemsList({
  cartItems,
  onQtyChange,
  onRemove,
  selectedIds,
  onSelect,
}: CartItemsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {cartItems.map((item) => (
        <Card
          key={String(item.item_id)}
          className="flex flex-row items-center p-4"
        >
          {/* Checkbox */}
          <div className="mr-4 flex items-center">
            <Checkbox
              checked={selectedIds.includes(String(item.item_id))}
              // --- THIS IS THE FIX ---
              onCheckedChange={(checked) =>
                onSelect?.(String(item.item_id), !!checked)
              }
              aria-label={`Select ${item.item_name}`}
            />
          </div>
          {/* Left: Item info and qty controls */}
          <div className="flex grow items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold">{item.item_name}</div>
              <div className="text-sm text-muted-foreground">
                SKU: {item.sku}
              </div>
              {item.variant && (
                <div className="text-xs text-muted-foreground">
                  Variant: {item.variant}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onQtyChange(
                    String(item.item_id),
                    Math.max(1, item.quantity - 1)
                  )
                }
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  onQtyChange(String(item.item_id), val);
                }}
                className="mx-2 w-12 text-center border rounded h-9 no-spinner"
                style={{ MozAppearance: "textfield" }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onQtyChange(String(item.item_id), item.quantity + 1)
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Right: Trash and subtotal */}
          <div className="flex flex-col items-end gap-2 ml-4 min-w-[80px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(String(item.item_id))}
              className="text-destructive"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
