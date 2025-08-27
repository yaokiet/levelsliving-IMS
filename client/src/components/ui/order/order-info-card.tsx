import { cn } from "@/lib/utils"
import type { OrderItem } from "@/types/order-item";

interface OrderInfoCardProps {
    orderItem: OrderItem;
}

export function OrderInfoCard({
  orderItem,
}: OrderInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between rounded-lg shadow p-8 bg-white dark:bg-gray-900 dark:text-gray-100"
      )}
    >
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Item Information</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Item ID</span>
            <span className="font-medium">{orderItem.id}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Customer Name</span>
            <span className="font-medium">{orderItem.cust_name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Order Date</span>
            <span className="font-medium">{orderItem.order_date}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Customer Contact</span>
            <span className="font-medium">{orderItem.cust_contact}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Quantity Ordered</span>
            <span className="font-medium">{orderItem.order_qty}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Status</span>
            <span className="font-medium">{orderItem.status}</span>
          </div>
        </div>
      </div>
      {/* <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png" // Placeholder image for now
          alt={orderItem.subRows && orderItem.subRows.length > 0 ? orderItem.subRows.map(item => item.item_name).join(", ") : "No items"}
          className="w-40 h-40 object-contain rounded bg-white dark:bg-gray-300"
        />
      </div> */}
    </div>
  )
}