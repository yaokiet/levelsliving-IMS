import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { PaginatedUsers, UserCreate, UserUpdate } from "@/types/user";
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

export function updateUser(userId: string, payload: Partial<UserUpdate>) {
  return apiFetch<UserUpdate>(`${API_PATHS.user}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteUser(userId: string) {
  return apiFetch<void>(`${API_PATHS.user}/${userId}`, {
    method: "DELETE",
  });
}