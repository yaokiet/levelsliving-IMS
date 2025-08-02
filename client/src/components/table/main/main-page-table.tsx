'use client'

import { useState, useEffect } from 'react'
import { Item } from "@/types/item"
import { columns } from "./main-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"
import { getAllItems } from "@/lib/api/itemsApi"

export default function MainPageTable() {
  const [data, setData] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      try {
        getAllItems().then(items => {
          console.log("Fetched items:", items)
          setData(items)
          setLoading(false)
        })
      }
      catch (error) {
        console.error("Error fetching items:", error)
      }

    }, []);
  
  return (
      <>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ReusableTable 
            columns={columns} 
            data={data} 
            searchKey="email" 
            searchPlaceholder="Filter items by SKU" 
            showViewOptions={true}
            showPagination={true}
          />
        )}
      </>
  )
}