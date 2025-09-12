import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { Item, ItemWithComponents, ItemCreate, ItemUpdate } from "@/types/item";

export function getAllItems() {
  return apiFetch<Item[]>(API_PATHS.item);
}

export function getItemDetails(itemId: number) {
  const path = `${API_PATHS.item_details}/${itemId}`;
  return apiFetch<ItemWithComponents>(path);
}

export function createNewItem(payload: ItemCreate) {
  return apiFetch<Item>(API_PATHS.item, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Update Item
export function updateExistingItem(itemId: number, payload: ItemUpdate) {
  const path = API_PATHS.update_existing_item(itemId);
  return apiFetch<Item>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


// To implement API for retrieving the child details