import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { CartBulkCreatePayload } from "@/types/cart";

export function addMultipleItemsToCart(payload: CartBulkCreatePayload) {
  return apiFetch<any>(API_PATHS.cart_bulk_add, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
