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
            <span className="font-medium">{supplier.supplierName}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Product</span>
            <span className="font-medium">{supplier.product}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Contact</span>
            <span className="font-medium">{supplier.contactNumber}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Email</span>
            <span className="font-medium">{supplier.email}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Address</span>
            <span className="font-medium">{supplier.address || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Type</span>
            <span className={`font-medium ${supplier.type.toLowerCase().includes("taking return") ? "text-green-500" : "text-red-500"}`}>
              {supplier.type}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Status</span>
            <span className={`font-medium ${supplier.status?.toLowerCase() === "active" ? "text-green-500" : "text-red-500"}`}>
              {supplier.status || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">Registration</span>
            <span className="font-medium">{supplier.registrationDate || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-600 dark:text-gray-300">On the Way</span>
            <span className="font-medium">{supplier.onTheWay}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png" // Placeholder image for now
          alt={`${supplier.supplierName} logo`}
          className={imageClassName}
        />
      </div>
    </div>
  )
}
