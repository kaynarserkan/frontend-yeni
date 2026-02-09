import { defineStore } from "pinia";
import { api } from "@/core/http/api.client";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  clearAuthUser,
  getAuthUser,
  setAuthUser,
} from "./auth.storage";

const normalizeUser = (raw: any): any | null => {
  if (!raw) return null;

  // string gelirse parse etmeyi dene
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // bazı backendler { data: user } döndürebilir
  if (raw && typeof raw === "object" && "data" in raw) {
    const d = (raw as any).data;
    if (d && typeof d === "object") raw = d;
  }

  // senin mevcut formatın: { user: {...} }
  if (raw && typeof raw === "object" && "user" in raw) {
    const u = (raw as any).user;
    if (u && typeof u === "object") raw = u;
  }

  return raw && typeof raw === "object" ? raw : null;
};

const hasNonEmptyRoles = (u: any): boolean => {
  const roles = (u as any)?.roles;
  return Array.isArray(roles) && roles.length > 0;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: getAccessToken(),
    user: normalizeUser(getAuthUser<any>()),
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.accessToken),

    displayName: (state) => {
      const u: any = normalizeUser(state.user);
      const n = (u?.name ?? u?.username ?? u?.email ?? "").toString().trim();
      return n || "User";
    },

    userInitial: (state): string => {
      const u: any = normalizeUser((state as any).user);
      const n = (u?.name ?? u?.username ?? u?.email ?? "").toString().trim();
      return n ? n.charAt(0).toUpperCase() : "U";
    },

    // basit admin check (role name'e göre)
    // backend’de rol isimleri TR/EN olabilir: "admin", "Administrator", "Yönetici" vb.
    isAdmin: (state) => {
      const u: any = normalizeUser(state.user);

      const roles = Array.isArray(u?.roles) ? u.roles : [];
      const names = roles
        .map((r: any) =>
          String(r?.name ?? r ?? "")
            .toLowerCase()
            .trim(),
        )
        .filter(Boolean);

      return (
        names.includes("admin") ||
        names.includes("administrator") ||
        names.includes("yönetici") ||
        names.includes("yonetici")
      );
    },
  },

  actions: {
    setToken(token: string) {
      this.accessToken = token;
      setAccessToken(token);
    },

    setUser(user: any) {
      const u = normalizeUser(user);
      this.user = u;
      setAuthUser(u);
    },

    // ✅ Token varsa "me" endpoint'inden user'ı çekip store+storage'a yazar
    // ✅ Eğer me response'unda roles yoksa: /user-service/users/{id} ile zenginleştirir
    async fetchMe() {
      if (!this.accessToken) return;

      // user var ama roles boşsa gene de enrich et
      const existing = normalizeUser(this.user);
      if (existing && hasNonEmptyRoles(existing)) return;

      // OpenAPI'de kesin olan endpoint:
      // /auth-service/me
      const endpoints = [
        "/auth-service/me",
        // olası alternatifler (boş geçersek bir şey kaybetmeyiz)
        "/auth/me",
        "/me",
        "/user-service/me",
        "/user-service/auth/me",
      ];

      for (const url of endpoints) {
        try {
          const res = await api.get(url);
          const baseUser = normalizeUser(res?.data);

          if (baseUser && typeof baseUser === "object") {
            // roles yoksa: user-service'den full user çek
            if (!hasNonEmptyRoles(baseUser) && (baseUser as any)?.id) {
              try {
                const resFull = await api.get(
                  `/user-service/users/${(baseUser as any).id}`,
                );
                const fullUser = normalizeUser(resFull?.data);
                if (fullUser) {
                  this.setUser(fullUser);
                  return;
                }
              } catch {
                // enrich başarısızsa base user ile devam
              }
            }

            this.setUser(baseUser);
            return;
          }
        } catch {
          // sıradaki endpoint'e geç
        }
      }
    },

    // login response’unda token+user birlikte geliyorsa tek yerden setlemek için
    async setAuth(payload: {
      token?: string;
      accessToken?: string;
      access_token?: string;
      user?: any;
    }) {
      const t = (
        payload?.token ??
        payload?.accessToken ??
        (payload as any)?.access_token ??
        ""
      ).toString();

      if (t) this.setToken(t);

      if (payload && "user" in payload) {
        this.setUser((payload as any).user);
      } else {
        // token var ama user yoksa: me'yi çek
        await this.fetchMe();
      }
    },

    logout() {
      this.accessToken = "";
      this.user = null;
      clearAccessToken();
      clearAuthUser();
    },
  },
});
