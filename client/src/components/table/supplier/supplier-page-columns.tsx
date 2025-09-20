"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Phone, Mail } from "lucide-react";
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
import { deleteSupplier } from "@/lib/api/supplierApi";

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

export function createColumns(onSupplierDeleted?: () => void): ColumnDef<Supplier>[] {
  return [
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
    meta: {
      label: "ID",
    },
  },
  // Supplier Name column with responsive layout
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier Name" />
    ),
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{supplier.name}</div>
          {/* Show description on smaller screens only */}
          <div className="text-sm text-muted-foreground block md:hidden">
            {supplier.description || "No description"}
          </div>
          {/* Show contact info on smaller screens only */}
          <div className="flex flex-col gap-1 md:hidden">
            {supplier.contact_number && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {supplier.contact_number}
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {supplier.email}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  // Description column (hidden on small screens)
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("description") as string;
      return (
        <div className="max-w-[200px] truncate">
          {value || "No description"}
        </div>
      );
    },
    meta: {
      label: "ID",
      className: "hidden md:table-cell",
    },
  },
  // Contact Number column (hidden on small screens)
  {
    accessorKey: "contact_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("contact_number") as string;
      return <span>{value || "No contact"}</span>;
    },
    meta: {
      className: "hidden lg:table-cell",
    },
  },
  // Email column (hidden on small screens)
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return (
        <div className="max-w-[150px] truncate">
          {value || "No email"}
        </div>
      );
    },
    meta: {
      className: "hidden lg:table-cell",
    },
  },
  // Actions column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplier = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
          try {
            await deleteSupplier(supplier.id);
            alert("Supplier deleted successfully!");
            // Refresh the table data
            onSupplierDeleted?.();
          } catch (error) {
            console.error("Error deleting supplier:", error);
            alert("Failed to delete supplier. Please try again.");
          }
        }
      };

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
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleDelete}
            >
              Remove supplier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      className: "w-[50px]",
    },
  },
];
}

// For backward compatibility, export a default columns array
export const columns = createColumns();
