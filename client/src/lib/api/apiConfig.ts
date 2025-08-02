export const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
export const API_PREFIX = "/levelsliving/app/api/v1";

export const API_PATHS = {
    login: `${API_PREFIX}/login`,
    logout: `${API_PREFIX}/logout`,
    refresh: `${API_PREFIX}/refresh`,
    user: `${API_PREFIX}/user`,
    item: `${API_PREFIX}/item`,
    // Add more as needed
};