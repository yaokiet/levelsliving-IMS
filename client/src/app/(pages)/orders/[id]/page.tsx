"use client";

import React from "react";
import { OrderProvider, useOrder } from "@/context/orderContext";
import { OrderInfoCard } from "@/components/ui/order/order-info-card";

function OrderDetailsContent() {
  const { order, loading, error } = useOrder();

  if (loading) {
    return <div className="container mx-auto py-10 px-6">Loading...</div>;
  }


  if (error) {
    return (
      <div className="container mx-auto py-10 px-6 text-red-500">{error}</div>
    );
  }

  if (!order) {
    return null; // Or a "Not Found" message
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <OrderInfoCard
        orderItem={order}
        title={`Order Details`}
        fields={[
          { label: "Order ID", key: "order_id" },
          { label: "Shopify Order ID", key: "shopify_order_id" },
          { label: "Ordered Date", key: "order_date" },
          { label: "Customer Name", key: "name" },
          { label: "Contact", key: "contact" },
          { label: "Street", key: "street" },
          { label: "Unit", key: "unit" },
          { label: "Postal Code", key: "postal_code" },
        ]}
      />
    </div>
  )
}

// function OrderDetailsContent() {
//   // Get the order ID from the route params
//   const params = useParams();
//   const orderId = params?.id ? Number(params.id) : null;
//   const order = mockOrderItems.find((o) => o.id === orderId);
//   const { item, loading } = useItem();

//   const data: ComponentDetail[] = item?.components || [];

//   if (!order) {
//     return (
//       <div className="container mx-auto py-10 px-6 text-red-500">
//         Order not found.
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="container mx-auto py-10 px-6">
//         <OrderInfoCard orderItem={order} />
      
//       <ReusableTable
//         columns={columns}
//         data={data}
//         showViewOptions={true}
//         showPagination={true}
//       />
//       </div>
//     </>
//   );
// }

// This is the main page export
export default function OrderDetailsPage() {
  return (
    <OrderProvider>
      <OrderDetailsContent />
    </OrderProvider>
  );
}
