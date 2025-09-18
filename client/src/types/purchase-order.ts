import { Supplier } from './supplier';
import { PageMeta } from './pagination';

// Basic Purchase Order from API
export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  user_id: number;
  order_date: string;
  status?: 'pending' | 'ordered' | 'received' | 'cancelled';
}

// Purchase Order Item Detail as returned by API
export interface PurchaseOrderItemDetail {
  item_id: number;
  sku: string;
  item_name: string;
  variant: string;
  ordered_qty: number;
  supplier_item_id: number;
}

// Item data structure (can be reused across different contexts)
export interface ItemData {
  id: number;
  name: string;
  description?: string;
  category: string;
  min_stock_level: number;
  reorder_point: number;
  current_stock: number;
}

// Supplier Item data structure (can be reused across different contexts)
export interface SupplierItemData {
  id: number;
  supplier_id: number;
  item_id: number;
  supplier_sku: string;
  cost: number;
  minimum_order_qty: number;
  description?: string;
}

// User data structure (can be reused across different contexts)
export interface UserData {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

// Purchase Order Item with related data
export interface PurchaseOrderItem {
  purchase_order_id: number;
  item_id: number;
  qty: number;
  supplier_item_id: number;
  item?: ItemData;
  supplier_item?: SupplierItemData;
}

// Extended Purchase Order with all related data
export interface PurchaseOrderWithDetails extends PurchaseOrder {
  supplier_name: string;
  supplier_email: string;
  supplier_phone: string;
  supplier_description: string;
  po_items: PurchaseOrderItemDetail[];
  supplier?: Supplier;
  user?: UserData;
  items?: PurchaseOrderItem[];
}

// Paginated Purchase Order response
export interface PaginatedPurchaseOrders {
  meta: PageMeta;
  data: PurchaseOrder[];
}

// Table display type
export interface PurchaseOrderTableRow {
  id: number;
  order_date: string;
  supplier_name: string;
  user_name: string;
  total_items: number;
  total_cost: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
}
