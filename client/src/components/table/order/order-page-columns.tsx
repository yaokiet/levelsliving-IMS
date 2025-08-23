"use client"

// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table"
import { OrderItem } from "@/types/order-item"

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header"

// Order page columns definition
// Defines the columns that will be displayed in the table
export const columns: ColumnDef<OrderItem>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      console.log("Row", row.id, "can expand?", row.getCanExpand());
      console.log("Row", row.id, "subRows:", row.original.subRows);

      return row.getCanExpand() ?
        <button onClick={row.getToggleExpandedHandler()} className="flex items-center">
          {row.getIsExpanded() ? '👇' : '👉'}
        </button> : null
    }
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
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
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
    accessorKey: "cust_contact",
    header: ({ column }) => (
        <DataTableColumnHeader
            column={column}
            title="Contact Number"
        />
    ),
    cell: ({ row }) => <div>{row.getValue("cust_contact")}</div>,
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
    filterFn: (row, columnId, filterValue) => {
      // Show all if filterValue is empty, else filter by status
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
]

export const orderItemColumns = [
  { accessorKey: "item_name", header: "Item Name" },
  { accessorKey: "sku", header: "SKU" },
]
