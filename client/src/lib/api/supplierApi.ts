import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import type { Supplier, SupplierCreate, SupplierUpdate } from "@/types/supplier";

/**
 * Get all suppliers
 */
export async function getAllSuppliers(): Promise<Supplier[]> {
    try {
        const result = await apiFetch<Supplier[]>(API_PATHS.supplier);
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error('Error in getAllSuppliers:', error);
        return [];
    }
}

export async function getSuppliersByItemIds(itemIds: number[]): Promise<Supplier[]> {
    if (itemIds.length === 0) {
        return [];
    }   
    return apiFetch<Supplier[]>(API_PATHS.supplier_search_by_items, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_ids: itemIds }),
    });
}

/**
 * Get a supplier by ID
 */
export async function getSupplier(supplierId: number): Promise<Supplier> {
    return apiFetch<Supplier>(API_PATHS.supplier_by_id(supplierId));
}

/**
 * Create a new supplier
 */
export async function createSupplier(supplier: SupplierCreate): Promise<Supplier> {
    return apiFetch<Supplier>(API_PATHS.supplier, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
    });
}

/**
 * Update an existing supplier
 */
export async function updateSupplier(
    supplierId: number,
    supplier: SupplierUpdate
): Promise<Supplier> {
    return apiFetch<Supplier>(API_PATHS.supplier_by_id(supplierId), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(supplier),
    });
}

/**
 * Delete a supplier
 */
export async function deleteSupplier(supplierId: number): Promise<Supplier> {
    return apiFetch<Supplier>(API_PATHS.supplier_by_id(supplierId), {
        method: "DELETE",
    });
}
