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
                {{ drawerOpen ? 'mdi-menu-open' : 'mdi-menu' }}
              </v-icon>
            </v-btn>

            <img
              src="/logo.png"
              alt="Pure CRM"
              class="crm-logo"
            />

            <nav class="d-none d-md-flex ga-5">
              <span class="crm-topnav active">Dashboard</span>
              <span class="crm-topnav">Leads</span>
              <span class="crm-topnav">Users</span>
              <span class="crm-topnav">Appointments</span>
            </nav>
          </div>

          <!-- SAĞ: Profil -->
          <div class="d-flex align-center ga-3">
            <span class="crm-muted d-none d-md-inline">Admin Panel</span>
            <v-avatar size="34" class="crm-avatar">
              <span class="crm-avatar-text">S</span>
            </v-avatar>
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
            {{ drawerOpen ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
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

    <!-- MAIN -->
    <v-main class="crm-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Sidebar sadece route'ta named-view "sidebar" varsa görünür
const hasSidebar = computed(() => {
  return route.matched.some(r => Boolean((r.components as any)?.sidebar))
})

const drawerOpen = ref(true)

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}
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
  border-bottom: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  box-shadow: 0 10px 30px color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
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
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-70), transparent);
}

.crm-topnav {
  font-size: var(--crm-text-sm);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-70), transparent);
  cursor: pointer;
  padding: var(--crm-space-2) 0;
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
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 10px 0 30px color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

.crm-rail-handle {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

.crm-sidebar {
  border-right: 1px solid rgba(6, 30, 41, 0.10);
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
  color: color-mix(in srgb, rgb(var(--v-theme-primary)) var(--crm-alpha-88), transparent);
}
</style>

