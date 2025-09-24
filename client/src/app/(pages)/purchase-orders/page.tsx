'use client';

import { useRef } from 'react';
import PurchaseOrderPageTable, { PurchaseOrderTableRef } from "@/components/table/purchase-order/purchase-order-page-table";

export default function PurchaseOrdersPage() {
  const tableRef = useRef<PurchaseOrderTableRef>(null);

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Purchase Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track purchase orders</p>
      </div>
      
      <PurchaseOrderPageTable ref={tableRef} />
    </div>
  );
}
