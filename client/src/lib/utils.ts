import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, v));
    } else if (value !== undefined && value !== null) {
      usp.append(key, value);
    }
  });
  return usp.toString() ? `?${usp.toString()}` : "";
}

export function getFilterableColumns(columns: any[]) {
  return columns
    .filter((col) => typeof col.accessorKey === "string")
    .map((col) => ({
      key: col.accessorKey,
      label: col.meta?.label ?? col.accessorKey,
    }));
}