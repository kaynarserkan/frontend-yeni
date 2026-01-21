<template>
  <div class="kb-col">
    <div class="kb-col-head">
      <div class="d-flex align-center justify-space-between">
        <div class="kb-col-title">
          <span>{{ title }}</span>
          <span class="kb-count">{{ count }}</span>
        </div>

        <slot name="actions" />
      </div>
    </div>

    <div class="kb-col-body">
      <slot />
      <div v-if="$slots.footer" class="kb-col-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  title: string
  count: number
}>()
</script>
<style scoped>
/* Bu component şu an kullanılmıyor (bkz script notu).
   Stil karmaşası yaratmamak için minimum tutuldu. */

.kb-col {
  width: 320px;
  flex: 0 0 320px;
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 var(--crm-shadow-y) var(--crm-shadow-blur)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  display: flex;
  flex-direction: column;
}

.kb-col-head {
  padding: var(--crm-space-4);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 10%, rgb(var(--v-theme-surface)));
  border-bottom: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

.kb-col-title {
  display: flex;
  align-items: center;
  gap: var(--crm-space-2);
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.kb-count {
  padding: 2px 8px;
  font-size: var(--crm-text-xs);
  font-weight: var(--crm-fw-bold);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
  color: rgb(var(--v-theme-primary));
}

.kb-col-body {
  flex: 1;
  min-height: 0;
}
</style>
