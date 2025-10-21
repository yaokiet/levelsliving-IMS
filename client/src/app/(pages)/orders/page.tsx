"use client";

import React from "react";
import OrderPageTable from "@/components/table/order/order-page-table";

// This is the main page export
export default function OrdersPage() {
  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold">Orders</h2>
      <OrderPageTable />
    </div>
  );
}