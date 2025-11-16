"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useInventoryForecast } from "@/hooks/useInventoryForecast"
import { addMonthsUTC, firstOfMonthUTC } from "@/lib/chart-date"
import { chartConfig } from "@/lib/chart-config"
import { SalesPurchaseChartControls } from "./sales-purchase-chart-controls"

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

type TimeRange = "6m" | "12m" | "18m" | "24m" | "max";

export function SalesPurchaseChart() {
  // for loading data
  const [predictionHorizon, setPredictionHorizon] = React.useState(2)
  const [timeRange, setTimeRange] = React.useState<TimeRange>("6m");

  const { data, loading, error } = useInventoryForecast({
    base: chartDataBase,
    horizon: predictionHorizon,
  });

  // Filter against the current data state so forecasted month is included
  const filteredData = React.useMemo(() => {
    if (timeRange === "max") return data;

    const latest = data.reduce((acc, item) => {
      const d = new Date(item.date);
      return d > acc ? d : acc;
    }, new Date(0));

    const latestUTC = firstOfMonthUTC(latest);
    const ranges: Record<TimeRange, number> = { "6m": 6, "12m": 12, "18m": 18, "24m": 24, "max": Infinity };
    const windowMonths = ranges[timeRange];
    const cutoff = addMonthsUTC(latestUTC, -(windowMonths - 1));

    return data.filter((item) => firstOfMonthUTC(new Date(item.date)) >= cutoff);
  }, [data, timeRange]);

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex items-start justify-between">
        <div className="grid gap-1">
          {/* Optional title/description */}
        </div>
        <SalesPurchaseChartControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          predictionHorizon={predictionHorizon}
          setPredictionHorizon={setPredictionHorizon}
        />
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

            <ChartLegend content={<ChartLegendContent payload={undefined} />} />

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
