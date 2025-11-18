import { InventoryForecastRequest, InventoryForecastResponse } from "@/types/forecast";
import { API_DOMAIN, API_PATHS } from "./apiConfig"
import { apiFetch } from "./apiClient";


export function postInventoryForecast(body: InventoryForecastRequest) {
    return apiFetch<InventoryForecastResponse>(`${API_PATHS.forecast_inventory}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }