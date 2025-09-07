import type { ItemCreate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useMemo, useState } from "react";
import { createNewItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";
import { ItemFormFields } from "./item-form-fields";
import type { ItemFormState } from "@/types/item";
import { createItemComponent } from "@/lib/api/apiItemComponent";
import { parseNonNegativeInt, parsePositiveInt } from "./util/item-int-util-func";

interface ItemAddModalProps {
  onCreated?: () => void | Promise<void>;
  parentItemId?: number;
  dialogTitle?: string;
  buttonName?: string;
  confirmButtonText?: string;
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

export function ItemAddModal({ onCreated, parentItemId, dialogTitle, buttonName, confirmButtonText }: ItemAddModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ItemFormState>(() => initEmptyForm());
  const [requiredQty, setRequiredQty] = useState<string>("1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset errors and form when dialog open changes
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setForm(initEmptyForm());
      setRequiredQty("1");
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

    // If we need to link the new item as a child, validate requiredQty now
    let reqQtyNum: number | null = null;
    if (parentItemId != null) {
      reqQtyNum = parsePositiveInt(requiredQty);
      if (reqQtyNum === null) {
        setError("Required quantity must be a positive integer (>= 1).");
        return { status: 400 };
      }
    }

    try {
      setSubmitting(true);

      // Create the new item
      const created = await createNewItem(payload);

      // Expect created.id to exist
      const newItemId =
        created && typeof (created as any).id === "number"
          ? (created as any).id
          : null;

      if (newItemId == null) {
        throw new Error("Create API did not return the new item ID.");
      }

      // If parentItemId provided, link the newly created item as a child with qty
      if (parentItemId != null && reqQtyNum != null) {
        await createItemComponent({
          parent_id: parentItemId,
          child_id: newItemId,
          qty_required: reqQtyNum,
        });
      }

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
        {buttonName ?? "Add Item"}
      </Button>

      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle={dialogTitle ?? "Create New Item"}
        confirmButtonText={confirmButtonText ?? "Create Item"}
        cancelButtonText="Cancel"
        onConfirm={onConfirm}
      >
        <div className="grid gap-4">
          {error && (
            <div className="text-red-500 text-sm mb-2" role="alert">
              {error}
            </div>
          )}
          <ItemFormFields
            form={form}
            setForm={setForm}
            submitting={submitting}
          />

          {parentItemId != null && (
            <div className="flex items-center gap-3">
              <label
                htmlFor="required-qty"
                className="text-sm text-muted-foreground"
              >
                Required Qty
              </label>
              <input
                id="required-qty"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                className="w-28 border rounded px-2 py-1 text-right"
                value={requiredQty}
                onChange={(e) => setRequiredQty(e.target.value)}
                disabled={submitting}
                placeholder="1"
              />
            </div>
          )}
        </div>
      </ReusableDialog>
    </>
  );
}
