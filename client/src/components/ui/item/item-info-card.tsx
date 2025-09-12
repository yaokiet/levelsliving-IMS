import { cn } from "@/lib/utils";
import type { Item } from "@/types/item";

interface ItemInfoCardProps {
  item: Item;
  className?: string;
  action?: React.ReactNode;
}

export function ItemInfoCard({ item, className, action }: ItemInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg shadow p-6 md:p-8 bg-white dark:bg-gray-900 dark:text-gray-100",
        className
      )}
    >
      {/* Left: Details */}
      <div className="flex-1 w-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Item Information</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Basic details about this item
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">
              Item Name
            </span>
            <span className="font-medium">{item.item_name}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">
              Item SKU
            </span>
            <span className="font-medium">{item.sku}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">
              Category
            </span>
            <span className="font-medium">{item.type}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">Type</span>
            <span className="font-medium">{item.variant || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">
              Quantity
            </span>
            <span className="font-medium">{item.qty}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-600 dark:text-gray-300">
              Threshold Quantity
            </span>
            <span className="font-medium">{item.threshold_qty}</span>
          </div>
        </div>
      </div>

      {/* Right: Action above image */}
      <div className="flex-shrink-0 mt-6 md:mt-0 md:ml-8 w-full md:w-auto">
        <div className="flex flex-col items-center md:items-end">
          {action && (
            <div className="mb-3 w-full md:w-auto flex justify-end">
              {action}
            </div>
          )}

          <div className="px-3 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <img
              src="/item-icon.png"
              alt={item.item_name}
              className="w-40 h-40 object-contain rounded bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
