"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getItemDetails } from "@/lib/api/itemsApi";
import type { ItemWithComponents } from "@/types/item";

export interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
  onConfirm: (id: number, qty?: number) => Promise<void> | void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function AddToCartModal({
  open,
  onOpenChange,
  itemId,
  onConfirm,
  title = "Add to cart",
  description = "Confirm adding this item to the cart.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
}: AddToCartModalProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const [item, setItem] = React.useState<ItemWithComponents | null>(null);
  const [qty, setQty] = React.useState<number>(0);

  // Fetch item details when modal opens with a valid itemId
  React.useEffect(() => {
    let ignore = false;
    const fetchItem = async () => {
      if (!open || itemId == null) {
        setItem(null);
        setQty(0);
        return;
      }
      try {
        setFetching(true);
        const data = await getItemDetails(itemId);
        if (ignore) return;
        setItem(data);
        // Use threshold_qty as minQty fallback to 0
        const initialQty = typeof data?.threshold_qty === "number" ? data.threshold_qty : 0;
        setQty(initialQty);
      } catch (e) {
        // On error, still allow user to input a qty manually
        setItem(null);
        setQty(0);
      } finally {
        if (!ignore) setFetching(false);
      }
    };
    fetchItem();
    return () => {
      ignore = true;
    };
  }, [open, itemId]);

  const handleConfirm = async () => {
    if (itemId == null) return;
    try {
      setSubmitting(true);
      await onConfirm(itemId, qty);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} {itemId != null && <span>(ID: {itemId})</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Item name</Label>
            <div className="col-span-2 text-sm">
              {fetching ? "Loading..." : item?.item_name ?? "-"}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">SKU</Label>
            <div className="col-span-2 text-sm">
              {fetching ? "Loading..." : item?.sku ?? "-"}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="minQty" className="text-right">
              Min Qty
            </Label>
            <div className="col-span-2">
              <Input
                id="minQty"
                type="number"
                min={0}
                value={Number.isFinite(qty) ? qty : 0}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                disabled={fetching}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting || loading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting || loading || fetching || itemId == null}
          >
            {submitting || loading ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartModal;
