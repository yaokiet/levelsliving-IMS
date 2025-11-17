import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import {
  type PurchaseOrder,
  type PurchaseOrderWithDetails,
  type PurchaseOrderTableRow,
  type PaginatedPurchaseOrders,
  PurchaseOrderStatus,
} from "@/types/purchase-order";

//For now i will leave the comment for the console.log. Later can remove if not needed.

/**
 * Get all purchase orders (returns paginated response with basic data)
 */
export async function getAllPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const result = await apiFetch<PaginatedPurchaseOrders>(
      API_PATHS.purchase_order
    );

    console.log("🔍 getAllPurchaseOrders - Raw backend response:", result);

    // Backend returns paginated response, extract the data array
    if (
      result &&
      typeof result === "object" &&
      "data" in result &&
      Array.isArray(result.data)
    ) {
      console.log(
        "✅ getAllPurchaseOrders - Extracted data array:",
        result.data
      );
      console.log("📊 getAllPurchaseOrders - Meta info:", result.meta);
      return result.data;
    }

    console.warn(
      "⚠️ getAllPurchaseOrders - Unexpected response format:",
      result
    );
    return [];
  } catch (error) {
    console.error("Error in getAllPurchaseOrders:", error);
    return [];
  }
}

/**
 * Get a purchase order with full details (supplier, user, items) from backend
 */
export async function getPurchaseOrderWithDetails(
  id: number
): Promise<PurchaseOrderWithDetails> {
  console.log(
    `🔍 getPurchaseOrderWithDetails - Fetching details for PO ID: ${id}`
  );

  // Use the backend endpoint that already joins the tables
  const result = await apiFetch<PurchaseOrderWithDetails>(
    API_PATHS.purchase_order_by_id(id)
  );

  console.log("🔍 getPurchaseOrderWithDetails - Raw backend response:", result);
  console.log(
    "📦 getPurchaseOrderWithDetails - PO Items count:",
    result.po_items?.length || 0
  );
  console.log("🏢 getPurchaseOrderWithDetails - Supplier info:", {
    name: result.supplier_name,
    email: result.supplier_email,
    phone: result.supplier_phone,
  });

  return result;
}

/**
 * Get purchase orders formatted for table display
 */
export async function getPurchaseOrdersForTable(): Promise<
  PurchaseOrderTableRow[]
> {
  try {
    console.log("🔍 getPurchaseOrdersForTable - Fetching data for table...");

    // Get the paginated response from backend
    const result = await apiFetch<PaginatedPurchaseOrders>(
      API_PATHS.purchase_order
    );

    console.log("🔍 getPurchaseOrdersForTable - Raw backend response:", result);

    if (!result || !result.data || !Array.isArray(result.data)) {
      console.warn("⚠️ getPurchaseOrdersForTable - No valid data in response");
      return [];
    }

    console.log(
      `📋 getPurchaseOrdersForTable - Processing ${result.data.length} purchase orders`
    );

    // Transform the basic purchase order data into table format

    const tableData = result.data.map((po) => {
      console.log(`🔄 Transforming PO ${po.id}:`, po);
      return {
        id: po.id,
        order_date: po.order_date,
        supplier_name: `Supplier ${po.supplier_id}`, // Backend should provide supplier_name
        user_name: `User ${po.user_id}`, // Backend should provide user_name
        total_items: 0, // Backend should provide calculated total_items
        total_cost: 0, // Backend should provide calculated total_cost
        status: po.status || PurchaseOrderStatus.Pending,
      };
    });

    console.log("✅ getPurchaseOrdersForTable - Final table data:", tableData);
    return tableData;
  } catch (error) {
    console.error("Error in getPurchaseOrdersForTable:", error);
    return [];
  }
}

// end point to create PO
export async function createPurchaseOrder(
  supplierId: number,
  status: String,
  order_date: Date
): Promise<PurchaseOrder> {
  const formattedDate = order_date.toISOString().slice(0, 10);
  return apiFetch<PurchaseOrder>(API_PATHS.purchase_order, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      supplier_id: supplierId,
      status: status,
      order_date: formattedDate,
    }),
  });
}
