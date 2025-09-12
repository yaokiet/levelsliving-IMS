"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ColumnMultiSelectProps {
  options: { key: string; label: string }[];
  value: string[];
  onChange: (cols: string[]) => void;
  placeholder?: string;
}

export function ColumnMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select columns",
}: ColumnMultiSelectProps) {
  // Map selected keys to labels for display
  const selectedLabels = value.map((key) => {
    const option = options.find((opt) => opt.key === key);
    return option ? option.label : key;
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-2">
          {value.length > 0 ? `Columns: ${selectedLabels.join(", ")}` : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-1">
          {options.map((col) => (
            <label
              key={col.key}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={value.includes(col.key)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...value, col.key]);
                  } else {
                    onChange(value.filter((k) => k !== col.key));
                  }
                }}
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}