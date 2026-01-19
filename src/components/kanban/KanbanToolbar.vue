<template>
  <div class="kb-toolbar d-flex align-center justify-space-between">
    <div class="kb-left d-flex align-center ga-3">
      <slot name="left" />
    </div>

    <div class="kb-right d-flex align-center ga-3">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
// slot-only shell (Zoho benzeri üst bar)
</script>

<style scoped>
.kb-toolbar {
  gap: var(--crm-space-4);
  margin-bottom: var(--crm-space-4);
}

.kb-toolbar :deep(.v-btn) {
  height: var(--crm-control-h);
  font-weight: var(--crm-fw-medium);
}

.kb-toolbar :deep(.v-icon) {
  color: currentColor;
}

.kb-toolbar :deep(.kb-muted) {
  font-size: var(--crm-text-sm);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-60), transparent);
}
</style>
