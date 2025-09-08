"use client";

import React, { useEffect } from "react";
import MainPageTable from "@/components/table/main/main-page-table";
import { ItemAddModal } from "@/components/ui/item/item-add-modal";
import { getAllItems } from "@/lib/api/itemsApi";
import type { Item } from "@/types/item";

/**
 * Page component for the item details page.
 *
 * This component fetches all items from the server and renders a table
 * of them. It also renders an "Add Item" button that opens the
 * ItemAddModal component when clicked.
 *
 * @returns {JSX.Element} The item details page component.
 */
export default function ItemDetailsPage() {
  const [data, setData] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadItems = React.useCallback(async () => {
    setLoading(true);
    try {
      const items = await getAllItems();
      setData(items);
    } catch (e) {
      console.error("Error fetching items:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <div className="container mx-auto py-10 px-6">
      {/* onCreated & onReload are use to refresh the table but both are used for
      different situations */}
      <ItemAddModal
        onCreated={loadItems}
        dialogTitle="Add Item"
        buttonName="Add Item"
        confirmButtonText="Create Item"
      />
      <MainPageTable data={data} loading={loading} onReload={loadItems} />
    </div>
  );
}
