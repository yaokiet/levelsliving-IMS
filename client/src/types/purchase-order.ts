// Basic Purchase Order from API
export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  user_id: number;
  order_date: string;
  status?: 'pending' | 'ordered' | 'received' | 'cancelled';
}

// Paginated API Response structure
export interface PaginatedResponse<T> {
  meta: {
    page: number;
    size: number;
    has_prev: boolean;
    has_next: boolean;
    sort: string[];
    filters: Record<string, any>;
    total: number | null;
    pages: number | null;
  };
  data: T[];
}

// Extended Purchase Order with related data
export interface PurchaseOrderWithDetails extends PurchaseOrder {
  supplier_name: string;
  supplier_email: string;
  supplier_phone: string;
  supplier_description: string;
  po_items: PurchaseOrderItemDetail[];
  supplier?: {
    id: number;
    name: string;
    description?: string;
    email?: string;
    contact_number?: string;
  };
  user?: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  items?: PurchaseOrderItem[];
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

export interface PurchaseOrderItem {
  purchase_order_id: number;
  item_id: number;
  qty: number;
  supplier_item_id: number;
  // Related data when fetched with joins
  item?: {
    id: number;
    name: string;
    description?: string;
    category: string;
    min_stock_level: number;
    reorder_point: number;
    current_stock: number;
  };
  supplier_item?: {
    id: number;
    supplier_id: number;
    item_id: number;
    supplier_sku: string;
    cost: number;
    minimum_order_qty: number;
    description?: string;
  };
}

// API Request/Response types
export interface CreatePurchaseOrderRequest {
  supplier_id: number;
  user_id: number;
  order_date?: string;
}

export interface UpdatePurchaseOrderRequest {
  supplier_id?: number;
  user_id?: number;
  order_date?: string;
}

// Response type matches the basic PurchaseOrder
export interface PurchaseOrderResponse extends PurchaseOrder {}

export interface PurchaseOrderItemResponse {
  purchase_order_id: number;
  item_id: number;
  qty: number;
  supplier_item_id: number;
  item: {
    id: number;
    name: string;
    description?: string;
    category: string;
    min_stock_level: number;
    reorder_point: number;
    current_stock: number;
  };
  supplier_item: {
    id: number;
    supplier_id: number;
    item_id: number;
    supplier_sku: string;
    cost: number;
    minimum_order_qty: number;
    description?: string;
  };
}

// Table display types
export interface PurchaseOrderTableRow {
  id: number;
  order_date: string;
  supplier_name: string;
  user_name: string;
  total_items: number;
  total_cost: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
}
