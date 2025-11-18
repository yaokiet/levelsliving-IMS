import * as React from "react";
import { postInventoryForecast } from "@/lib/api/forecast";
import { MonthDataPoint } from "@/types/chart";
import { normalizeToMonthISO, toUTCDate } from "@/lib/chart-date";
// import { computeLags } from "@/lib/lag";
// import { normalizeToMonthISO } from "@/lib/chart-date";

type UseInventoryForecastArgs = {
  base: MonthDataPoint[];          // historical actuals
  horizon: number;             // months to forecast
};

type UseInventoryForecast = {
  data: MonthDataPoint[];
  loading: boolean;
  error: string | null;
};


// build lag vector from the last three actual months relative to last_month
// turn this into a function to replicate for repeated forecasts based on forecasts
// lag_1 = last_month quantity, lag_2 = previous month, lag_3 = two months back
function computeLags(data: MonthDataPoint[]) {
  // Use prediction if present, else fall back to quantity
  const series = data
    .map(d => ({
      date: d.date,
      value: typeof d.prediction === "number" ? d.prediction : d.quantity
    }))
    .filter(d => d.date && typeof d.value === "number")
    .sort((a, b) => toUTCDate(a.date).getTime() - toUTCDate(b.date).getTime());

  // Helper to clamp to >= 0
  const z = (v: any) => (typeof v === "number" && v >= 0 ? v : 0);

  // If no valid records at all → safe fallback
  if (series.length === 0) {
    return {
      last_month: null,
      lag_1: 0,
      lag_2: 0,
      lag_3: 0,
    };
  }

  // If fewer than 3 values, still fill missing ones with 0
  const last = series[series.length - 1];
  const prev1 = series[series.length - 2];
  const prev2 = series[series.length - 3];

  return {
    last_month: last?.date ?? null,
    lag_1: z(last?.value),
    lag_2: z(prev1?.value),
    lag_3: z(prev2?.value),
  };
}



export function useInventoryForecast({ base, horizon }: UseInventoryForecastArgs): UseInventoryForecast {
  const [data, setData] = React.useState<MonthDataPoint[]>(base);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        let curr = [...base];

        for (let i = 0; i < horizon; i++) {
          const { last_month, lag_1, lag_2, lag_3 } = computeLags(curr);

          if (!last_month) throw new Error("Insufficient history to compute lags");

          const resp = await postInventoryForecast({ last_month, lag_1, lag_2, lag_3 });
          const forecastISO = normalizeToMonthISO(resp.forecast_month);
          const value = Math.round(resp.predicted_quantity);

          const idx = curr.findIndex(d => d.date === forecastISO);
          curr = idx >= 0
            ? curr.map((d, j) => (j === idx ? { ...d, prediction: value } : d))
            : [...curr, { date: forecastISO, prediction: value }];
        }

        if (!cancelled) setData(curr);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Forecast failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [base, horizon]);

  return { data, loading, error };
}
