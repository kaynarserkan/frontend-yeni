<template>
  <div class="kb-card" :class="{ 'kb-card--selectable': selectable }">
    <!-- ✅ Zoho gibi: hover'da çıkan checkbox -->
    <div
      v-if="selectable"
      class="kb-card-select"
      :class="{ 'is-visible': selected }"
      @mousedown.stop
      @click.stop
    >
      <v-checkbox
        :model-value="selected"
        @update:model-value="emit('toggle-select')"
        density="compact"
        hide-details
      />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectable?: boolean
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-select'): void
}>()

// defaultlar (Vue template tarafında undefined olmasın)
void props
</script>

<style scoped>
.kb-card {
  width: 100%;
  position: relative;

  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 var(--crm-shadow-y) calc(var(--crm-shadow-blur) * 0.8)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);

  border-radius: var(--crm-radius-sm, var(--crm-space-1));
  padding: var(--crm-space-4);
}

/* ✅ Zoho: hover’da çıkan checkbox */
.kb-card-select {
  position: absolute;
  top: 8px;
  right: 8px;

  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;

  background: rgb(var(--v-theme-surface));
  border-radius: 6px;
  box-shadow: 0 2px 10px color-mix(in srgb, rgb(var(--v-theme-secondary)) 20%, transparent);
  padding: 2px 4px;
}

.kb-card--selectable:hover .kb-card-select,
.kb-card-select.is-visible {
  opacity: 1;
  pointer-events: auto;
}

/* checkbox boşluklarını küçült */
.kb-card-select :deep(.v-selection-control) {
  min-height: 0;
}
.kb-card-select :deep(.v-selection-control__wrapper),
.kb-card-select :deep(.v-selection-control__input) {
  width: 18px;
  height: 18px;
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
