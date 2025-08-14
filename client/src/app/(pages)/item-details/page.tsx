"use client";

import React from "react";
import { ItemProvider, useItem } from "@/context/ItemContext";
import { ItemInfoCard } from "@/components/ui/item/item-info-card";
import TableSection from "@/components/table/table-section";
import MainPageTable from "@/components/table/main/main-page-table";

// This is the main page export
export default function ItemDetailsPage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <MainPageTable />
    </div>
  );
}
