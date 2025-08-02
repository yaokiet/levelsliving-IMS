import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { Item } from "@/types/item"

export function getAllItems() {
    return apiFetch<Item[]>(API_PATHS.item);
}
