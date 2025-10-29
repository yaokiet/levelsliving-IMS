export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
export const API_PREFIX = "/levelsliving/app/api/v1";

export const API_PATHS = {
    // Authentication endpoints
    login: `${API_PREFIX}/login`,
    logout: `${API_PREFIX}/logout`,
    refresh: `${API_PREFIX}/refresh`,
    user: `${API_PREFIX}/user`,

    // Order endpoints
    order: `${API_PREFIX}/order`,
    order_with_items: `${API_PREFIX}/order/with-items`,
    order_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}`,
    order_with_items_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}/with-items`,

    // Purchase Order endpoints
    purchase_order: `${API_PREFIX}/purchase-order`,
    purchase_order_by_id: (purchaseOrderId: number | string) => `${API_PREFIX}/purchase-order/${purchaseOrderId}`,

    // Supplier endpoints
    supplier: `${API_PREFIX}/supplier`,
    supplier_by_id: (supplierId: number | string) => `${API_PREFIX}/supplier/${supplierId}`,
    supplier_search_by_items: `${API_PREFIX}/supplier/by-items`,
    
    //supplier-item endpoints
    supplier_item: `${API_PREFIX}/supplier-item`,

    // Item endpoints
    item: `${API_PREFIX}/item`,
    item_details: `${API_PREFIX}/item/details`,
    create_new_item: `${API_PREFIX}/item/create`,
    update_existing_item: (itemId: number | string) => `${API_PREFIX}/item/${itemId}`,

    // Item Component endpoints
    create_item_component: () => `${API_PREFIX}/item-component`,
    remove_item_component: (parentId: number, childId: number) =>
        `${API_PREFIX}/item-component/${parentId}/${childId}`,

    // Cart endpoints
    cart: `${API_PREFIX}/cart`,
    cart_item: (itemId: number | string) => `${API_PREFIX}/cart/${itemId}`,
    cart_bulk_add: `${API_PREFIX}/cart/bulk-add/`,

    // Forecast endpoints
    forecast_inventory: `${API_PREFIX}/forecast`,
};