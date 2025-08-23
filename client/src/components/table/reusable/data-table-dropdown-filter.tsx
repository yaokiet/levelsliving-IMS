"use client"

// This file defines a reusable dropdown filter component for data tables.
// It allows users to filter table data based on specific criteria.
// By using accessorKey, column header (key) to filter what rows to display

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DropdownFilterSelectProps {
  filterKey: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function DropdownFilterSelect({ filterKey, options, value, onChange, label, className }: DropdownFilterSelectProps) {
  return (
    <div className={className}>
      {label && <label className="mr-2">{label}</label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All</SelectItem>
          {options.map(opt => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
