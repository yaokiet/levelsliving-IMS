'use client'

import { useState, useEffect } from 'react'
import { Supplier, mockSuppliers } from "@/types/supplier"
import { columns } from "./supplier-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"

export default function SupplierPageTable() {
  const [data, setData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(mockSuppliers)
    setLoading(false)
  }, [])

// Fetch suppliers when the component mounts
//   useEffect(() => {
//       try {
//         getAllSuppliers().then(suppliers => {
//           console.log("Fetched suppliers:", suppliers)
//           setData(suppliers)
//           setLoading(false)
//         })
//       }
//       catch (error) {
//         console.error("Error fetching suppliers:", error)
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
          searchKey="name" 
          searchPlaceholder="Filter suppliers by name"
          showViewOptions={true}
          showPagination={true}
        />
      )}
    </>
  )
}
