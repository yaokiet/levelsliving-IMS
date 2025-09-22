"use client";

// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import type { Item } from "@/types/item";

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header";

export const orderPageColumns = (
): ColumnDef<Item>[] => [
  // This column is for selecting rows.
  // It allows users to select multiple rows for bulk actions.
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // SKU column
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    meta : { label: "SKU" },
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      const id = row.original.id;
      const router = useRouter();

      return (
        <div
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/item-details/${id}`)} // Placeholder for navigation
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/item-details/${id}`); // Placeholder for navigation
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View details for ${sku}`}
        >
          {sku}
        </div>
      );
    },
  },
  // Item Type column
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    meta: { label: "Type" },
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // Variant column
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    meta: { label: "Variant" },
    cell: ({ row }) => <div>{row.getValue("variant") || "-"}</div>,
  },
  // Quantity column
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    meta: { label: "Quantity" },
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number;
      const threshold = row.original.threshold_qty;
      const isLow = qty <= threshold;

      return (
        <div className="flex items-center">
          <span className="font-medium">{qty}</span>
          {isLow && (
            <AlertCircle
              className="ml-2 h-4 w-4 text-amber-500"
              aria-label={`Below threshold (${threshold})`}
            />
          )}
        </div>
      );
    },
  },
  // Threshold Quantity column
  {
    accessorKey: "threshold_qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold" />
    ),
    meta: { label: "Threshold Qty" },
  },
];

export const orderPageTableFilterableColumns = [
  { key: "sku", label: "SKU" },
  { key: "type", label: "Type" },
  { key: "variant", label: "Variant" },
  { key: "qty", label: "Quantity" },
  { key: "threshold_qty", label: "Threshold Qty" },
];