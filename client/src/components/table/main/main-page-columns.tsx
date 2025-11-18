"use client";

// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Item } from "@/types/item";
import { ItemEditModal } from "@/components/ui/item/item-edit-modal";
import { LinkSupplierModal } from "@/components/ui/item/link-to-supplier-modal"

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header";

// This is the main page table columns definition.
// It defines the columns that will be displayed in the table.
type AddToCartHandler = (id: number) => void;

export const createMainPageColumns = (
  onAddToCart?: AddToCartHandler,
  onItemUpdated?: () => void | Promise<void>
): ColumnDef<Item>[] => [
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
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    meta : { label: "SKU" },
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string;
      const id = row.original.id;
      const router = useRouter();

      return (
        <div
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/item-details/${id}`)} // Placeholder for navigation
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/item-details/${id}`); // Placeholder for navigation
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
  // Item Type column
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    meta: { label: "Type" },
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // Variant column
  {
    accessorKey: "variant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variant" />
    ),
    meta: { label: "Variant" },
    cell: ({ row }) => <div>{row.getValue("variant") || "-"}</div>,
  },
  // Quantity column
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    meta: { label: "Quantity" },
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number;
      const threshold = row.original.threshold_qty;
      const isLow = qty <= threshold;

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
      );
    },
  },
  // Threshold Quantity column
  {
    accessorKey: "threshold_qty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Threshold" />
    ),
    meta: { label: "Threshold Qty" },
  },
  // Add to cart button column
  {
    id: "add-to-cart",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          variant="outline"
          onClick={() =>
            onAddToCart
              ? onAddToCart(item.id)
              : console.log("Add to cart clicked, item id: ", item.id)
          }
        >
          Add to cart
        </Button>
      );
    },
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const [editOpen, setEditOpen] = useState(false);
      const [linkSupplierOpen, setLinkSupplierOpen] = useState(false); // 2. Add state for the new modal
      const [dropdownOpen, setDropdownOpen] = useState(false);

      const handleSuccess = async () => {
        // You can add success notifications (toasts) here
        toast.success("Supplier linked successfully");
        await onItemUpdated?.();
      };

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
                onClick={() => navigator.clipboard.writeText(item.sku)}
              >
                Copy SKU
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setLinkSupplierOpen(true); setDropdownOpen(false); }}
              >
                Link to Supplier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setEditOpen(true); setDropdownOpen(false); }}>
                Edit item
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => { (true); setDropdownOpen(false); }} className="text-red-600">
                Delete item
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Item Edit Modal */}
          <ItemEditModal
            item={item}
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            hideLauncher
            onUpdated={onItemUpdated}
          />

          <LinkSupplierModal
            item={item}
            isOpen={linkSupplierOpen}
            setIsOpen={setLinkSupplierOpen}
            onSuccess={handleSuccess}
          />
        </>
      );
    },
  },
];

export const mainTableFilterableColumns = [
  { key: "sku", label: "SKU" },
  { key: "type", label: "Type" },
  { key: "variant", label: "Variant" },
  { key: "qty", label: "Quantity" },
  { key: "threshold_qty", label: "Threshold Qty" },
];