"use client";

import { useItem } from "@/context/ItemContext";
import { ComponentDetail } from "@/types/item"; // <-- Use the new ComponentDetail type
import { columns } from "./item-components-columns"; // <-- This now imports the correct columns
import { ReusableTable } from "@/components/table/reusable/reusable-table";

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
        />
      )}
    </>
  );
}