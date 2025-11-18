import {
  InventoryForecastRequest,
  InventoryForecastResponse,
  SkuForecastResponse,

} from "@/types/forecast";
import { API_DOMAIN, API_PATHS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export function postInventoryForecast(body: InventoryForecastRequest) {
  return apiFetch<InventoryForecastResponse>(
    `${API_PATHS.forecast_inventory}/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}

// You can reuse the same request shape for SKU:
export type SkuForecastRequest = InventoryForecastRequest;

export function postSkuForecast(skuId: string, body: SkuForecastRequest) {
  return apiFetch<SkuForecastResponse>(
    `${API_PATHS.forecast_inventory}/${encodeURIComponent(skuId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
}
