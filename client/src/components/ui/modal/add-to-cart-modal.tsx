"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getLowestChildren } from "@/lib/api/itemsApi";
import { addMultipleItemsToCart } from "@/lib/api/cartApi";
import type { LowestChildDetail } from "@/types/item";
import type { CartBulkCreatePayload } from "@/types/cart";

export interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
  itemName: string | null;
  onSuccess?: () => void;
}

export function AddToCartModal({
  open,
  onOpenChange,
  itemId,
  itemName,
  onSuccess,
}: AddToCartModalProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);

  const [components, setComponents] = React.useState<LowestChildDetail[]>([]);
  const [quantities, setQuantities] = React.useState<Record<number, number>>(
    {}
  );

  React.useEffect(() => {
    let ignore = false;
    const fetchComponents = async () => {
      if (!open || itemId == null) {
        setComponents([]);
        setQuantities({});
        return;
      }
      try {
        setFetching(true);
        const data = await getLowestChildren(itemId);
        if (ignore) return;

        setComponents(data);
        const initialQuantities = data.reduce((acc, component) => {
          acc[component.id] = component.total_qty_required;
          return acc;
        }, {} as Record<number, number>);
        setQuantities(initialQuantities);
      } catch (e) {
        toast.error("Failed to fetch components", {
          description:
            e instanceof Error ? e.message : "An unknown error occurred.",
        });
        setComponents([]);
        setQuantities({});
      } finally {
        if (!ignore) setFetching(false);
      }
    };
    fetchComponents();
    return () => {
      ignore = true;
    };
  }, [open, itemId]);

  const handleQuantityChange = (componentId: number, value: string) => {
    const newQty = Number(value);
    if (!isNaN(newQty) && newQty >= 0) {
      setQuantities((prev) => ({ ...prev, [componentId]: newQty }));
    }
  };

  const handleConfirm = async () => {
    if (itemId == null || components.length === 0) return;

    const payload: CartBulkCreatePayload = {
      items: Object.entries(quantities)
        .map(([id, quantity]) => ({
          item_id: Number(id),
          quantity,
        }))
        .filter((item) => item.quantity > 0),
    };

    if (payload.items.length === 0) {
      toast("No items to add", {
        description: "All quantities are zero.",
      });
      return;
    }

    try {
      setSubmitting(true);
      await addMultipleItemsToCart(payload);
      toast.success("Success!", {
        description: "Components have been added to the cart.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to add items to cart", {
        description:
          e instanceof Error ? e.message : "An unknown error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasComponents = components.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Components for: {itemName ?? "Item"}</DialogTitle>
          <DialogDescription>
            This item is composed of the following parts. Adjust the quantities
            needed before adding to the cart.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto space-y-4 py-2 pr-4">
          {fetching && <p>Loading components...</p>}
          {!fetching && !hasComponents && (
            <p>This item has no components to add.</p>
          )}

          {hasComponents &&
            components.map((component) => (
              <div
                key={component.id}
                className="grid grid-cols-3 items-center gap-4"
              >
                <div className="col-span-2">
                  <Label
                    htmlFor={`qty-${component.id}`}
                    className="font-semibold"
                  >
                    {component.item_name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    SKU: {component.sku}
                  </p>
                </div>
                <Input
                  id={`qty-${component.id}`}
                  type="number"
                  min={0}
                  value={quantities[component.id] ?? 0}
                  onChange={(e) =>
                    handleQuantityChange(component.id, e.target.value)
                  }
                  disabled={submitting}
                />
              </div>
            ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting || fetching || !hasComponents}
          >
            {submitting ? "Adding..." : "Add to Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
