import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { CartBulkCreatePayload } from "@/types/cart";
import { CartItem } from "@/types/cart-item";

export function addMultipleItemsToCart(payload: CartBulkCreatePayload) {
  return apiFetch<any>(API_PATHS.cart_bulk_add, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function getCartItems() {
  return apiFetch<CartItem[]>(API_PATHS.cart);
}

export function updateCartItemQty(itemId: string | number, quantity: number) {
  return apiFetch<CartItem>(API_PATHS.cart_item(itemId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string | number) {
  return apiFetch<void>(API_PATHS.cart_item(itemId), {
    method: "DELETE",
  });
}

export function clearCart() {
  return apiFetch<void>(API_PATHS.cart, {
    method: "DELETE",
  });
}
