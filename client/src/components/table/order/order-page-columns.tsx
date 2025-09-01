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
    accessorKey: "order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("order_id") as string;
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
  {
    accessorKey: "shopify_order_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Shopify Order ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("shopify_order_id")}</div>,
  },
  // Order Date column
  {
    accessorKey: "order_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => <div>{row.getValue("order_date")}</div>,
  },
  //   Cust name column
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  //   Contact Num
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  // Street
  {
    accessorKey: "street",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Street" />
    ),
    cell: ({ row }) => <div>{row.getValue("street")}</div>,
  },
  // Unit
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit" />
    ),
    cell: ({ row }) => <div>{row.getValue("unit")}</div>,
  },
  // Postal Code
  {
    accessorKey: "postal_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Postal Code" />
    ),
    cell: ({ row }) => <div>{row.getValue("postal_code")}</div>,
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
      const id = row.original.order_id;
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
