'use client'

// This file defines the columns for the main page table.

import { useState, useEffect } from 'react'
import { OrderItem, mockOrderItems } from "@/types/order-item"
import { columns } from "./order-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"
import OrderPageSubTable from './order-page-sub-table';

export default function OrderPageTable() {
  const [data, setData] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(mockOrderItems)
    setLoading(false)
  }, [])

  const renderSubRows = (row: any) => (
    <tr>
      <td colSpan={columns.length} className="p-0" style={{ padding: 0 }}>
        <OrderPageSubTable data={row.subRows.map((r: { original: any }) => r.original)} />
      </td>
    </tr>
  )

// Fetch items when the component mounts
//   useEffect(() => {
//       try {
//         getAllItems().then(items => {
//           console.log("Fetched items:", items)
//           setData(items)
//           setLoading(false)
//         })
//       }
//       catch (error) {
//         console.error("Error fetching items:", error)
//       }

//     }, []);
  
  return (
      <>
        {loading ? (
          <div>Loading...</div>
        ) : (
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
        )}
      </>
  )
}