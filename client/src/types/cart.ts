export interface CartItemPayload {
  item_id: number;
  quantity: number;
}

export interface CartBulkCreatePayload {
  items: CartItemPayload[];
}
