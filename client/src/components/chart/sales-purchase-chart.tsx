"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { postInventoryForecast } from "@/lib/api/forecast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Slider } from "../ui/slider"

// Historical data (actuals)
const chartDataBase = [
  {
    "date": "2022-04-30",
    "quantity": 91
  },
  {
    "date": "2022-05-31",
    "quantity": 280
  },
  {
    "date": "2022-06-30",
    "quantity": 339
  },
  {
    "date": "2022-07-31",
    "quantity": 431
  },
  {
    "date": "2022-08-31",
    "quantity": 392
  },
  {
    "date": "2022-09-30",
    "quantity": 534
  },
  {
    "date": "2022-10-31",
    "quantity": 412
  },
  {
    "date": "2022-11-30",
    "quantity": 704
  },
  {
    "date": "2022-12-31",
    "quantity": 720
  },
  {
    "date": "2023-01-31",
    "quantity": 502
  },
  {
    "date": "2023-02-28",
    "quantity": 470
  },
  {
    "date": "2023-03-31",
    "quantity": 391
  },
  {
    "date": "2023-04-30",
    "quantity": 417
  },
  {
    "date": "2023-05-31",
    "quantity": 346
  },
  {
    "date": "2023-06-30",
    "quantity": 495
  },
  {
    "date": "2023-07-31",
    "quantity": 896
  },
  {
    "date": "2023-08-31",
    "quantity": 834
  },
  {
    "date": "2023-09-30",
    "quantity": 968
  },
  {
    "date": "2023-10-31",
    "quantity": 1022
  },
  {
    "date": "2023-11-30",
    "quantity": 1166
  },
  {
    "date": "2023-12-31",
    "quantity": 1171
  },
  {
    "date": "2024-01-31",
    "quantity": 936
  },
  {
    "date": "2024-02-29",
    "quantity": 606
  },
  {
    "date": "2024-03-31",
    "quantity": 517
  },
  {
    "date": "2024-04-30",
    "quantity": 468
  },
  {
    "date": "2024-05-31",
    "quantity": 264
  },
  {
    "date": "2024-06-30",
    "quantity": 201
  },
  {
    "date": "2024-07-31",
    "quantity": 499
  },
  {
    "date": "2024-08-31",
    "quantity": 281
  },
  {
    "date": "2024-09-30",
    "quantity": 300
  },
  {
    "date": "2024-10-31",
    "quantity": 276
  },
  {
    "date": "2024-11-30",
    "quantity": 406
  },
  {
    "date": "2024-12-31",
    "quantity": 599
  },
  {
    "date": "2025-01-31",
    "quantity": 671
  },
  {
    "date": "2025-02-28",
    "quantity": 495
  },
  {
    "date": "2025-03-31",
    "quantity": 425
  },
  {
    "date": "2025-04-30",
    "quantity": 202
  },
  {
    "date": "2025-05-31",
    "quantity": 272
  },
  {
    "date": "2025-06-30",
    "quantity": 294
  },
  {
    "date": "2025-07-31",
    "quantity": 543
  },
  {
    "date": "2025-08-31",
    "quantity": 547
  },
  {
    "date": "2025-09-30",
    "quantity": 99
  }
];


// Utility: parse ISO date safely in UTC
const toUTCDate = (s: string) => {
  const d = new Date(s)
  // normalize to first of month in UTC for consistent buckets
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
}

// build lag vector from the last three actual months relative to last_month
// turn this into a function to replicate for repeated forecasts based on forecasts
// lag_1 = last_month quantity, lag_2 = previous month, lag_3 = two months back
function computeLags(data: { date: string; quantity?: number; prediction?: number }[]) {
  // Use prediction if present, else fall back to quantity
  const series = data
    .map(d => ({ date: d.date, value: typeof d.prediction === "number" ? d.prediction : d.quantity }))
    .filter(d => typeof d.value === "number")
    .sort((a, b) => toUTCDate(a.date).getTime() - toUTCDate(b.date).getTime())

  if (series.length < 3) {
    return { last_month: null as string | null, lag_1: null, lag_2: null, lag_3: null }
  }

  const last = series[series.length - 1]
  const prev1 = series[series.length - 2]
  const prev2 = series[series.length - 3]

  return {
    last_month: last.date,
    lag_1: Number(last.value!),
    lag_2: Number(prev1.value!),
    lag_3: Number(prev2.value!),
  }
}


