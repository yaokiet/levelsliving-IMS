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
import { OrderItem } from "@/types/order-item"

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header"

// Order page columns definition
// Defines the columns that will be displayed in the table
export const columns: ColumnDef<OrderItem>[] = [
    // https://dev.to/yangerrai/expand-tanstack-table-row-to-display-non-uniform-data-39og
    // To follow up later for making it expandable to show the item_name



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
    // Order ID Column
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order ID"
      />
    ),
    cell: ({ row }) => {
      const orderId = row.getValue("id") as number
      const id = row.original.id
      const router = useRouter();

      return (
        <div 
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/item-details/${id}`)} // Placeholder for navigation into order item page
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push(`/item-details/${id}`) // Placeholder for navigation
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View details for ${id}`}
        >
          {orderId}
        </div>
      )
    },
  },
    //   Cust name column
  {
    accessorKey: "cust_name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer Name"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("cust_name")}</div>,
  },
    // Order Date column
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order Date"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("order_date")}</div>,
  },
    //   Contact Num
  {
    accessorKey: "contact_num",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Contact Number"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("contact_num")}</div>,
  },
    //   Contact Num
  {
    accessorKey: "contact_num",
    header: ({ column }) => (
        <DataTableColumnHeader
            column={column}
            title="Contact Number"
        />
    ),
    cell: ({ row }) => <div>{row.getValue("contact_num")}</div>,
  },
    // Order Qty Column
  {
    accessorKey: "order_qty",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order Quantity"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("order_qty")}</div>,
  },
    // Status column  (Non existent so far)
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
]