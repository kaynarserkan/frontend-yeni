<template>
  <v-app class="crm-app">
    <!-- TOP HEADER -->
    <v-app-bar height="64" class="crm-topbar" color="surface" flat>
      <div class="crm-header-inner">
        <div class="d-flex align-center justify-space-between w-100">
          <!-- SOL: Sidebar toggle (sadece sidebar varsa) + Logo + Top menu -->
          <div class="d-flex align-center ga-4">
            <v-btn
              v-if="hasSidebar"
              icon
              variant="text"
              class="crm-icon-btn"
              @click="toggleDrawer"
              :aria-label="drawerOpen ? 'Close panel' : 'Open panel'"
            >
              <v-icon>
                {{ drawerOpen ? "mdi-menu-open" : "mdi-menu" }}
              </v-icon>
            </v-btn>

            <img src="/logo.png" alt="Pure CRM" class="crm-logo" />
            <nav class="d-none d-md-flex ga-5">
              <RouterLink
                :to="{ name: 'dashboard' }"
                class="crm-topnav"
                :class="{ active: isTopActive('dashboard') }"
              >
                Dashboard
              </RouterLink>

              <v-menu
                v-if="canSeeAdministration"
                location="bottom start"
                offset="6"
              >
                <template #activator="{ props: menuProps }">
                  <v-btn
                    v-bind="menuProps"
                    variant="text"
                    class="crm-topnav crm-topnav-btn"
                    :class="{ active: isAdminActive() }"
                  >
                    Administration
                    <v-icon end size="18">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list density="comfortable" min-width="240">
                  <v-list-item
                    v-if="canDepartmentsRead"
                    :to="{ name: 'departments-list' }"
                    title="Departments"
                    subtitle="Organization structure"
                  />
                  <v-list-item
                    v-if="canRolesRead"
                    :to="{ name: 'roles-list' }"
                    title="Roles & Permissions"
                    subtitle="Access control"
                  />
                  <v-list-item
                    v-if="canUsersRead"
                    :to="{ name: 'users-list' }"
                    title="Users"
                    subtitle="User management"
                  />
                </v-list>
              </v-menu>
            </nav>
          </div>

          <!-- SAĞ: Profil -->
          <div class="d-flex align-center ga-3">
            <v-menu location="bottom end" offset="8">
              <template #activator="{ props: menuProps }">
                <div v-bind="menuProps" class="crm-user-activator">
                  <span class="crm-muted d-none d-md-inline">Admin Panel</span>
                  <v-avatar size="34" class="crm-avatar">
                    <span class="crm-avatar-text">{{ userInitial }}</span>
                  </v-avatar>
                </div>
              </template>

              <v-list density="comfortable" min-width="220">
                <v-list-item
                  :title="username"
                  subtitle="Kullanıcı adı"
                  prepend-icon="mdi-account"
                />
                <v-divider />
                <v-list-item
                  title="Log out"
                  prepend-icon="mdi-logout"
                  @click="onLogout"
                />
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </v-app-bar>

    <!-- LEFT: PAGE-SPECIFIC SIDEBAR (Named View: sidebar) -->
    <v-navigation-drawer
      v-if="hasSidebar"
      v-model="drawerOpen"
      :rail="!drawerOpen"
      :rail-width="64"
      width="320"
      permanent
      class="crm-sidebar"
    >
      <!-- Rail handle -->
      <div class="crm-rail-handle">
        <v-btn
          icon
          variant="text"
          class="crm-icon-btn"
          @click="toggleDrawer"
          :aria-label="drawerOpen ? 'Close panel' : 'Open panel'"
        >
          <v-icon>
            {{ drawerOpen ? "mdi-chevron-left" : "mdi-chevron-right" }}
          </v-icon>
        </v-btn>
      </div>

      <!-- Sidebar content from route named view -->
      <div v-if="drawerOpen" class="crm-sidebar-body">
        <router-view name="sidebar" />
      </div>

      <!-- Rail mode (isteğe bağlı mini ikonlar) -->
      <div v-else class="crm-rail">
        <v-btn icon variant="text" class="crm-rail-btn">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
        <v-btn icon variant="text" class="crm-rail-btn">
          <v-icon>mdi-bookmark-outline</v-icon>
        </v-btn>
        <v-btn icon variant="text" class="crm-rail-btn">
          <v-icon>mdi-tune-variant</v-icon>
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- ✅ GLOBAL OVERLAYS (Left/Right Off-canvas + Dialog) -->
    <v-navigation-drawer
      v-model="overlay.left.open"
      location="left"
      temporary
      width="420"
      class="crm-offcanvas"
    >
      <div class="crm-offcanvas-head">
        <div class="crm-offcanvas-title">
          {{ overlay.left.title ?? "Panel" }}
        </div>
        <v-btn
          icon
          variant="text"
          class="crm-icon-btn"
          @click="overlay.closeLeft()"
          aria-label="Close left panel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="crm-offcanvas-body">
        <component
          :is="overlay.left.component"
          :key="overlay.left.key"
          v-bind="overlay.left.props"
        />
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="overlay.right.open"
      location="right"
      temporary
      width="420"
      class="crm-offcanvas"
    >
      <div class="crm-offcanvas-head">
        <div class="crm-offcanvas-title">
          {{ overlay.right.title ?? "Panel" }}
        </div>
        <v-btn
          icon
          variant="text"
          class="crm-icon-btn"
          @click="overlay.closeRight()"
          aria-label="Close right panel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="crm-offcanvas-body">
        <component
          :is="overlay.right.component"
          :key="overlay.right.key"
          v-bind="overlay.right.props"
        />
      </div>
    </v-navigation-drawer>

    <v-dialog v-model="overlay.dialog.open" max-width="760">
      <v-card>
        <div class="crm-dialog-head">
          <div class="crm-dialog-title">
            {{ overlay.dialog.title ?? "Dialog" }}
          </div>
          <v-btn
            icon
            variant="text"
            class="crm-icon-btn"
            @click="overlay.closeDialog()"
            aria-label="Close dialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="crm-dialog-body">
          <component
            :is="overlay.dialog.component"
            :key="overlay.dialog.key"
            v-bind="overlay.dialog.props"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- MAIN -->
    <v-main class="crm-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import { useAuthStore } from "@/core/auth/auth.store";

