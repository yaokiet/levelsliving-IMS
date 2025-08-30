import { API_DOMAIN, API_PATHS } from "./apiConfig";
import { logout, refresh } from "./authApi";
import { store } from "@/app/_store/redux-store";
import { clearUser } from "@/app/_store/authSlice";

export async function apiFetch<T>(
    path: string,
    options?: RequestInit & { skipBase?: boolean }
): Promise<T> {
    const url = options?.skipBase ? path : `${API_DOMAIN}${path}`;
    let res = await fetch(url, {
        credentials: "include",
        ...options,
    });

    if (res.status === 403) {
        if (typeof window !== "undefined") {
            window.location.href = "/unauthorized";
        }
        throw new Error("Forbidden: You do not have permission to access this resource.");
    }

    if (res.status === 401 && path !== API_PATHS.refresh) {
        // Try to refresh token
        const refreshRes = await refresh();
        if (refreshRes.ok) {
            // Retry original request
            res = await fetch(url, {
                credentials: "include",
                ...options,
            });
        } else {
            // Refresh failed, log out
            store.dispatch(clearUser());
            await logout();
            throw new Error("Session expired. Please log in again.");
        }
    }

    if (!res.ok) {
        throw new Error(await res.text());
    }
    return res.json();
}