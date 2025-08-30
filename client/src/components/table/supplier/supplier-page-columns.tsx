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

// Clickable Supplier ID component
function ClickableSupplierID({ supplierId }: { supplierId: number }) {
  const router = useRouter();
  
  return (
    <Button
      variant="link"
      className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
      onClick={() => router.push(`/suppliers/${supplierId}`)}
    >
      {supplierId}
    </Button>
  );
}

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
  // Supplier ID column (clickable)
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier ID" />
    ),
    cell: ({ row }) => {
      const supplierId = row.getValue("id") as number;
      return <ClickableSupplierID supplierId={supplierId} />;
    },
  },
  // Supplier Name column
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier Name" />
    ),
  },
  // Description column
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("description") as string;
      return <span>{value || "No description"}</span>;
    },
  },
  // Contact Number column
  {
    accessorKey: "contact_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("contact_number") as string;
      return <span>{value || "No contact"}</span>;
    },
  },
  // Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <span>{value || "No email"}</span>;
    },
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
              onClick={() => navigator.clipboard.writeText(supplier.name)}
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
