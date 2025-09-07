"use client";

import React, { useState, useEffect } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierInfoCard } from "@/components/ui/supplier/supplier-info-card";
import { useParams } from "next/navigation";
import { getSupplier } from "@/lib/api/supplierApi";

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
  const params = useParams();
  const supplierId = params?.id ? Number(params.id) : null;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!supplierId) {
        setError("Invalid supplier ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const supplierData = await getSupplier(supplierId);
        setSupplier(supplierData);
      } catch (err) {
        console.error("Error fetching supplier:", err);
        setError("Failed to load supplier details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg">Loading supplier details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Error</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto py-10 px-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Not Found</div>
            <div className="text-sm text-muted-foreground">Supplier not found.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 sm:px-6">
      <SupplierInfoCard supplier={supplier} />
    </div>
  );
}

// This is the main page export
export default function SupplierDetailsPage() {
  return <SupplierDetailsContent />;
}
