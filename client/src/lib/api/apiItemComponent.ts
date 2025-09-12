import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";

export type ItemComponentCreate = {
  parent_id: number;
  child_id: number;
  qty_required: number;
};

export function createItemComponent(data: ItemComponentCreate) {
  const path = API_PATHS.create_item_component();
  return apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function removeItemComponent(parentId: number, childId: number) {
  const path = API_PATHS.remove_item_component(parentId, childId);
  return apiFetch(path, { method: "DELETE" });
}