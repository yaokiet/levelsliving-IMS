"use client";

// This file defines the columns for the components table in the item details page (Child Page).
// It uses TanStack Table for defining the structure and behavior of the table columns.

import { useItem } from "@/context/ItemContext";
import { ComponentDetail } from "@/types/item"; // <-- Use the new ComponentDetail type
import { columns } from "./item-components-columns"; // <-- This now imports the correct columns
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { DataTableAddSelected } from "@/components/table/reusable/data-table-add-selected-to-cart";

export default function ItemComponentsTable() {
  const { item, loading } = useItem();

  // The data for the table is now an array of ComponentDetail objects
  const data: ComponentDetail[] = item?.components || [];

  return (
    <>
      {loading ? (
        <div>Loading components...</div>
      ) : (
        <ReusableTable
          columns={columns}
          data={data}
          searchKey="sku" // <-- Updated to a more useful search key
          searchPlaceholder="Filter components by SKU..."
          showViewOptions={true}
          showPagination={true}
          renderToolbarExtras={({ table }) => (
            <DataTableAddSelected<ComponentDetail>
              table={table}
              label="Add selected to cart"
              clearAfterAdd
              onAddSelected={(items) => {
                console.log("Add to cart:", items);
              }}
            />
          )}
        />
      )}
    </>
  );
}