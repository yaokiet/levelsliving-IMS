'use client'

// This file defines the columns for the main page table.

import { OrderItem } from "@/types/order-item"
import { orderItemColumns } from "./order-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"

export default function OrderPageSubTable({ data }: { data: OrderItem[] }) {
  const loading = false; // Set loading to false since data is passed as a prop

  return (
      <>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ReusableTable 
            columns={orderItemColumns} 
            data={data}
            showViewOptions={false} 
            showPagination={false}
            // Make changes to the color scheme of sub-table aka Expanded table here
            className= "rounded-none w-4/5 mx-auto"
            containerClassName=""
          />
        )}
      </>
  )
}