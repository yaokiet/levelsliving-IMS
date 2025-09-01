import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { OrderItem } from "@/types/order-item";

export function getAllOrders() {
  return apiFetch<OrderItem[]>(API_PATHS.order);
}

// Fetch all orders with nested items
export function getOrdersWithItems() {
  return apiFetch<OrderItem[]>(API_PATHS.order_with_items);
}
