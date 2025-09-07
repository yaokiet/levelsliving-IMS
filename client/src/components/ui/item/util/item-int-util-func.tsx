"use client";

export function parseNonNegativeInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

// Parse a positive integer (>= 1)
export function parsePositiveInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return null;
  return n;
}