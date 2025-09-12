export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
export const API_PREFIX = "/levelsliving/app/api/v1";

export const API_PATHS = {
    login: `${API_PREFIX}/login`,
    logout: `${API_PREFIX}/logout`,
    refresh: `${API_PREFIX}/refresh`,
    user: `${API_PREFIX}/user`,

    // Order endpoints
    order: `${API_PREFIX}/order`,
    order_with_items: `${API_PREFIX}/order/with-items`,
    order_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}`,
    order_with_items_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}/with-items`,

    // Item endpoints
    update_existing_item: (itemId: number | string) => `${API_PREFIX}/item/${itemId}`,
    create_new_item: `${API_PREFIX}/item/create`,
    item: `${API_PREFIX}/item`,
    item_details: `${API_PREFIX}/item/details`,

    // Item Component endpoints
    create_item_component: () => `${API_PREFIX}/item-component`,
    remove_item_component: (parentId: number, childId: number) =>
        `${API_PREFIX}/item-component/${parentId}/${childId}`,

    //Cart endpoints
    cart: `${API_PREFIX}/cart`,
    cart_item: (itemId: number | string) => `${API_PREFIX}/cart/${itemId}`,
    cart_bulk_add: `${API_PREFIX}/cart/bulk-add/`,

};