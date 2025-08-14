import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { Item, ItemWithComponents } from "@/types/item";

export function getAllItems() {
  return apiFetch<Item[]>(API_PATHS.item);
}

export function getItemDetails(itemId: number) {
  const path = `${API_PATHS.item_details}/${itemId}`;
  return apiFetch<ItemWithComponents>(path);
}
