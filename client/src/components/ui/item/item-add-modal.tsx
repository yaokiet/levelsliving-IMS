import type { ItemCreate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createNewItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";

interface ItemAddModalProps {
  onCreated?: () => void | Promise<void>;
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

// Build initial form state for a new item
function initEmptyForm(): FormState {
  return {
    item_name: "",
    sku: "",
    variant: "",
    type: "",
    qty: "0",
    threshold_qty: "0",
  };
}

// Safely parse a non-negative integer from a string (base-10)
function parseNonNegativeInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

export function ItemAddModal({ onCreated }: ItemAddModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => initEmptyForm());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset errors and form when dialog open changes
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setForm(initEmptyForm());
      setSubmitting(false);
    }
  }, []);

  // Generic input change handler factory
  const onChange =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
    };

  // Derived flag: all fields are at their initial defaults?
  const initialForm = useMemo(() => initEmptyForm(), []);
  const isPristine = useMemo(
    () => JSON.stringify(form) === JSON.stringify(initialForm),
    [form, initialForm]
  );

  // Validate and build ItemCreate payload from form
  const validateAndBuildPayload = (): {
    payload?: ItemCreate;
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

    const payload: ItemCreate = {
      item_name: name,
      sku,
      variant: variantRaw === "" ? null : variantRaw,
      type,
      qty: qtyNum,
      threshold_qty: thresholdNum,
    };

    return { payload };
  };

  // Confirm (Create) handler called by ReusableDialog
  const onConfirm = async () => {
    setError(null);

    // Optional: prevent creating if user hasn't changed anything from defaults
    if (isPristine) {
      return { status: 400 };
    }

    const { payload, message } = validateAndBuildPayload();
    if (!payload) {
      setError(message ?? "Please fix the errors in the form.");
      return { status: 400 };
    }

    try {
      setSubmitting(true);
      await createNewItem(payload);

      // Allow parent to re-fetch or re-render related data
      await onCreated?.();

      // Signal success to close the dialog
      return { status: 200 };
    } catch (e: unknown) {
      const fallback = "An error occurred while creating the item.";
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
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add Item
      </Button>

      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle="Add New Item"
        confirmButtonText={submitting ? "Creating..." : "Create"}
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
