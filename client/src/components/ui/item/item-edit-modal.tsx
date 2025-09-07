import type { Item, ItemUpdate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateExistingItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";

interface ItemEditModalProps {
  item: Item;
  onUpdated?: () => void | Promise<void>;
  setIsOpen?: (open: boolean) => void;
  hideLauncher?: boolean;
  isOpen?: boolean;
}

// Local form state type as strings for easier input handling
type FormState = {
  item_name: string;
  sku: string;
  variant: string; // keep empty string for null semantics
  type: string;
  qty: string; // hold numeric as string while editing
  threshold_qty: string; // same as qty
};

// Build initial form state from Item
function initFormFromItem(item: Item): FormState {
  return {
    item_name: item.item_name ?? "",
    sku: item.sku ?? "",
    variant: item.variant ?? "",
    type: item.type ?? "",
    qty: String(item.qty ?? 0),
    threshold_qty: String(item.threshold_qty ?? 0),
  };
}

// Safely parse a non-negative integer from a string (base-10)
function parseNonNegativeInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

export function ItemEditModal({ item, onUpdated, isOpen, setIsOpen, hideLauncher }: ItemEditModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;
  // const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => initFormFromItem(item));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep form in sync when the item changes externally
  useEffect(() => {
    setForm(initFormFromItem(item));
  }, [item]);

  // Reset errors and optionally reset form when dialog open changes
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        // Clear error and reset form when closing for a fresh start next time
        setError(null);
        setForm(initFormFromItem(item));
        setSubmitting(false);
      }
    },
    [item, setOpen]
  );

  // Generic input change handler factory
  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  // Derived flag: has anything changed?
  const initialForm = useMemo(() => initFormFromItem(item), [item]);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  // Validate and build ItemUpdate payload from form
  const validateAndBuildPayload = (): {
    payload?: ItemUpdate;
    message?: string;
  } => {
    const name = form.item_name.trim();
    const sku = form.sku.trim();
    const type = form.type.trim();
    const variantRaw = (form.variant ?? "").trim();

    if (!name) return { message: "Item Name is required." };
    if (!sku) return { message: "Item SKU is required." };
    if (!type) return { message: "Type is required." };

    const qtyNum = parseNonNegativeInt(form.qty);
    const thresholdNum = parseNonNegativeInt(form.threshold_qty);

    if (qtyNum === null)
      return { message: "Quantity must be a non-negative integer." };
    if (thresholdNum === null)
      return { message: "Threshold Qty must be a non-negative integer." };

    const payload: ItemUpdate = {
      item_name: name,
      sku,
      variant: variantRaw === "" ? null : variantRaw,
      type,
      qty: qtyNum,
      threshold_qty: thresholdNum,
    };

    return { payload };
  };

  // Confirm (Save) handler called by ReusableDialog
  const onConfirm = async () => {
    setError(null);

    // Early exit if nothing changed to avoid unnecessary API call
    if (!isDirty) {
      return { status: 200 };
    }

    const { payload, message } = validateAndBuildPayload();
    if (!payload) {
      setError(message ?? "Please fix the errors in the form.");
      return { status: 400 };
    }

    try {
      setSubmitting(true);
      await updateExistingItem(item.id, payload);

      // Allow parent to re-fetch or re-render related data
      await onUpdated?.();

      // Signal success to close the dialog
      return { status: 200 };
    } catch (e: unknown) {
      // Surface best-effort message without leaking backend internals
      const fallback = "An error occurred while updating the item.";
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
  };

  return (
    <>
      {/* Launcher button for the modal */}
      {!hideLauncher && (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Edit Item
        </Button>
      )}


      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle={`Edit Item: ${item.item_name}`}
        confirmButtonText={submitting ? "Saving..." : "Save"}
        cancelButtonText="Cancel"
        onConfirm={onConfirm}
      >
        <div className="grid gap-4">
          {/* Global error message */}
          {error && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {error}
            </div>
          )}

          {/* Item Name */}
          <div className="grid gap-2">
            <label htmlFor="item-name" className="text-sm font-medium">
              Item Name
            </label>
            <input
              id="item-name"
              name="item_name"
              type="text"
              value={form.item_name}
              onChange={onChange("item_name")}
              onBlur={(e) =>
                setForm((f) => ({ ...f, item_name: e.target.value.trim() }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="e.g., 12-inch Frying Pan"
              autoComplete="off"
              required
              disabled={submitting}
            />
          </div>

          {/* SKU */}
          <div className="grid gap-2">
            <label htmlFor="item-sku" className="text-sm font-medium">
              Item SKU
            </label>
            <input
              id="item-sku"
              name="sku"
              type="text"
              value={form.sku}
              onChange={onChange("sku")}
              onBlur={(e) =>
                setForm((f) => ({ ...f, sku: e.target.value.trim() }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="e.g., SKU-12345"
              autoComplete="off"
              required
              disabled={submitting}
            />
          </div>

          {/* Variant (optional) */}
          <div className="grid gap-2">
            <label htmlFor="item-variant" className="text-sm font-medium">
              Variant
            </label>
            <input
              id="item-variant"
              name="variant"
              type="text"
              value={form.variant ?? ""}
              onChange={onChange("variant")}
              onBlur={(e) =>
                setForm((f) => ({ ...f, variant: e.target.value.trim() }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="Optional, e.g., Blue (Large)"
              autoComplete="off"
              disabled={submitting}
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <label htmlFor="item-type" className="text-sm font-medium">
              Type
            </label>
            <input
              id="item-type"
              name="type"
              type="text"
              value={form.type}
              onChange={onChange("type")}
              onBlur={(e) =>
                setForm((f) => ({ ...f, type: e.target.value.trim() }))
              }
              className="w-full border rounded px-2 py-1"
              placeholder="e.g., Cookware"
              autoComplete="off"
              required
              disabled={submitting}
            />
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <label htmlFor="item-qty" className="text-sm font-medium">
              Quantity
            </label>
            <input
              id="item-qty"
              name="qty"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              step={1}
              value={form.qty}
              onChange={onChange("qty")}
              className="w-full border rounded px-2 py-1"
              placeholder="0"
              required
              disabled={submitting}
            />
          </div>

          {/* Threshold Quantity */}
          <div className="grid gap-2">
            <label htmlFor="item-threshold-qty" className="text-sm font-medium">
              Threshold Qty
            </label>
            <input
              id="item-threshold-qty"
              name="threshold_qty"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              step={1}
              value={form.threshold_qty}
              onChange={onChange("threshold_qty")}
              className="w-full border rounded px-2 py-1"
              placeholder="0"
              required
              disabled={submitting}
            />
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}
