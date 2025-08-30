"use client";

import React from "react";
import SupplierPageTable from "@/components/table/supplier/supplier-page-table";

// This is the main page export
export default function SuppliersPage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <SupplierPageTable />
    </div>
  );
}
