"use client";

// This file defines the columns for the main page table.
import React, { useMemo } from "react";
import { Item } from "@/types/item";
import { orderPageColumns, orderPageTableFilterableColumns } from "./order-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";

interface orderPageTableProps {
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
export default function orderPageTable({
  data,
  loading = false,
}: orderPageTableProps) {
  // Build columns (no handlers needed for add to cart)
  const columns = useMemo(
    () => orderPageColumns(),
    []
  );

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
            filterableColumns={orderPageTableFilterableColumns}
          />
        </div>
      )}
    </>
  );
}
