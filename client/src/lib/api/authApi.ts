import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { User } from "@/types/auth"

export function login(email: string, password: string) {
  return apiFetch<User>(API_PATHS.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiFetch(API_PATHS.logout, { method: "POST" });
}
