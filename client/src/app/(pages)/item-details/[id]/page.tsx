"use client";

import React from "react";
import { ItemProvider, useItem } from "@/context/ItemContext";
import { ItemInfoCard } from "@/components/ui/item/item-info-card";
import ItemComponentsTable from "@/components/table/main/item-components-table";
import { ItemEditModal } from "@/components/ui/item/item-edit-modal";
import { useRouter } from "next/navigation";
import { ItemAddChildItem } from "@/components/ui/item/item-add-child-item";
import { ItemAddModal } from "@/components/ui/item/item-add-modal";

// This is the inner component that will have access to the context
function ItemDetailsContent() {
  const { item, loading, error, refetch } = useItem();
  const router = useRouter();

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
        item={item}
        action={
          <ItemEditModal
            item={item}
            onUpdated={async () => {
              // fetch latest details into context
              await refetch();
            }}
          />
        }
      />
      <div className="flex gap-2 mb-4">
        <ItemAddChildItem
          item={item}
          // To prevent adding duplicates, exclude current component IDs
          excludeIds={item.components.map((comp) => comp.id)}
          // Ensure the table refresh after adding a component
          onAdded={async () => {
            await refetch();
          }}
        />
        {/* Create a brand new item and immediately link it as a child */}
        <ItemAddModal
          parentItemId={item.id}
          dialogTitle="Create & Link New Child Item"
          buttonName="Create & Link New Item"
          confirmButtonText="Create & Link Child Item"
          onCreated={async () => {
            await refetch();
          }}
        />
      </div>
      {/* Components Table */}
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
