<template>
  <v-container class="pp-shell" fluid>
    <v-row class="pp-shell__row" align="start">
      <v-col cols="12" md="4" lg="3" class="pp-shell__sidebar">
        <slot name="sidebar" />
      </v-col>

      <v-col cols="12" md="8" lg="9" class="pp-shell__main">
        <div v-if="$slots.tabs" class="pp-shell__tabs">
          <v-card class="pp-shell__tabs-card" variant="flat">
            <slot name="tabs" />
          </v-card>
        </div>

        <div class="pp-shell__content">
          <slot />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineOptions({ name: "ProfilePageShell" });
</script>

<style scoped>
.pp-shell {
  padding: var(--crm-space-6);
}

/* Sidebar / content hizası daha temiz */
.pp-shell__row {
  row-gap: var(--crm-space-4);
}

/* Tabs yüzeyi: hafif border + daha modern */
.pp-shell__tabs {
  margin-bottom: var(--crm-space-4);
}

.pp-shell__tabs-card {
  padding: var(--crm-space-2);
  border-radius: var(--crm-radius-1);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

/* Content arası boşluk Vuexy gibi */
.pp-shell__content {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}
</style>
