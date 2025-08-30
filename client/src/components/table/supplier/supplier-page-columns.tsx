"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/table/reusable/data-table-column-header";
import type { Supplier } from "@/types/supplier";

export const columns: ColumnDef<Supplier>[] = [
  // Select checkbox column
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
  // Supplier Name column
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier Name" />
    ),
  },
  // Product column
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  // Contact Number column
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
  },
  // Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  // Type column with color coding
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("type") as string;
      const isTakingReturn = value.toLowerCase().includes("taking return");
      const colorClass = isTakingReturn ? "text-green-500" : "text-red-500";
      return (
        <span className={`font-medium ${colorClass}`}>
          {value}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // Status column
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      const isActive = value?.toLowerCase() === "active";
      const colorClass = isActive ? "text-green-500" : "text-red-500";
      return (
        <span className={`font-medium ${colorClass}`}>
          {value}
        </span>
      );
    },
  },
  // On the way column
  {
    accessorKey: "onTheWay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On the way" />
    ),
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;
      const router = useRouter();

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
              onClick={() => navigator.clipboard.writeText(supplier.supplierName)}
            >
              Copy Supplier Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/suppliers/${supplier.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit supplier</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Remove supplier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
