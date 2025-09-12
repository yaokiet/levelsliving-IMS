"use client";

import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useState } from "react";
import { removeItemComponent } from "@/lib/api/apiItemComponent";
import { Button } from "@/components/ui/button";

type MinimalItem = {
  id: number;
  sku: string;
  item_name: string;
};

interface ItemRemoveComponentModalProps {
  parent: MinimalItem;
  child: MinimalItem;
  onRemoved?: () => void | Promise<void>;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  hideLauncher?: boolean;
  triggerLabel?: string;
}

export function ItemRemoveComponentModal({
  parent,
  child,
  onRemoved,
  isOpen,
  setIsOpen,
  hideLauncher,
  triggerLabel = "Remove Component",
}: ItemRemoveComponentModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setSubmitting(false);
    }
  }, [setOpen]);

  const onConfirm = useCallback(async () => {
    setError(null);
    try {
      setSubmitting(true);
      await removeItemComponent(parent.id, child.id);
      await onRemoved?.();
      return { status: 200 };
    } catch (e: unknown) {
      const fallback = "An error occurred while removing the component.";
      const msg =
        e &&
        typeof e === "object" &&
        "message" in e &&
        typeof (e as any).message === "string"
          ? (e as any).message
          : fallback;

      console.error(e);
      setError(msg || fallback);
      return { status: 500 };
    } finally {
      setSubmitting(false);
    }
  }, [parent.id, child.id, onRemoved]);

  return (
    <>
      {!hideLauncher && (
        <Button variant="destructive" onClick={() => setOpen(true)}>
          {submitting ? "Removing..." : triggerLabel}
        </Button>
      )}

      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle="Remove Component"
        confirmButtonText={submitting ? "Removing..." : "Remove"}
        cancelButtonText="Cancel"
        onConfirm={onConfirm}
      >
        <div className="grid gap-4">
          {error && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {error}
            </div>
          )}

          <p className="text-sm">
            You are about to remove the following component relationship:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Parent Item</h3>
              <div className="text-sm">
                <div><span className="font-medium">ID:</span> {parent.id}</div>
                <div><span className="font-medium">SKU:</span> {parent.sku}</div>
                <div><span className="font-medium">Name:</span> {parent.item_name}</div>
              </div>
            </div>

            <div className="border rounded p-3">
              <h3 className="font-semibold mb-2">Child Item</h3>
              <div className="text-sm">
                <div><span className="font-medium">ID:</span> {child.id}</div>
                <div><span className="font-medium">SKU:</span> {child.sku}</div>
                <div><span className="font-medium">Name:</span> {child.item_name}</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            This action will only remove the relationship. It will not delete either item.
          </p>
        </div>
      </ReusableDialog>
    </>
  );
}