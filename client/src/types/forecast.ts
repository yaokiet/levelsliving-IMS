export type InventoryForecastRequest = {
    last_month: string
    lag_1: number | null
    lag_2: number | null
    lag_3: number | null
  }
  
  export type InventoryForecastResponse = {
    model: string
    forecast_month: string
    predicted_quantity: number
  }

  export interface SkuForecastResponse {
    sku: string;
    model: string;
    forecast_month: string;     // "YYYY-MM-DD"
    predicted_quantity: number;
  }