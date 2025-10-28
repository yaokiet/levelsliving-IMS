// import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SalesPurchaseChart() {
  const barData = [
    { label: "Jan", height: 190, color: "bg-blue-500" },
    { label: "Feb", height: 170, color: "bg-green-500" },
    { label: "Mar", height: 160, color: "bg-blue-500" },
    { label: "Apr", height: 185, color: "bg-green-500" },
    { label: "May", height: 190, color: "bg-blue-500" },
    { label: "Jun", height: 32, color: "bg-green-500" },
  ];
  const barDataNew = [
    { month: "Jan", quantity: 190, color: "bg-blue-500" },
    { month: "Feb", quantity: 170, color: "bg-green-500" },
    { month: "Mar", quantity: 160, color: "bg-blue-500" },
    { month: "Apr", quantity: 185, color: "bg-green-500" },
    { month: "May", quantity: 190, color: "bg-blue-500" },
    { month: "Jun", quantity: 32, color: "bg-green-500" },
  ];
  const chartData = [
    { date: "2025-01-01", quantity: 222 },
    { date: "2025-02-01", quantity: 250 },
    { date: "2025-03-01", quantity: 97 },
    { date: "2025-04-01", quantity: 167 },
    { date: "2025-05-01", quantity: 242 },
    { date: "2025-06-01", quantity: 373 },
    { date: "2025-07-01", quantity: 301 },
    { date: "2025-08-01", quantity: 245 },
    { date: "2025-09-01", quantity: 409 },
    { date: "2025-10-01", quantity: 59 },
    { date: "2025-11-01", prediction: 261 },
    { date: "2025-12-01", prediction: 327 },
  ]
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <div className="bg-background rounded-lg border p-6 w-full max-w-4xl">
      <h2 className="text-lg font-semibold mb-4 text-center">Sales & Purchase</h2>
      <div className="flex items-end h-72 gap-2">
        {barData.map((bar, index) => (
          <div key={index} className="flex flex-col items-center flex-grow">
            <div className={`${bar.color} w-8`} style={{ height: `${bar.height}px` }}></div>
            <span className="text-sm mt-2">{bar.label}</span>
          </div>
        ))}
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={barDataNew}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="quantity" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
