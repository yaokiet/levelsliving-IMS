import { API_DOMAIN } from "./apiConfig";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { skipBase?: boolean }
): Promise<T> {
  const url = options?.skipBase ? path : `${API_DOMAIN}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}