<template>
  <div class="kb-card" :class="{ 'kb-card--selectable': selectable, 'kb-card--selected': selected }">
    <!-- ✅ Tek checkbox: hover’da çıkar, seçiliyse görünür -->
<button
      v-if="selectable"
      type="button"
      class="kb-card-select"
      :class="{ 'is-visible': selected }"
      @mousedown.stop
      @click.stop="emit('toggle-select')"
      aria-label="Select card"
    >
      <span class="kb-card-select-box" :class="{ 'is-checked': selected }" />
    </button>

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

/* seçili kart hissi */
.kb-card--selected {
  border-color: color-mix(in srgb, rgb(var(--v-theme-primary)) var(--crm-alpha-60), transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, rgb(var(--v-theme-primary)) var(--crm-alpha-35), transparent),
    0 var(--crm-shadow-y) calc(var(--crm-shadow-blur) * 0.8)
      color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

/* hover’da çıkan kutu */
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
  padding: 2px;

  border: 0;
  cursor: pointer;
}

.kb-card--selectable:hover .kb-card-select,
.kb-card-select.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.kb-card-select-box {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 4px;

  border: 2px solid color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-35), transparent);
  background: transparent;
}

.kb-card-select-box.is-checked {
  border-color: rgb(var(--v-theme-primary));
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
  box-shadow: inset 0 0 0 2px rgb(var(--v-theme-primary));
}
</style>

