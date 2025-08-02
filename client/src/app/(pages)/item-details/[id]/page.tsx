import React from "react"
import { ItemInfoCard } from "@/components/ui/item/item-info-card"
import TableSection from "@/components/table/table-section"

export default function ItemDetailsPage() {
  // Example item data
  const item = {
    name: "Sample Item",
    sku: "SKU12345",
    category: "Electronics",
    type: "Gadget",
    quantity: 42,
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <ItemInfoCard
        name={item.name}
        sku={item.sku}
        category={item.category}
        type={item.type}
        quantity={item.quantity}
      />
      <TableSection />
    </div>
  )
}