"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSkuForecast } from "@/hooks/useSKUForecast";
import { addMonthsUTC, firstOfMonthUTC } from "@/lib/chart-date";
import { chartConfig } from "@/lib/chart-config";
import { SalesPurchaseChartControls } from "./sales-purchase-chart-controls";
import { useEffect, useState } from "react";
import { getMonthlyOrderItemQuantities } from "@/lib/api/orderItem";

type TimeRange = "6m" | "12m" | "18m" | "24m" | "max";

type HistoryPoint = {
  date: string;
  quantity: number;
};

type ItemSkuForecastChartProps = {
  skuId: string;
  itemId: number;
};

export function ItemSkuForecastChart({ skuId, itemId }: ItemSkuForecastChartProps) {
  const [predictionHorizon, setPredictionHorizon] = React.useState(2);
  const [timeRange, setTimeRange] = React.useState<TimeRange>("6m");
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  useEffect(() => {
    async function load() {
      const rows = await getMonthlyOrderItemQuantities(itemId);
      setHistory(rows.map(r => ({ date: r.date, quantity: r.quantity })));
      setLoadingHistory(false);
      console.log(rows)
    }
    load();
  }, [itemId]);
  
  const hasHistory = !!skuId && history.length > 0;

  // Always call the hook, even if we later decide not to show the chart.
  const { data, loading, error } = useSkuForecast({
    skuId,
    base: history,
    horizon: hasHistory ? predictionHorizon : 0, // horizon 0 → hook early-outs
  });

  const filteredData = React.useMemo(() => {
    if (!hasHistory) return [];

    if (data.length === 0) return data;
    if (timeRange === "max") return data;

    const latest = data.reduce((acc, item) => {
      const d = new Date(item.date);
      return d > acc ? d : acc;
    }, new Date(0));

    const latestUTC = firstOfMonthUTC(latest);
    const ranges: Record<TimeRange, number> = {
      "6m": 6,
      "12m": 12,
      "18m": 18,
      "24m": 24,
      max: Infinity,
    };
    const windowMonths = ranges[timeRange];
    const cutoff = addMonthsUTC(latestUTC, -(windowMonths - 1));

    return data.filter(
      (item) => firstOfMonthUTC(new Date(item.date)) >= cutoff
    );
  }, [data, timeRange, hasHistory]);

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex items-start justify-between">
        <div className="">
          {/* optional: show SKU */}
          {/* <p className="text-sm font-medium">SKU: {skuId}</p> */}
        </div>
        <SalesPurchaseChartControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          predictionHorizon={predictionHorizon}
          setPredictionHorizon={setPredictionHorizon}
        />
      </CardHeader>

      <CardContent>
        {!hasHistory ? (
          <p className="text-sm text-muted-foreground">
            No sales history available for this SKU.
          </p>
        ) : (
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

              <ChartLegend
                content={<ChartLegendContent payload={undefined} />}
              />

              {/* Actuals */}
              <Bar
                dataKey="quantity"
                stackId="a"
                fill="var(--color-quantity)"
                stroke="var(--color-quantity)"
                radius={4}
                isAnimationActive={!loading}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
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
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}

        {error ? (
          <p className="text-sm text-destructive mt-2">
            Forecast error: {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
