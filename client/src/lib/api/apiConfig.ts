export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:8000";
export const API_PREFIX = "/levelsliving/app/api/v1";

export const API_PATHS = {
  login: `${API_PREFIX}/login`,
  logout: `${API_PREFIX}/logout`,
  refresh: `${API_PREFIX}/refresh`,
  user: `${API_PREFIX}/user`,
  // Add more as needed
};