<template>
  <div class="ov-wrap">
    <div class="ov-title">{{ title }}</div>
    <div class="ov-text">
      {{ text }}
    </div>
    <div class="d-flex ga-2 mt-4">
      <v-btn variant="tonal" @click="onClose">Close</v-btn>
      <v-btn color="primary" @click="onAction">Action</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  text: string;
  onClose?: () => void;
  onAction?: () => void;
}>();

const onClose = () => props.onClose?.();
const onAction = () => props.onAction?.();
</script>

<style scoped>
.ov-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
}

.ov-title {
  font-size: 16px;
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ov-text {
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-75),
    transparent
  );
  line-height: 1.5;
}
</style>
