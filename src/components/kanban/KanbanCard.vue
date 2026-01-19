<template>
  <div class="kb-card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// sadece görünüm kabuğu
</script>

<style scoped>
.kb-card {
  width: 100%;

  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 var(--crm-shadow-y) calc(var(--crm-shadow-blur) * 0.8)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);

  /* ✅ Zoho gibi hafif radius */
  border-radius: var(--crm-radius-sm, var(--crm-space-1));

  padding: var(--crm-space-4);
}

/* Kart içindeki icon button’lar: hizalama/ölçü standardı */
.kb-card :deep(.v-btn--icon) {
  width: 32px;
  height: 32px;
  min-width: 32px;
}

.kb-card :deep(.v-btn--icon .v-icon) {
  line-height: 1;
}
</style>

