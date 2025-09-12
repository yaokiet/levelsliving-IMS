"use client";

export function parseNonNegativeInt(value: number): number | null {
  if (Number.isNaN(value) || value < 0) return null;
  return value;
}

// Parse a positive integer (>= 1)
export function parsePositiveInt(value: number): number | null {
  if (Number.isNaN(value) || value < 1) return null;
  return value;
}