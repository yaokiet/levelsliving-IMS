interface ItemInfoCardProps {
  name: string
  sku: string
  category: string
  type: string
  quantity: number
}

export function ItemInfoCard({
  name,
  sku,
  category,
  type,
  quantity,
}: ItemInfoCardProps) {
  return (
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
          src={""}
          alt={name}
          className="w-40 h-40 object-contain rounded"
        />
      </div>
    </div>
  )
}