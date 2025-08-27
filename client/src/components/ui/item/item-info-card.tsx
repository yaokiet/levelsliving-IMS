import { cn } from "@/lib/utils"
import type { Item } from "@/types/item";

interface ItemInfoCardProps {
  item: Item;
  className?: string;
}

export function ItemInfoCard({
  item,
  className,
}: ItemInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between rounded-lg shadow p-8 bg-white dark:bg-gray-900 dark:text-gray-100",
        className
      )}
    >
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Item Information</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Item Name</span>
            <span className="font-medium">{item.item_name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Item SKU</span>
            <span className="font-medium">{item.sku}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Category</span>
            <span className="font-medium">{item.type}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Type</span>
            <span className="font-medium">{item.variant || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Quantity</span>
            <span className="font-medium">{item.qty}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png" // Placeholder image for now
          alt={item.item_name}
          className="w-40 h-40 object-contain rounded bg-white dark:bg-gray-300"
        />
      </div>
    </div>
  )
}