const overlay = useLayoutOverlayStore();
const auth = useAuthStore();

const route = useRoute();
const router = useRouter();

// Sidebar sadece route'ta named-view "sidebar" varsa görünür
const hasSidebar = computed(() => {
  return route.matched.some((r) => Boolean((r.components as any)?.sidebar));
});

const drawerOpen = ref(true);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

// Top menü active helper
const isTopActive = (key: "dashboard") => {
  const name = (route.name ?? "").toString();
  if (key === "dashboard") return name === "dashboard";
  return false;
};

// Administration dropdown active helper
const isAdminActive = () => {
  const name = (route.name ?? "").toString();
  return (
    name === "departments-list" ||
    name === "roles-list" ||
    name === "users-list" ||
    name.startsWith("users-")
  );
};
// Right user menu (reactive)
const username = computed(() => auth.displayName);
const userInitial = computed(() => auth.userInitial);

// ✅ Menü görünürlüğü: admin rolü değil, read permission bazlı
const canDepartmentsRead = computed(() =>
  auth.canAny(["department.read", "departments.read"]),
);

const canRolesRead = computed(() => auth.canAny(["role.read", "roles.read"]));

const canUsersRead = computed(() => auth.canAny(["user.read", "users.read"]));

const canSeeAdministration = computed(
  () => canDepartmentsRead.value || canRolesRead.value || canUsersRead.value,
);

// ✅ token var ama user yoksa: açılışta me'yi çek
onMounted(async () => {
  // ✅ token var ama (user yoksa) veya (user var ama roles gelmemişse): me + user detail ile zenginleştir
  const roles =
    auth.user && Array.isArray((auth.user as any)?.roles)
      ? (auth.user as any).roles
      : [];

  if (auth.isLoggedIn && (!auth.user || roles.length === 0)) {
    await auth.fetchMe();
  }
});

const onLogout = async () => {
  // Auth store varsa logout çağırmayı dener, yoksa login'e yönlendirir.
  try {
    const mod: any = await import("@/core/auth/auth.store");
    const auth = mod?.useAuthStore?.();
    if (typeof auth?.logout === "function") {
      await auth.logout();
    }
  } catch {
    // ignore
  } finally {
    router.push({ name: "login" });
  }
};
</script>

<style scoped>
/* Genel: radius yok */
.crm-app :deep(.v-card),
.crm-app :deep(.v-field),
.crm-app :deep(.v-btn) {
  border-radius: 0 !important;
}

.crm-main {
  background: rgb(var(--v-theme-background));
}

/* TOPBAR */
.crm-topbar {
  border-bottom: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  box-shadow: 0 10px 30px
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.crm-header-inner {
  width: 100%;
  padding: 0 var(--crm-space-6);
}

.crm-logo {
  height: 28px;
  display: block;
}

.crm-icon-btn {
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
}

.crm-topnav {
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
  cursor: pointer;
  padding: var(--crm-space-2) 0;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

/* v-btn activator da aynı topnav görünümünü alsın */
.crm-topnav-btn :deep(.v-btn__content) {
  gap: 6px;
}

/* Right user activator */
.crm-user-activator {
  display: inline-flex;
  align-items: center;
  gap: var(--crm-space-3);
  cursor: pointer;
}

.crm-topnav.active {
  color: rgb(var(--v-theme-primary));
  font-weight: var(--crm-fw-bold);
  border-bottom: 2px solid rgb(var(--v-theme-primary));
}

.crm-avatar {
  background: rgb(var(--v-theme-primary));
}

.crm-avatar-text {
  color: rgb(var(--v-theme-on-primary));
  font-weight: var(--crm-fw-bold);
}

/* SIDEBAR (page-specific) */
.crm-sidebar {
  border-right: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  background: rgb(var(--v-theme-surface));
  box-shadow: 10px 0 30px
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.crm-rail-handle {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.crm-sidebar {
  border-right: 1px solid rgba(6, 30, 41, 0.1);
  background: #ffffff;
  box-shadow: 10px 0 30px rgba(6, 30, 41, 0.06);
}

/* ✅ Sidebar scrollbar sadece en dış sınırda olsun (double scroll fix) */
.crm-sidebar :deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  overflow-x: hidden;
}

.crm-rail {
  padding-top: var(--crm-space-2);
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
  align-items: center;
}

.crm-rail-btn {
  width: 44px;
  height: 44px;
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-primary)) var(--crm-alpha-88),
    transparent
  );
}

/* ✅ Off-canvas (global) */
.crm-offcanvas {
  background: rgb(var(--v-theme-surface));
}

.crm-offcanvas-head {
  height: 56px;
  padding: 0 var(--crm-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.crm-offcanvas-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.crm-offcanvas-body {
  padding: var(--crm-space-4);
}

/* ✅ Dialog (global) */
.crm-dialog-head {
  height: 56px;
  padding: 0 var(--crm-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.crm-dialog-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.crm-dialog-body {
  padding: var(--crm-space-4);
}
</style>
