import { cn } from "@/lib/utils"
import type { Supplier } from "@/types/supplier";

interface SupplierInfoCardProps {
  supplier: Supplier;
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export function SupplierInfoCard({
  supplier,
  className = "",
  containerClassName = "flex flex-col md:flex-row items-center justify-between rounded-lg shadow p-8 bg-white dark:bg-gray-900 dark:text-gray-100",
  imageClassName = "w-40 h-40 object-contain rounded bg-white dark:bg-gray-300",
}: SupplierInfoCardProps) {
  return (
    <div className={cn(containerClassName, className)}>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Supplier Information</h2>
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Supplier ID</span>
            <span className="font-medium">{supplier.id}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Name</span>
            <span className="font-medium">{supplier.name}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Description</span>
            <span className="font-medium">{supplier.description || "No description"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Contact</span>
            <span className="font-medium">{supplier.contact_number || "No contact"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Email</span>
            <span className="font-medium">{supplier.email || "No email"}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png" // Placeholder image for now
          alt={`${supplier.name} logo`}
          className={imageClassName}
        />
      </div>
    </div>
  )
}
