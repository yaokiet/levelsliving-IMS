import React from "react";
import type { ItemFormState } from "@/types/item";

type Props = {
  form: ItemFormState;
  setForm: React.Dispatch<React.SetStateAction<ItemFormState>>;
  submitting?: boolean;
};

export function ItemFormFields({ form, setForm, submitting }: Props) {
  const onChange =
    (key: keyof ItemFormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <>
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
          onBlur={(e) => setForm((f) => ({ ...f, sku: e.target.value.trim() }))}
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
    </>
  );
}