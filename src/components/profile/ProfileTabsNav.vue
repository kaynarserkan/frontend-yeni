<template>
  <v-tabs class="ptn-tabs" density="comfortable" color="primary" show-arrows>
    <v-tab v-for="t in tabs" :key="t.key" :to="t.to" exact>
      <v-icon v-if="t.icon" start :icon="t.icon" />
      {{ t.label }}
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineOptions({ name: "ProfileTabsNav" });

type ProfileTab = {
  key: string;
  label: string;
  to: RouteLocationRaw;
  icon?: string;
};

defineProps<{
  tabs: ProfileTab[];
}>();
</script>

<style scoped>
/* Tabs container: artık dış card (ProfilePageShell) yüzey veriyor */
.ptn-tabs {
  background: transparent;
  padding: 0;
}

/* Vuetify internal classes için deep kullanıyoruz */
.ptn-tabs :deep(.v-slide-group__content) {
  gap: var(--crm-space-2);
}

/* Her tab: pill görünümü */
.ptn-tabs :deep(.v-tab) {
  border-radius: var(--crm-radius-1);
  min-height: 40px;
  text-transform: none;
  letter-spacing: normal;
  font-weight: var(--crm-fw-medium);
  padding: 0 var(--crm-space-4);
  opacity: 1;
}

/* Seçili tab: dolu yüzey + daha net */
.ptn-tabs :deep(.v-tab--selected) {
  background: rgba(var(--v-theme-primary), var(--crm-alpha-12));
}

/* Seçili olmayan tab: hover ile hafif yüzey */
.ptn-tabs :deep(.v-tab:hover) {
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
}

/* Tab icon hizası */
.ptn-tabs :deep(.v-tab .v-icon) {
  opacity: var(--crm-alpha-85);
}
</style>
