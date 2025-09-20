"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

export function createColumns(): ColumnDef<Supplier>[] {
  return [
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
        label: "id",
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
      meta: {
        label: "name",
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
        label: "contact_number",
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
        label: "email",
        className: "hidden lg:table-cell",
      },
    },
  ];
}

// For backward compatibility, export a default columns array
export const columns = createColumns();
