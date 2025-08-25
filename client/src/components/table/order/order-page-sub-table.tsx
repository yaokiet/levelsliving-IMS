'use client'

// This file defines the columns for the main page table.

import { useState, useEffect } from 'react'
import { OrderItem, mockOrderItems } from "@/types/order-item"
import { orderItemColumns } from "./order-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"

export default function OrderPageSubTable({ data }: { data: OrderItem[] }) {
  // const [data, setData] = useState<OrderItem[]>([])
  // const [loading, setLoading] = useState(true)
  const loading = false; // Set loading to false since data is passed as a prop

  // useEffect(() => {
  //   setData(mockOrderItems)
  //   setLoading(false)
  // }, [])

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
            columns={orderItemColumns} 
            data={data} 
          />
        )}
      </>
  )
}