"use client";

// This file defines the columns for the main page table.
import React, { useMemo } from "react";
import { Item } from "@/types/item";
import { createMainPageColumns, mainTableFilterableColumns } from "./main-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { AddToCartModal } from "@/components/ui/modal/add-to-cart-modal";
import { getFilterableColumns } from "@/lib/utils";

interface MainPageTableProps {
  data: Item[];
  loading?: boolean;
  onReload?: () => void | Promise<void>;
}

/**
 * A table component for the main page, showing a list of items.
 *
 * @param {Item[]} data The list of items to display.
 * @param {boolean} [loading=false] If true, display a "Loading..." message instead of the table.
 * @param {() => void | Promise<void>} [onReload] A callback to be called when item is edited successfully
 */
export default function MainPageTable({
  data,
  loading = false,
  onReload,
}: MainPageTableProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // Handler for when "Add to Cart" is clicked in a row
  const handleAddToCartClick = React.useCallback((id: number) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  // Build columns with handlers
  // onReload is passed to refresh the table after an item is updated
  // handleAddToCartClick is passed to open the AddToCartModal with the correct item ID
  const columns = useMemo(
    () => createMainPageColumns(handleAddToCartClick, onReload),
    [handleAddToCartClick, onReload]
  );

  // Replace with your real cart logic
  const handleConfirm = React.useCallback(async (id: number) => {
    console.log("Confirmed add-to-cart for ID:", id);
    // Modal will close itself after onConfirm resolves
  }, []);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ReusableTable
            columns={columns}
            data={data}
            searchKey="sku"
            searchPlaceholder="Filter items by SKU"
            showViewOptions={true}
            showPagination={true}
            filterableColumns={mainTableFilterableColumns} // need for both client and server side search
          />
          <AddToCartModal
            open={open}
            onOpenChange={setOpen}
            itemId={selectedId}
            onSuccess={() => setOpen(false)}
            itemName={data.find((item) => item.id === selectedId)?.item_name || null}
          />
        </div>
      )}
    </>
  );
}
