<template>
  <div class="ovx-page">
    <div class="ovx-head">
      <div>
        <h1 class="ovx-title">Overlay Examples</h1>
        <p class="ovx-sub">Playground: Sol/Sağ Offcanvas + Dialog demo</p>
      </div>
    </div>

    <OverlayTestPanel
      @open-left="leftOpen = true"
      @open-right="rightOpen = true"
      @open-dialog="dialogOpen = true"
      @close-all="closeAll"
    />

    <div class="ovx-content">
      <div class="ovx-card">
        <div class="ovx-card-title">Dummy Content</div>
        <div class="ovx-card-sub">
          Bu sayfa sadece overlay davranışlarını test etmek için. Sonra
          MasterLayout overlay sistemine bağlarız.
        </div>

        <div class="d-flex align-center ga-2 mt-3">
          <v-btn
            size="small"
            variant="tonal"
            prepend-icon="mdi-dock-left"
            @click="leftOpen = true"
          >
            Open Left
          </v-btn>
          <v-btn
            size="small"
            variant="tonal"
            prepend-icon="mdi-dock-right"
            @click="rightOpen = true"
          >
            Open Right
          </v-btn>
          <v-btn
            size="small"
            color="primary"
            prepend-icon="mdi-open-in-new"
            @click="dialogOpen = true"
          >
            Open Dialog
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            prepend-icon="mdi-close"
            @click="closeAll"
          >
            Close All
          </v-btn>
        </div>
      </div>
    </div>

    <!-- LEFT OFFCANVAS (demo) -->
    <v-navigation-drawer
      v-model="leftOpen"
      width="320"
      temporary
      location="left"
    >
      <div class="ovx-drawer-head">
        <div class="ovx-drawer-title">Left Offcanvas</div>
        <v-btn
          icon
          variant="text"
          @click="leftOpen = false"
          aria-label="Close left"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="ovx-drawer-body">
        <div class="ovx-muted">
          Buraya “Filters / Saved Views” gibi sayfa-özel içerikler gelecek.
        </div>
      </div>
    </v-navigation-drawer>

    <!-- RIGHT OFFCANVAS (demo) -->
    <v-navigation-drawer
      v-model="rightOpen"
      width="420"
      temporary
      location="right"
    >
      <div class="ovx-drawer-head">
        <div class="ovx-drawer-title">Right Offcanvas</div>
        <v-btn
          icon
          variant="text"
          @click="rightOpen = false"
          aria-label="Close right"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="ovx-drawer-body">
        <div class="ovx-muted">
          Buraya “Create/Edit Form” gibi içerikler gelecek (Servis ekle, User
          edit vs).
        </div>

        <v-text-field class="mt-4" label="Example field" hide-details />
        <v-textarea class="mt-3" label="Example notes" rows="3" hide-details />
        <div class="d-flex ga-2 mt-4">
          <v-btn color="primary" @click="rightOpen = false">Save</v-btn>
          <v-btn variant="tonal" @click="rightOpen = false">Cancel</v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- DIALOG (demo) -->
    <v-dialog v-model="dialogOpen" max-width="520">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-subtitle-1 font-weight-bold">Dialog Example</span>
          <v-btn
            icon
            variant="text"
            @click="dialogOpen = false"
            aria-label="Close dialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="ovx-muted">
            Bu bir popup/dialog örneği. Onay/uyarı veya küçük formlar için.
          </div>

          <v-text-field class="mt-4" label="Example input" hide-details />
        </v-card-text>

        <v-card-actions class="justify-end ga-2">
          <v-btn variant="tonal" @click="dialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" @click="dialogOpen = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OverlayTestPanel from "@/playground/overlays/OverlayPanel.example.vue";

const leftOpen = ref(false);
const rightOpen = ref(false);
const dialogOpen = ref(false);

const closeAll = () => {
  leftOpen.value = false;
  rightOpen.value = false;
  dialogOpen.value = false;
};
</script>

<style scoped>
.ovx-page {
  padding: var(--crm-space-4);
  height: calc(100vh - 64px);
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-3);
}

.ovx-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.ovx-title {
  font-size: 20px;
  font-weight: var(--crm-fw-xbold);
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.ovx-sub {
  margin: 6px 0 0;
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}

.ovx-content {
  flex: 1;
  min-height: 0;
}

.ovx-card {
  border: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  background: rgb(var(--v-theme-surface));
  border-radius: var(--crm-radius-sm, var(--crm-space-1));
  padding: var(--crm-space-4);
  box-shadow: 0 var(--crm-shadow-y) calc(var(--crm-shadow-blur) * 0.65)
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-10),
      transparent
    );
}

.ovx-card-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ovx-card-sub,
.ovx-muted {
  margin-top: 6px;
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-65),
    transparent
  );
}

.ovx-drawer-head {
  height: 56px;
  padding: 0 var(--crm-space-3);
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

.ovx-drawer-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ovx-drawer-body {
  padding: var(--crm-space-3);
}
</style>
