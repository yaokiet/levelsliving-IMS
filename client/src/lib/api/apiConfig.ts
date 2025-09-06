export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
export const API_PREFIX = "/levelsliving/app/api/v1";

export const API_PATHS = {
    login: `${API_PREFIX}/login`,
    logout: `${API_PREFIX}/logout`,
    refresh: `${API_PREFIX}/refresh`,
    user: `${API_PREFIX}/user`,
    item: `${API_PREFIX}/item`,
    item_details: `${API_PREFIX}/item/details`,
    order: `${API_PREFIX}/order`,
    order_with_items: `${API_PREFIX}/order/with-items`,
    order_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}`,
    order_with_items_by_id: (orderId: number | string) => `${API_PREFIX}/order/${orderId}/with-items`,
    update_existing_item: (itemId: number | string) => `${API_PREFIX}/item/${itemId}`,
    // // Add more as needed
};