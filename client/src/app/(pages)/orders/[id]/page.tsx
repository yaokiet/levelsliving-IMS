"use client";

import React from "react";
import { mockOrderItems } from "@/types/order-item";
import { OrderInfoCard } from "@/components/ui/order/order-info-card";
import { useParams } from "next/navigation";
import { ItemProvider, useItem } from "@/context/ItemContext";
import { ComponentDetail } from "@/types/item";
import { columns } from "@/components/table/main/main-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";

// To use after implementing database retrieval logic
// function ItemDetailsContent() {
//   const { item, loading, error } = useItem();

//   if (loading) {
//     return <div className="container mx-auto py-10 px-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto py-10 px-6 text-red-500">{error}</div>
//     );
//   }

//   if (!item) {
//     return null; // Or a "Not Found" message
//   }


function OrderDetailsContent() {
  // Get the order ID from the route params
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : null;
  const order = mockOrderItems.find((o) => o.id === orderId);
  const { item, loading } = useItem();

  const data: ComponentDetail[] = item?.components || [];

  if (!order) {
    return (
      <div className="container mx-auto py-10 px-6 text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10 px-6">
        <OrderInfoCard orderItem={order} />
      
      <ReusableTable
        columns={columns}
        data={data}
        showViewOptions={true}
        showPagination={true}
      />
      </div>
    </>
  );
}

// This is the main page export
export default function OrderDetailsPage() {
  return (
    <ItemProvider>
      <OrderDetailsContent />
    </ItemProvider>
  );
}
