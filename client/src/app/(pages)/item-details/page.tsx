"use client";

import React from "react";
import MainPageTable from "@/components/table/main/main-page-table";
import { ItemAddModal } from "@/components/ui/item/item-add-modal";

// This is the main page export
export default function ItemDetailsPage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <ItemAddModal />
      <MainPageTable />
    </div>
  );
}
