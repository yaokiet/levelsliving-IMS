"use client";

import React from "react";
import { OrderProvider, useOrder } from "@/context/orderContext";
import { OrderInfoCard } from "@/components/ui/order/order-info-card";
import { Item } from "@/types/item";
import { getAllItems } from "@/lib/api/itemsApi";
import MainPageTable from "@/components/table/main/main-page-table";

function OrderDetailsContent() {
  const { order, loading, error } = useOrder();
  const [data, setData] = React.useState<Item[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  const loadItems = React.useCallback(async () => {
    setDataLoading(true);
    try {
      const items = await getAllItems();
      setData(items);
    } catch (e) {
      console.error("Error fetching items:", e);
    }
    finally {
      setDataLoading(false);
    }
  }, []);
  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

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
      <MainPageTable data={data} loading={dataLoading} onReload={loadItems} />
    </div>
  )
}


// This is the main page export
export default function OrderDetailsPage() {
  return (
    <OrderProvider>
      <OrderDetailsContent />
    </OrderProvider>
  );
}
