import { apiFetch } from "./apiClient";
import { API_DOMAIN, API_PATHS } from "./apiConfig";
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

export function getCurrentUser() {
    return apiFetch<User>(`${API_PATHS.user}/me`);
}

export function refresh() {
    return fetch(`${API_DOMAIN}${API_PATHS.refresh}`, {
        method: "POST",
        credentials: "include",
    });
}
