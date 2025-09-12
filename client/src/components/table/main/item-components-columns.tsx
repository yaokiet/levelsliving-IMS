"use client";

// This file defines the columns for the components table in the main page.
// It uses TanStack Table for defining the structure and behavior of the table columns.

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComponentDetail } from "@/types/item";
import { useItem } from "@/context/ItemContext";
import { ItemEditModal } from "@/components/ui/item/item-edit-modal";
import { DataTableColumnHeader } from "../reusable/data-table-column-header";
import { ItemRemoveComponentModal } from "@/components/ui/item/item-remove-component-modal";

export const columns: ColumnDef<ComponentDetail>[] = [
  // This column is for selecting rows.
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
  // Component SKU column
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Component SKU" />
    ),
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      const id = row.original.id;
      const router = useRouter();

      // This makes the SKU a clickable link to that component's own details page
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
  // Component Name column
  {
    accessorKey: "item_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Component Name" />
    ),
  },
  // Component Type column
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // Required Quantity column
  {
    accessorKey: "qty_required",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Required Qty" />
    ),
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const component = row.original;
      const [editOpen, setEditOpen] = useState(false);
      const [removeOpen, setRemoveOpen] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      // Get parent item from context to pass to remove modal
      // Refetch function to update table after edit
      const { item, refetch } = useItem();

      return (
        <>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(component.sku)}
              >
                Copy Component SKU
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setEditOpen(true); setDropdownOpen(false); }}>
                Edit item
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setRemoveOpen(true); setDropdownOpen(false); }}
                className="text-red-600"
              >
                Remove component
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Item Edit Modal */}
          <ItemEditModal
            item={component}
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            hideLauncher
            // After successful edit, refetch the context to update the table
            // The table will re-render automatically when context updates
            onUpdated={async () => {
              await refetch();
            }}
          />

          {/* Remove Component Modal (parent from context item) */}
          {item && (
            <ItemRemoveComponentModal
              parent={{ id: item.id, sku: item.sku, item_name: item.item_name }}
              child={{
                id: component.id,
                sku: component.sku,
                item_name: component.item_name,
              }}
              isOpen={removeOpen}
              setIsOpen={setRemoveOpen}
              hideLauncher
              onRemoved={async () => {
                await refetch();
              }}
            />
          )}
        </>
      );
    },
  },
];
