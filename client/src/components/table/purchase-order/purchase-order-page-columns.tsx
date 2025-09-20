"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/table/reusable/data-table-column-header";
import type { PurchaseOrderTableRow } from "@/types/purchase-order";
import { formatDate } from "@/lib/utils";

// Clickable Purchase Order ID component
function ClickablePurchaseOrderID({ purchaseOrderId }: { purchaseOrderId: number }) {
  const router = useRouter();
  
  return (
    <Button
      variant="link"
      className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
      onClick={() => router.push(`/purchase-orders/${purchaseOrderId}`)}
    >
      PO #{purchaseOrderId.toString().padStart(4, '0')}
    </Button>
  );
}

export function createColumns(): ColumnDef<PurchaseOrderTableRow>[] {
  return [
    // Purchase Order ID column (clickable)
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Purchase Order" />
      ),
      cell: ({ row }) => {
        const purchaseOrderId = row.getValue("id") as number;
        return <ClickablePurchaseOrderID purchaseOrderId={purchaseOrderId} />;
      },
      meta: {
        label: "ID",
      },
    },
    // Order Date column
    {
      accessorKey: "order_date",
      accessorFn: (row) => {
        // Return both raw ISO date and formatted date for searching
        const rawDate = row.order_date;
        const formattedDate = formatDate(rawDate);
        return `${rawDate} ${formattedDate}`;
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Date" />
      ),
      cell: ({ row }) => {
        const dateValue = row.original.order_date as string;
        return <span>{formatDate(dateValue)}</span>;
      },
      meta: {
        label: "Order Date",
      },
    },
    // Status column
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors = {
          pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          ordered: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          received: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
        
        return (
          <Badge 
            variant="secondary" 
            className={statusColors[status as keyof typeof statusColors] || ""}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      meta: {
        label: "Status",
      },
    },
  ];
}

// For backward compatibility, export a default columns array
export const columns = createColumns();