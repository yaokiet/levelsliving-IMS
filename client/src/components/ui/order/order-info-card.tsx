import { cn } from "@/lib/utils";
import type { OrderItem } from "@/types/order-item";

type FieldDef<T> = {
  label: string;
  key?: keyof T | string; // supports dot paths via string
  accessor?: (data: T) => React.ReactNode;
};

interface OrderInfoCardProps<T extends Record<string, any> = OrderItem> {
  // Back-compat: existing prop
  orderItem?: OrderItem;
  // New, generic props
  data?: T;
  title?: string;
  fields?: FieldDef<T>[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

function getByPath(obj: any, path: string | number | symbol) {
  if (obj == null) return undefined;
  if (typeof path !== "string") return obj[path as any];
  if (!path.includes(".")) return obj[path];
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function OrderInfoCard<T extends Record<string, any> = OrderItem>({
  orderItem,
  data,
  title = "Order",
  fields,
  className = "",
  containerClassName =
    "flex flex-col md:flex-row items-center justify-between rounded-lg shadow p-8 bg-white dark:bg-gray-900 dark:text-gray-100",
  imageClassName = "w-40 h-40 object-contain rounded bg-white dark:bg-gray-300",
}: OrderInfoCardProps<T>) {
  const source = (data ?? (orderItem as any)) as T | undefined;

  // Default fields empty, must be passed in from parent
  const effectiveFields: FieldDef<T>[] = fields ?? [];

  if (!source) return null;

  return (
    <div className={cn(containerClassName, className)}>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-2">
          {effectiveFields.map((f, idx) => {
            const value = f.accessor
              ? f.accessor(source)
              : f.key
              ? (getByPath(source, f.key) as React.ReactNode)
              : undefined;
            return (
              <div className="flex" key={idx}>
                <span className="w-40 text-gray-600 dark:text-gray-300">{f.label}</span>
                <span className="font-medium break-words">{value as any}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Optional image block retained for future use */}
      {/* <div className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 px-3 py-3 border rounded-lg bg-white dark:bg-gray-300">
        <img
          src="/item-icon.png"
          alt=""
          className={imageClassName}
        />
      </div> */}
    </div>
  );
}