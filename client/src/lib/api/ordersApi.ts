import { toQueryString } from "../utils";
import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { OrderItem, PaginatedOrderItems } from "@/types/order-item";

export function getAllOrders(params?: Record<string, any>) {
  const query = toQueryString(params);
  return apiFetch<PaginatedOrderItems>(`${API_PATHS.order_with_items}${query}`);
}

// // Fetch all orders with nested items
// export function getOrdersWithItems() {
//   return apiFetch<OrderItem[]>(API_PATHS.order_with_items);
// }

export function getOrderById(orderId: number | string) {
  return apiFetch<OrderItem>(API_PATHS.order_by_id(orderId));
}
