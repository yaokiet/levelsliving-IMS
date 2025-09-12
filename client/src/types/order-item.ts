import type { Item } from "./item";
import { PageMeta } from "./pagination";

export interface OrderItem {
    id: number,
    shopify_order_id: number,
    order_date: Date,
    name: string,
    contact: number,
    street: string,
    unit: string,
    postal_code: string,
    subRows: Item[],
    status: string,
    // order_status: string,
}

export interface PaginatedOrderItems {
    meta: PageMeta;
    data: OrderItem[];
}