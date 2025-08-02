"use client"
// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Item = {
  id: number
  sku: string
  type: string
  item_name: string
  variant: string | null
  qty: number
  threshold_qty: number
}

// This is the main page table columns definition.
// It defines the columns that will be displayed in the table.
export const columns: ColumnDef<Item>[] = [
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
      <DataTableColumnHeader
        column={column}
        title="SKU"
      />
    ),
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string
      const id = row.original.id
        
      return (
        <div 
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => window.location.href = `/inventory/item/${id}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              window.location.href = `/inventory/item/${id}`
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View details for ${sku}`}
        >
          {sku}
        </div>
      )
    },
  },
    // Item Type column
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Type"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // Variant column
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Variant"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("variant") || "-"}</div>,
  },
  // Quantity column
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Quantity"
      />
    ),
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number
      const threshold = row.original.threshold_qty
      const isLow = qty <= threshold

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
      )
    },
  },
  // Threshold Quantity column
  {
    accessorKey: "threshold_qty",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Threshold"
      />
    ),
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(item.sku)}
            >
              Copy SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit item</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
