import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";

export type MonthlyQuantity = {
  date: string;   // "YYYY-MM-DD"
  quantity: number;
};

export function getMonthlyOrderItemQuantities(itemId: number) {
  return apiFetch<MonthlyQuantity[]>(
    `${API_PATHS.order_item}/monthly/quantity/${itemId}`,
    {
      method: "GET",
    }
  );
}
