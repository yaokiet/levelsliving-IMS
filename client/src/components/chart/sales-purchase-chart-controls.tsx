"use client"

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type TimeRange = "6m" | "12m" | "18m" | "24m" | "max";

export function SalesPurchaseChartControls({
  timeRange, setTimeRange,
  predictionHorizon, setPredictionHorizon,
}: {
  timeRange: TimeRange;
  setTimeRange: (v: TimeRange) => void;
  predictionHorizon: number;
  setPredictionHorizon: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Horizon: {predictionHorizon}m
        </span>
        <Slider
          value={[predictionHorizon]}
          onValueChange={([v]) => setPredictionHorizon(v)}
          min={1}
          max={12}
          step={1}
          className="w-40"
        />
      </div>

      <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
        <SelectTrigger className="w-[140px]" aria-label="Select range">
          <SelectValue placeholder="6 months" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="6m">6 months</SelectItem>
          <SelectItem value="12m">12 months</SelectItem>
          <SelectItem value="18m">18 months</SelectItem>
          <SelectItem value="24m">24 months</SelectItem>
          <SelectItem value="max">Max</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
