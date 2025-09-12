import type { Item, ItemUpdate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateExistingItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";
import { ItemFormFields } from "./item-form-fields";
import type { ItemFormState } from "@/types/item";
import { parseNonNegativeInt } from "./util/item-int-util-func";


interface ItemEditModalProps {
  item: Item;
  onUpdated?: () => void | Promise<void>;
  setIsOpen?: (open: boolean) => void;
  hideLauncher?: boolean;
  isOpen?: boolean;
}

// Build initial form state from Item
function initFormFromItem(item: Item): ItemFormState {
  return {
    item_name: item.item_name ?? "",
    sku: item.sku ?? "",
    variant: item.variant ?? "",
    type: item.type ?? "",
    qty: (item.qty ?? 0),
    threshold_qty: (item.threshold_qty ?? 0),
  };
}

export function ItemEditModal({
  item,
  onUpdated,
  isOpen,
  setIsOpen,
  hideLauncher,
}: ItemEditModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const [form, setForm] = useState<ItemFormState>(() => initFormFromItem(item));
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
        setError(null);
        setForm(initFormFromItem(item));
        setSubmitting(false);
      }
    },
    [item, setOpen]
  );

  // Derived flag: has anything changed?
  const initialForm = useMemo(() => initFormFromItem(item), [item]);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );


  /**
   * Validate the form state and build a payload suitable for the `updateExistingItem`
   * API function. If the form state is invalid, return an object with a `message`
   * property containing an error message for the user. If the form state is valid,
   * return an object with a `payload` property containing the updated item data.
   *
   * @returns { { payload?: ItemUpdate; message?: string; } }
   */
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
  
  /**
   * Handles the "Confirm" button click by validating the form state and building
   * a payload suitable for the `updateExistingItem` API function. If the form
   * state is invalid, returns a promise that resolves to an object with a
   * `status` property set to 400 and an `error` property with an error message
   * for the user. If the form state is valid, attempts to call the
   * `updateExistingItem` API function with the updated item data. If the API call
   * is successful, returns a promise that resolves to an object with a `status`
   * property set to 200 and calls the `onUpdated` callback (if provided). If the
   * API call fails, returns a promise that resolves to an object with a `status`
   * property set to 500 and an `error` property with an error message for the
   * user.
   *
   * @returns { Promise<{ status: number; error?: string; }> }
   */
  const onConfirm = async () => {
    setError(null);

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
      await onUpdated?.();
      return { status: 200 };
    } catch (e: unknown) {
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
