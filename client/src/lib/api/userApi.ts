import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { PaginatedUsers } from "@/types/user";

export function getAllUsers(params?: Record<string, any>) {
  // Pass query params for pagination, search, etc.
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiFetch<PaginatedUsers>(`${API_PATHS.user}${query}`);
}

