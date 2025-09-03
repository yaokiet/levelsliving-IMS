"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface AddToCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
  onConfirm: (id: number) => Promise<void> | void;
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

  const handleConfirm = async () => {
    if (itemId == null) return;
    try {
      setSubmitting(true);
      await onConfirm(itemId);
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting || loading}>
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm} disabled={submitting || loading || itemId == null}>
            {submitting || loading ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartModal;
