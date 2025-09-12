import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { PaginatedUsers } from "@/types/user";
import { toQueryString } from "@/lib/utils";

export function getAllUsers(params?: Record<string, any>) {
  const query = toQueryString(params);
  return apiFetch<PaginatedUsers>(`${API_PATHS.user}${query}`);
}

