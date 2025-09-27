import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { PaginatedUsers, UserCreate } from "@/types/user";
import { toQueryString } from "@/lib/utils";

export function getAllUsers(params?: Record<string, any>) {
  const query = toQueryString(params);
  return apiFetch<PaginatedUsers>(`${API_PATHS.user}${query}`);
}

export function createNewUser(payload: UserCreate) {
  return apiFetch<UserCreate>(API_PATHS.user, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}