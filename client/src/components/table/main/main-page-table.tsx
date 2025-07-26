'use client'

import { useState, useEffect } from 'react'
import { columns, Inventory } from "./main-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"

function getData(): Promise<Inventory[]> {
  // Fetch data from your API here.
  return Promise.resolve([
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed53g",
      amount: 200,
      status: "success",
      email: "john@example.com",
    },
  ])
}

export default function MainPageTable() {
  const [data, setData] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getData()
      .then(result => {
        setData(result)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch data:", error)
        setLoading(false)
      })
  }, [])

  return (
      <>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ReusableTable 
            columns={columns} 
            data={data} 
            searchKey="email" 
            searchPlaceholder="Filter emails... test" 
            showViewOptions={true}
            showPagination={true}
          />
        )}
      </>
  )
}