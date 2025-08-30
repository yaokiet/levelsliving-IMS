"use client";

import React from "react";
import { mockSuppliers } from "@/types/supplier";
import { SupplierInfoCard } from "@/components/ui/supplier/supplier-info-card";
import { useParams } from "next/navigation";

// To use after implementing database retrieval logic
// function SupplierDetailsContent() {
//   const { supplier, loading, error } = useSupplier();

//   if (loading) {
//     return <div className="container mx-auto py-10 px-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-10 px-6 text-red-500">{error}</div>
//     );
//   }

//   if (!supplier) {
//     return null; // Or a "Not Found" message
//   }

function SupplierDetailsContent() {
  // Get the supplier ID from the route params
  const params = useParams();
  const supplierId = params?.id ? Number(params.id) : null;
  const supplier = mockSuppliers.find((s) => s.id === supplierId);

  if (!supplier) {
    return (
      <div className="container mx-auto py-10 px-6 text-red-500">
        Supplier not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <SupplierInfoCard supplier={supplier} />
    </div>
  );
}

// This is the main page export
export default function SupplierDetailsPage() {
  return <SupplierDetailsContent />;
}
