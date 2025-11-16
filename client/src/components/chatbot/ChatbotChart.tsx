"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- Prop Types ---
// Import these from your page.tsx or define them here
type BarLineChartData = {
  type: "bar" | "line";
  datasets: {
    x: string;
    data: { label: string; value: number }[];
  }[];
};

type PieChartData = {
  type: "pie";
  labels: string[];
  data: number[];
};

type ChartbotChartProps = {
  chartData: BarLineChartData | PieChartData;
};

// --- Helper Functions ---

// Define some colors for the charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF5733",
];

/**
 * Transforms your API data (BarLineChartData) into a format Recharts understands.
 *
 * FROM: [{ x: "Jan", data: [{ label: "Sales", value: 100 }] }]
 * TO:   [{ x: "Jan", "Sales": 100 }]
 */
const transformBarLineData = (data: BarLineChartData) => {
  const allKeys = new Set<string>();
  const transformedData = data.datasets.map((dataset) => {
    const dataPoint: { [key: string]: any } = { x: dataset.x };
    dataset.data.forEach((point) => {
      dataPoint[point.label] = point.value;
      allKeys.add(point.label);
    });
    return dataPoint;
  });
  return { transformedData, keys: Array.from(allKeys) };
};

/**
 * Transforms your API data (PieChartData) into a format Recharts understands.
 *
 * FROM: { labels: ["A", "B"], data: [100, 200] }
 * TO:   [{ name: "A", value: 100 }, { name: "B", value: 200 }]
 */
const transformPieData = (data: PieChartData) => {
  return data.labels.map((label, index) => ({
    name: label,
    value: data.data[index],
  }));
};

// --- Main Chart Component ---

export function ChatbotChart({ chartData }: ChartbotChartProps) {
  if (chartData.type === "bar" || chartData.type === "line") {
    const { transformedData, keys } = transformBarLineData(chartData);

    const ChartComponent = chartData.type === "bar" ? BarChart : LineChart;

    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ChartComponent
            data={transformedData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Use conditional rendering directly */}
            {keys.map((key, index) => {
              const color = COLORS[index % COLORS.length];
              if (chartData.type === "bar") {
                return <Bar key={key} dataKey={key} fill={color} />;
              }
              // Since the outer if checks for 'bar' or 'line', this else is for 'line'
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartData.type === "pie") {
    const transformedData = transformPieData(chartData);

    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={transformedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}