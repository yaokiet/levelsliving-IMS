"use client";

// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table";
import { OrderItem } from "@/types/order-item";

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header";
import { useRouter } from "next/navigation";

// Order page columns definition
// Defines the columns that will be displayed in the table
export const columns: ColumnDef<OrderItem>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      console.log("Row", row.id, "can expand?", row.getCanExpand());
      console.log("Row", row.id, "subRows:", row.original.subRows);

      return row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="flex items-center"
        >
          {row.getIsExpanded() ? "👇" : "👉"}
        </button>
      ) : null;
    },
  },
  // Order ID Column
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const router = useRouter();

      return (
        <div
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/orders/${id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/orders/${id}`);
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View details for ${id}`}
        >
          {id}
        </div>
      );
    },
  },
  //   Cust name column
  {
    accessorKey: "cust_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("cust_name")}</div>,
  },
  // Order Date column
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => <div>{row.getValue("order_date")}</div>,
  },
  //   Contact Num
  {
    accessorKey: "cust_contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("cust_contact")}</div>,
  },
  // Order Qty Column
  {
    accessorKey: "order_qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue("order_qty")}</div>,
  },
  // Status column  (Non existent so far)
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
    filterFn: (row, columnId, filterValue) => {
      // Show all if filterValue is empty, else filter by status
      if (!filterValue) return true;
      return row.getValue(columnId) === filterValue;
    },
  },
];

export const orderItemColumns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      const id = row.original.id;
      const router = useRouter();

      return (
        <div
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/item-details/${id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/item-details/${id}`);
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
  { accessorKey: "item_name", header: "Item Name" },
];
