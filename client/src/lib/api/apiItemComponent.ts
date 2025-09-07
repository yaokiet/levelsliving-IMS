import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";

export function createItemComponent(parentId: number, childId: number) {
  const path = API_PATHS.create_item_component();
  return apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parent_id: parentId, child_id: childId }),
  });
}

export function removeItemComponent(parentId: number, childId: number) {
  const path = API_PATHS.remove_item_component(parentId, childId);
  return apiFetch(path, { method: "DELETE" });
}