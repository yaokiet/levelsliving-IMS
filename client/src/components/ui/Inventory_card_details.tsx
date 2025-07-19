import React from "react"

interface ItemInfoProps {
  name: string
  sku: string
  category: string
  type: string
  quantity: number
  imageUrl: string
}

export const ItemInfo: React.FC<ItemInfoProps> = ({
  name,
  sku,
  category,
  type,
  quantity,
  imageUrl,
}) => 
  <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow p-8">
    <div className="flex-1">
      <h2 className="text-xl font-semibold mb-4">Item Information</h2>
      <div className="space-y-2">
        <div className="flex">
          <span className="w-32 text-gray-600">Item Name</span>
          <span className="font-medium">{name}</span>
          </div>
       
        <div className="flex">
          <span className="w-32 text-gray-600">Item SKU</span>
          <span className="font-medium">{sku}</span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-600">Category</span>
          <span className="font-medium">{category}</span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-600">Type</span>
          <span className="font-medium">{type}</span>
        </div>
        <div className="flex">
          <span className="w-32 text-gray-600">Quantity</span>
          <span className="font-medium">{quantity}</span>
        </div>
      </div>
    </div>
    <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8">
      <img
        src={imageUrl}
        alt={name}
        className="w-40 h-40 object-contain rounded"
      />
    </div>
  </div>



  {/* Inventory Card Details */}
  //import { ItemInfo } from "@/components/ui/Inventory_card_details";
  //{filteredItems.length > 0 && (
   // <div className="mb-8">
    //  <ItemInfo
     //   name={filteredItems[0].name}
    //    sku={filteredItems[0].sku}
     //   category={filteredItems[0].category}
     //   type={filteredItems[0].name}
     //   quantity={filteredItems[0].quantity}
     //   imageUrl="https://picsum.photos/id/237/200/300"
    //  />
   // </div>
  //)}
