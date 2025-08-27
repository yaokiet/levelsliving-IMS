import { cn } from "@/lib/utils"
import type { OrderItem } from "@/types/order-item";

interface OrderInfoCardProps {
  orderItem: OrderItem;
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export function OrderInfoCard({
  orderItem,
  className = "",
  containerClassName = "flex flex-col md:flex-row items-center justify-between rounded-lg shadow p-8 bg-white dark:bg-gray-900 dark:text-gray-100",
  imageClassName = "w-40 h-40 object-contain rounded bg-white dark:bg-gray-300",
}: OrderInfoCardProps) {
  return (
    <div className={cn(containerClassName, className)}>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Item Information</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Item Name</span>
            <span className="font-medium">{orderItem.id}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Item SKU</span>
            <span className="font-medium">{orderItem.cust_name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Category</span>
            <span className="font-medium">{orderItem.order_date}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Type</span>
            <span className="font-medium">{orderItem.order_qty}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Quantity</span>
            <span className="font-medium">{orderItem.status}</span>
          </div>
        </div>
      </div>
      {/* <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png" // Placeholder image for now
          alt={orderItem.subRows && orderItem.subRows.length > 0 ? orderItem.subRows.map(item => item.item_name).join(", ") : "No items"}
          className={imageClassName}
        />
      </div> */}
    </div>
  )
}