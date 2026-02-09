const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export const getAccessToken = (): string => {
  return localStorage.getItem(TOKEN_KEY) ?? "";
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getAuthUser = <T = any>(): T | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setAuthUser = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user ?? null));
  } catch {
    // ignore
  }
};

export const clearAuthUser = (): void => {
  localStorage.removeItem(USER_KEY);
};
