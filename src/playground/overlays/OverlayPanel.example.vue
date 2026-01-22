<template>
  <div class="ot-panel">
    <div class="ot-title">Overlay Test Panel</div>
    <div class="ot-sub">Sol / Sağ Offcanvas + Dialog test butonları</div>

    <div class="ot-actions">
      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="mdi-dock-left"
        @click="emit('open-left')"
      >
        Open Left
      </v-btn>

      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="mdi-dock-right"
        @click="emit('open-right')"
      >
        Open Right
      </v-btn>

      <v-btn
        size="small"
        color="primary"
        prepend-icon="mdi-open-in-new"
        @click="emit('open-dialog')"
      >
        Open Dialog
      </v-btn>

      <v-btn
        size="small"
        variant="text"
        prepend-icon="mdi-close-circle-outline"
        @click="emit('close-all')"
      >
        Close All
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "open-left"): void;
  (e: "open-right"): void;
  (e: "open-dialog"): void;
  (e: "close-all"): void;
}>();
</script>

<style scoped>
.ot-panel {
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

.ot-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ot-sub {
  margin-top: 4px;
  font-size: var(--crm-text-xs);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}

.ot-actions {
  margin-top: var(--crm-space-3);
  display: flex;
  flex-wrap: wrap;
  gap: var(--crm-space-2);
}
</style>
