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

  // ✅ bazı backendler: { data: ... }
  if (raw && typeof raw === "object" && "data" in raw) {
    raw = (raw as any).data;
  }

  // ✅ bazı backendler: { status, message, user: "..." } veya { user: {...} }
  if (raw && typeof raw === "object" && "user" in raw) {
    raw = (raw as any).user;
  }

  // ✅ string gelirse parse etmeyi dene
  if (typeof raw === "string") {
    const s = raw.trim();

    // JSON string ise parse
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        raw = JSON.parse(s);
      } catch {
        return null;
      }
    } else {
      // sadece id geldiyse (örn "12") → enrich edebilmek için id objesi üret
      if (/^\d+$/.test(s)) {
        return { id: Number(s) };
      }
      return null;
    }
  }

  // ✅ bazı yerlerde { user: {...} } nested gelebilir (2. kez)
  if (raw && typeof raw === "object" && "user" in raw) {
    raw = (raw as any).user;
  }

  return raw && typeof raw === "object" ? raw : null;
};

const hasNonEmptyRoles = (u: any): boolean => {
  const roles = (u as any)?.roles;
  return Array.isArray(roles) && roles.length > 0;
};

const rolesHavePermissionsLoaded = (u: any): boolean => {
  const user = normalizeUser(u);
  if (!user) return false;

  const roles = Array.isArray((user as any)?.roles) ? (user as any).roles : [];
  if (!roles.length) return false;

  // role.permissions array'ı yoksa (veya array değilse) → permissions yüklenmemiş demektir
  return roles.every((r: any) => Array.isArray(r?.permissions));
};

const normalizePermName = (v: any): string => {
  const s = String(v ?? "").trim();
  return s ? s.toLowerCase() : "";
};

const collectEffectivePermissions = (u: any): string[] => {
  const user = normalizeUser(u);
  if (!user) return [];

  const set = new Set<string>();

  // direct permissions: user.permissions
  const direct = Array.isArray((user as any)?.permissions)
    ? (user as any).permissions
    : [];
  for (const p of direct) {
    const name = normalizePermName((p as any)?.name ?? p);
    if (name) set.add(name);
  }

  // role permissions: user.roles[].permissions
  const roles = Array.isArray((user as any)?.roles) ? (user as any).roles : [];
  for (const r of roles) {
    const perms = Array.isArray((r as any)?.permissions)
      ? (r as any).permissions
      : [];
    for (const p of perms) {
      const name = normalizePermName((p as any)?.name ?? p);
      if (name) set.add(name);
    }
  }

  return Array.from(set);
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

    // ✅ effective permissions (direct + role permissions)
    effectivePermissions: (state): string[] => {
      return collectEffectivePermissions(state.user);
    },

    // ✅ permission helpers
    can:
      (state) =>
      (perm: string): boolean => {
        const want = normalizePermName(perm);
        if (!want) return false;
        const perms = collectEffectivePermissions(state.user);
        return perms.includes(want);
      },

    canAny:
      (state) =>
      (perms: string[]): boolean => {
        const list = Array.isArray(perms) ? perms : [];
        if (!list.length) return false;

        const have = new Set(collectEffectivePermissions(state.user));
        for (const p of list) {
          const want = normalizePermName(p);
          if (want && have.has(want)) return true;
        }
        return false;
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

    // ✅ User.roles var ama role.permissions yoksa -> /user-service/roles ile zenginleştir
    async enrichUserRolePermissions(user: any) {
      const u = normalizeUser(user);
      if (!u) return null;

      const roles = Array.isArray((u as any)?.roles) ? (u as any).roles : [];
      if (!roles.length) return u;

      // ✅ burada kullanıyoruz -> TS 6133 kalkar
      if (rolesHavePermissionsLoaded(u)) return u;

      try {
        const res = await api.get("/user-service/roles");
        const rows = (res as any)?.data?.data ?? (res as any)?.data ?? [];
        const allRoles = Array.isArray(rows) ? rows : [];

        const byId = new Map<number, any>();
        const byName = new Map<string, any>();

        for (const r of allRoles) {
          const id = Number((r as any)?.id ?? 0);
          if (id) byId.set(id, r);

          const name = String((r as any)?.name ?? "")
            .trim()
            .toLowerCase();
          if (name) byName.set(name, r);
        }

        const mergedRoles = roles.map((r: any) => {
          if (Array.isArray(r?.permissions)) return r;

          const rid = Number(r?.id ?? 0);
          const rname = String(r?.name ?? "")
            .trim()
            .toLowerCase();

          const full =
            (rid && byId.get(rid)) || (rname && byName.get(rname)) || null;

          if (full && Array.isArray((full as any)?.permissions)) {
            return { ...r, permissions: (full as any).permissions };
          }

          // deterministik olsun
          return { ...r, permissions: [] };
        });

        return { ...u, roles: mergedRoles };
      } catch {
        return u;
      }
    },

    // ✅ Token varsa "me" endpoint'inden user'ı çekip store+storage'a yazar
    // ✅ Eğer me response'unda roles yoksa: /user-service/users/{id} ile zenginleştirir
    // ✅ roles var ama role.permissions yoksa: /user-service/roles ile zenginleştirir
    async fetchMe() {
      if (!this.accessToken) return;

      const existing = normalizeUser(this.user);

      // ✅ roles+permissions zaten tam ise çık
      if (
        existing &&
        hasNonEmptyRoles(existing) &&
        rolesHavePermissionsLoaded(existing)
      ) {
        return;
      }

      const endpoints = [
        "/auth-service/me",
        "/auth/me",
        "/me",
        "/user-service/me",
        "/user-service/auth/me",
      ];

      for (const url of endpoints) {
        try {
          const res = await api.get(url);
          const baseUser = normalizeUser(res?.data?.user ?? res?.data);

          if (baseUser && typeof baseUser === "object") {
            // roles yoksa: user-service'den full user çek
            if (!hasNonEmptyRoles(baseUser) && (baseUser as any)?.id) {
              try {
                const resFull = await api.get(
                  `/user-service/users/${(baseUser as any).id}`,
                );
                const fullUser = normalizeUser(resFull?.data);

                if (fullUser) {
                  const enriched =
                    await this.enrichUserRolePermissions(fullUser);
                  this.setUser(enriched ?? fullUser);
                  return;
                }
              } catch {
                // ignore
              }
            }

            // roles var ama permissions eksik olabilir -> enrich dene
            const enriched = await this.enrichUserRolePermissions(baseUser);
            this.setUser(enriched ?? baseUser);
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
        const enriched = await this.enrichUserRolePermissions(
          (payload as any).user,
        );
        this.setUser(enriched ?? (payload as any).user);
      } else {
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
