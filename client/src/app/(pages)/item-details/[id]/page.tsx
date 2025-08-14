"use client";

import React from "react";
import { ItemProvider, useItem } from "@/context/ItemContext";
import { ItemInfoCard } from "@/components/ui/item/item-info-card";
import ItemComponentsTable from "@/components/table/main/item-components-table";

// This is the inner component that will have access to the context
function ItemDetailsContent() {
  const { item, loading, error } = useItem();

  if (loading) {
    return <div className="container mx-auto py-10 px-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-6 text-red-500">{error}</div>
    );
  }

  if (!item) {
    return null; // Or a "Not Found" message
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <ItemInfoCard
        name={item.item_name}
        sku={item.sku}
        category={item.type}
        type={item.variant || "N/A"}
        quantity={item.qty}
      />

      <ItemComponentsTable />
    </div>
  );
}

// This is the main page export
export default function ItemDetailsPage() {
  return (
    <ItemProvider>
      <ItemDetailsContent />
    </ItemProvider>
  );
}
