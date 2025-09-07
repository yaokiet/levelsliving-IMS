"use client";

// This file defines the columns for the main page table.
import React from "react";
import { Item } from "@/types/item";
import { createMainPageColumns } from "./main-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { AddToCartModal } from "@/components/ui/modal/add-to-cart-modal";

interface MainPageTableProps {
  data: Item[];
  loading?: boolean;
  onReload?: () => void | Promise<void>;
}

export default function MainPageTable({data, loading = false, onReload}: MainPageTableProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleAddToCartClick = React.useCallback((id: number) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  // Build columns with the click handler
  const columns = React.useMemo(
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
          />
          <AddToCartModal
            open={open}
            onOpenChange={setOpen}
            itemId={selectedId}
            onConfirm={handleConfirm}
            title="Add item to cart"
            description="Are you sure you want to add this item to the cart?"
            confirmLabel="Add"
            cancelLabel="Cancel"
          />
        </div>
      )}
    </>
  );
}
