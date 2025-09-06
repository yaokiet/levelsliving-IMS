import type { Item, ItemUpdate } from "@/types/item";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { useEffect, useState } from "react";
import { updateExistingItem } from "@/lib/api/itemsApi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ItemEditModalProps {
  item: Item;
}

export function ItemEditModal({ item }: ItemEditModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    item_name: item.item_name ?? "",
    sku: item.sku ?? "",
    variant: item.variant ?? "",
    type: item.type ?? "",
    qty: String(item.qty ?? 0),
    threshold_qty: String(item.threshold_qty ?? 0),
  });

  useEffect(() => {
    setForm({
      item_name: item.item_name ?? "",
      sku: item.sku ?? "",
      variant: item.variant ?? "",
      type: item.type ?? "",
      qty: String(item.qty ?? 0),
      threshold_qty: String(item.threshold_qty ?? 0),
    });
  }, [item]);

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const onConfirm = async () => {
    try {
      const qtyNum = Number.parseInt(form.qty, 10);
      const thresholdNum = Number.parseInt(form.threshold_qty, 10);

      const payload: ItemUpdate = {
        item_name: form.item_name.trim(),
        sku: form.sku.trim(),
        variant: (form.variant ?? "").trim() === "" ? null : (form.variant ?? "").trim(),
        type: form.type.trim(),
        qty: Number.isFinite(qtyNum) ? qtyNum : item.qty,
        threshold_qty: Number.isFinite(thresholdNum) ? thresholdNum : item.threshold_qty,
      };

      await updateExistingItem(item.id, payload);
      router.refresh?.();
      return { status: 200 };
    } catch (e) {
      console.error(e);
      return { status: 500 };
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit Item
      </Button>

      <ReusableDialog
        open={open}
        onOpenChange={setOpen}
        dialogTitle={`Edit Item: ${item.item_name}`}
        confirmButtonText="Save"
        cancelButtonText="Cancel"
        onConfirm={onConfirm}
      >
        <div className="grid gap-4">
          <div className="grid gap-3">
            <label htmlFor="item-name">Item Name</label>
            <input
              id="item-name"
              type="text"
              value={form.item_name}
              onChange={onChange("item_name")}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="item-sku">Item SKU</label>
            <input
              id="item-sku"
              type="text"
              value={form.sku}
              onChange={onChange("sku")}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="item-category">Category</label>
            <input
              id="item-category"
              type="text"
              value={form.variant ?? ""}
              onChange={onChange("variant")}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="item-type">Type</label>
            <input
              id="item-type"
              type="text"
              value={form.type}
              onChange={onChange("type")}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="item-qty">Quantity</label>
            <input
              id="item-qty"
              type="number"
              value={form.qty}
              onChange={onChange("qty")}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid gap-3">
            <label htmlFor="item-threshold-qty">Threshold Qty</label>
            <input
              id="item-threshold-qty"
              type="number"
              value={form.threshold_qty}
              onChange={onChange("threshold_qty")}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}