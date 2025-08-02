'use client'

import { useState, useEffect } from 'react'
import { columns, Item } from "./main-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"

function getData(): Promise<Item[]> {
  // Mock data that matches the Item type structure
  return Promise.resolve([
    {
      id: 1,
      sku: "CHAIR-001",
      type: "Furniture",
      item_name: "Office Chair",
      variant: "Black",
      qty: 15,
      threshold_qty: 10
    },
    {
      id: 2,
      sku: "DESK-001",
      type: "Furniture",
      item_name: "Standing Desk",
      variant: "Oak",
      qty: 8,
      threshold_qty: 5
    },
    {
      id: 3,
      sku: "MONITOR-001",
      type: "Electronics",
      item_name: "27-inch Monitor",
      variant: "Silver",
      qty: 3,
      threshold_qty: 5
    },
    {
      id: 4,
      sku: "KEYBOARD-001",
      type: "Electronics",
      item_name: "Mechanical Keyboard",
      variant: null,
      qty: 12,
      threshold_qty: 8
    },
    {
      id: 5,
      sku: "MOUSE-001",
      type: "Electronics",
      item_name: "Wireless Mouse",
      variant: "Black",
      qty: 7,
      threshold_qty: 10
    },
    {
      id: 6,
      sku: "LAMP-001",
      type: "Lighting",
      item_name: "Desk Lamp",
      variant: "White",
      qty: 20,
      threshold_qty: 15
    }
  ])
}

export default function MainPageTable() {
  const [data, setData] = useState<Item[]>([])
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
            searchPlaceholder="Filter items by SKU" 
            showViewOptions={true}
            showPagination={true}
          />
        )}
      </>
  )
}