"use client";

// This file defines the columns for the main page table.

import { useState, useEffect } from "react";
import { OrderItem } from "@/types/order-item";
import { columns } from "./order-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { getOrdersWithItems } from "@/lib/api/ordersApi";
import OrderPageSubTable from "./order-page-sub-table";

/**
 * Normalize API responses to an array of OrderItem
 *
 * @param input - Input can be an array of OrderItem, or an object with a property
 *   named "data", "orders", or "items" containing an array of OrderItem
 * @returns An array of OrderItem
 */
function normalizeOrders(input: any): OrderItem[] {
  // Accept common API shapes and coerce to an array
  if (Array.isArray(input)) return input as OrderItem[];
  if (Array.isArray(input?.data)) return input.data as OrderItem[];
  if (Array.isArray(input?.orders)) return input.orders as OrderItem[];
  if (Array.isArray(input?.items)) return input.items as OrderItem[];
  return [];
}

export default function OrderPageTable() {
  const [data, setData] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const orders = await getOrdersWithItems();
        console.log("Fetched orders:", orders, "Array?", Array.isArray(orders));
        const normalized = normalizeOrders(orders);
        if (!active) return;
        if (!Array.isArray(normalized)) {
          throw new Error("Orders response is not an array");
        }
        setData(normalized);
      } catch (e: any) {
        console.error("Error fetching orders:", e);
        if (active) setError(e?.message || "Failed to load orders");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const renderSubRows = (row: any) => (
    <tr>
      <td colSpan={columns.length} className="p-0" style={{ padding: 0 }}>
        <OrderPageSubTable
          data={row.subRows.map((r: { original: any }) => r.original)}
        />
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ReusableTable
      columns={columns}
      data={data}
      searchKey="cust_name"
      searchPlaceholder="Filter items by Customer Name"
      showViewOptions={true}
      showPagination={true}
      // subRowColumns={orderItemColumns}
      filterKey="status"
      filterLabel="Status"
      renderSubRows={renderSubRows}
    />
  );
}
