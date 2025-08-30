import { apiFetch } from "./apiClient";
import { API_PATHS } from "./apiConfig";
import { User } from "@/types/user";

export function getAllUsers() {
    return apiFetch<User[]>(API_PATHS.user);
}

