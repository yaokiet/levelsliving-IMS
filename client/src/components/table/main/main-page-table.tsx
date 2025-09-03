"use client";

// This file defines the columns for the main page table.

import React, { useState, useEffect } from "react";
import { Item } from "@/types/item";
import { columns, createMainPageColumns } from "./main-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { getAllItems } from "@/lib/api/itemsApi";
import { AddToCartModal } from "@/components/ui/modal/add-to-cart-modal";
// import { DataTableAddSelected } from "@/components/table/reusable/data-table-add-selected-to-cart"

type Props = {
  items: Item[];
};

export default function MainPageTable() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleAddToCartClick = React.useCallback((id: number) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  // Build columns with the click handler
  const columns = React.useMemo(
    () => createMainPageColumns(handleAddToCartClick),
    [handleAddToCartClick]
  );

  // Replace with your real cart logic
  const handleConfirm = React.useCallback(async (id: number) => {
    console.log("Confirmed add-to-cart for ID:", id);
    // Modal will close itself after onConfirm resolves
  }, []);

  // Fetch items when the component mounts
  useEffect(() => {
    try {
      getAllItems().then((items) => {
        console.log("Fetched items:", items);
        setData(items);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    }
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
