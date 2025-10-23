import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import type { SupplierItem } from "@/types/supplier-item";

export async function linkSupplierToItem(itemId: number, supplierId: number): Promise<SupplierItem> {
  // This object is correct
  const payload = {
    item_id: itemId,
    supplier_id: supplierId,
  };

  return apiFetch<SupplierItem>(API_PATHS.supplier_item, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });
}