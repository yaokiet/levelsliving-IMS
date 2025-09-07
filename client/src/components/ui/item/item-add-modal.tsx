import type { ItemCreate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useMemo, useState } from "react";
import { createNewItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";
import { ItemFormFields, type ItemFormState } from "./item-form-fields";

interface ItemAddModalProps {
  onCreated?: () => void | Promise<void>;
}

// Build initial form state for a new item
function initEmptyForm(): ItemFormState {
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
  const [form, setForm] = useState<ItemFormState>(() => initEmptyForm());
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
      await onCreated?.();
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
          {error && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {error}
            </div>
          )}
          <ItemFormFields form={form} setForm={setForm} submitting={submitting} />
        </div>
      </ReusableDialog>
    </>
  );
}
