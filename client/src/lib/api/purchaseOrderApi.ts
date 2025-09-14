import { apiFetch } from './apiClient';
import { API_PATHS } from './apiConfig';
import { getAllSuppliers, getSupplier } from './supplierApi';
import type {
  PurchaseOrder,
  PurchaseOrderWithDetails,
  PurchaseOrderResponse,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  PurchaseOrderTableRow,
  PaginatedResponse
} from '@/types/purchase-order';
import type { Supplier } from '@/types/supplier';

/**
 * Get all purchase orders (basic data only)
 */
export async function getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const result = await apiFetch<PaginatedResponse<PurchaseOrder> | PurchaseOrder[]>(API_PATHS.purchase_order);
    
    // Handle paginated response structure
    if (result && typeof result === 'object' && 'data' in result) {
      return Array.isArray(result.data) ? result.data : [];
    }
    
    // Handle direct array response
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error in getAllPurchaseOrders:', error);
    return [];
  }
}

/**
 * Get a purchase order by ID (basic data only)
 */
export async function getPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return apiFetch<PurchaseOrder>(API_PATHS.purchase_order_by_id(id));
}

/**
 * Get a purchase order with full details (supplier, user, items)
 */
export async function getPurchaseOrderWithDetails(id: number): Promise<PurchaseOrderWithDetails> {
  const purchaseOrder = await getPurchaseOrder(id);
  
  // Get supplier details
  let supplier;
  try {
    supplier = await getSupplier(purchaseOrder.supplier_id);
  } catch (error) {
    console.warn('Failed to fetch supplier details:', error);
  }

  // Note: User details would need a user API endpoint
  // For now, we'll just use the basic structure
  const user = {
    id: purchaseOrder.user_id,
    username: `User ${purchaseOrder.user_id}`,
    email: '',
    full_name: `User ${purchaseOrder.user_id}`,
  };

  return {
    ...purchaseOrder,
    supplier,
    user,
    items: [], // Items would need separate API calls to purchase order items
  };
}

/**
 * Create a new purchase order
 */
export async function createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
  return apiFetch<PurchaseOrder>(API_PATHS.purchase_order, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing purchase order
 */
export async function updatePurchaseOrder(id: number, data: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> {
  return apiFetch<PurchaseOrder>(API_PATHS.purchase_order_by_id(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Delete a purchase order
 */
export async function deletePurchaseOrder(id: number): Promise<void> {
  await apiFetch<void>(API_PATHS.purchase_order_by_id(id), {
    method: 'DELETE',
  });
}

/**
 * Get purchase orders formatted for table display
 */
export async function getPurchaseOrdersForTable(): Promise<PurchaseOrderTableRow[]> {
  try {
    const [purchaseOrdersResponse, suppliersResponse] = await Promise.all([
      getAllPurchaseOrders(),
      getAllSuppliers()
    ]);
    
    // Ensure we have arrays
    const purchaseOrders = Array.isArray(purchaseOrdersResponse) ? purchaseOrdersResponse : [];
    const suppliers = Array.isArray(suppliersResponse) ? suppliersResponse : [];
    
    if (purchaseOrders.length === 0) {
      return [];
    }
    
    // Create a map for quick supplier lookup
    const supplierMap = new Map<number, Supplier>();
    suppliers.forEach(supplier => {
      supplierMap.set(supplier.id, supplier);
    });
    
    return purchaseOrders.map(po => {
      const supplier = supplierMap.get(po.supplier_id);
      
      return {
        id: po.id,
        order_date: po.order_date,
        supplier_name: supplier?.name || `Unknown Supplier (ID: ${po.supplier_id})`,
        user_name: `User ${po.user_id}`, // Would need user API to get actual name
        total_items: 0, // Would need items API to calculate
        total_cost: 0, // Would need items API to calculate
        status: po.status || 'pending' as const
      };
    });
  } catch (error) {
    console.error('Error in getPurchaseOrdersForTable:', error);
    if (error instanceof Error && error.message.includes('Not authenticated')) {
      throw new Error('Authentication required to access purchase orders');
    }
    
    // For other errors, return empty array to prevent UI crashes
    return [];
  }
}