const chartConfig = {
  quantity: {
    label: "Quantity",
    color: "hsl(221.2 83.2% 53.3%)",   // blue
  },
  prediction: {
    label: "Prediction",
    color: "hsl(142.1 70.6% 45.3%)",   // green
  },
} satisfies ChartConfig

export function SalesPurchaseChart() {
  // for loading data
  const [predictionHorizon, setPredictionHorizon] = React.useState(2)
  const [data, setData] = React.useState(chartDataBase)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // for date filtering
  const [timeRange, setTimeRange] =
    React.useState<"6m" | "12m" | "18m" | "24m" | "max">("6m")
  const firstOfMonthUTC = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
  const addMonthsUTC = (d: Date, delta: number) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1))

  // Filter against the current data state so forecasted month is included
  const filteredData = React.useMemo(() => {
    if (timeRange === "max") return data

    // Determine latest month present in the series
    const latest = data.reduce((acc, item) => {
      const d = new Date(item.date)
      return d > acc ? d : acc
    }, new Date(0))
    const latestUTC = firstOfMonthUTC(latest)

    // Window size in months
    const ranges: Record<typeof timeRange, number> = {
      "6m": 6,
      "12m": 12,
      "18m": 18,
      "24m": 24,
      "max": Infinity,
    }
    const windowMonths = ranges[timeRange]

    // Inclusive cutoff at the first day of month N-1 months before latest
    // Example: for 6m window and latest = Sep, cutoff = Apr 1 (Apr, May, Jun, Jul, Aug, Sep)
    const cutoff = addMonthsUTC(latestUTC, -(windowMonths - 1))

    return data.filter((item) => {
      const dUTC = firstOfMonthUTC(new Date(item.date))
      return dUTC >= cutoff
    })
  }, [data, timeRange])


  React.useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        // Start from historical base; we will append forecasts as we go
        let curr = [...chartDataBase]

        for (let i = 0; i < predictionHorizon; i++) {
          const { last_month, lag_1, lag_2, lag_3 } = computeLags(curr)
          if (!last_month) throw new Error("Insufficient history to compute lags")

          const resp = await postInventoryForecast({ last_month, lag_1, lag_2, lag_3 })

          // Server returns end-of-month; normalize to first-of-month (UTC) for your X-axis buckets
          const [y, m] = resp.forecast_month.split("-").map(Number) // "YYYY-MM-DD"
          const forecastISO = new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 10)

          // Round the prediction and append; if the month already exists, update it
          const value = Math.round(resp.predicted_quantity)
          const idx = curr.findIndex(d => d.date === forecastISO)
          if (idx >= 0) {
            curr[idx] = { ...curr[idx], prediction: value }
          } else {
            curr = [...curr, { date: forecastISO, prediction: value }]
          }
          // Loop will compute lags again including this new prediction
        }

        if (!cancelled) setData(curr)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Forecast failed")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [predictionHorizon])


  return (
    <Card className="w-full bg-background">
      <CardHeader className="relative flex items-end justify-between">
        {/* Select positioned to top-right */}
        <div className="absolute -top-3 right-2 flex flex-row gap-4 items-center">

          <div className="flex flex-row items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Horizon: {predictionHorizon}m
            </span>
            <Slider
              value={[predictionHorizon]}
              onValueChange={([v]) => setPredictionHorizon(v)}
              min={1}
              max={6}
              step={1}
              className="w-40"
            />
          </div>

          <div className="">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <SelectTrigger
                className="w-[160px] rounded-lg "
                aria-label="Select a range"
              >
                <SelectValue placeholder="6 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="6m">6 months</SelectItem>
                <SelectItem value="12m">12 months</SelectItem>
                <SelectItem value="18m">18 months</SelectItem>
                <SelectItem value="24m">24 months</SelectItem>
                <SelectItem value="max">Max</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              minTickGap={28}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              filterNull
              content={
                <ChartTooltipContent
                  indicator="dot"
                  nameKey="dataKey"
                  labelFormatter={(value: string) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            {/* Actuals */}
            <Bar
              dataKey="quantity"
              stackId="a"
              fill="var(--color-quantity)"
              stroke="var(--color-quantity)"
              radius={4}
              isAnimationActive={!loading}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>

            {/* Forecast */}
            <Bar
              dataKey="prediction"
              stackId="a"
              fill="var(--color-prediction)"
              stroke="var(--color-prediction)"
              radius={4}
              isAnimationActive={!loading}
            >
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>

        {error ? (
          <p className="text-sm text-destructive mt-2">Forecast error: {error}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
