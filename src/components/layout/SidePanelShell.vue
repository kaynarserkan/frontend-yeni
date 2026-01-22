<template>
  <div class="sp-shell">
    <!-- Header -->
    <div class="sp-head">
      <div class="sp-head-main">
        <slot name="title" />
      </div>

      <div class="sp-head-append">
        <slot name="title-append" />
      </div>
    </div>

    <!-- Body (scroll) -->
    <div class="sp-body">
      <slot name="body" />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="sp-foot">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SidePanelShell
 * - MasterLayout içindeki v-navigation-drawer içinde kullanılmak üzere
 * - Title / Title append / Body(scroll) / Footer slot’ları sağlar
 */
</script>

<style scoped>
.sp-shell {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* header sabit */
.sp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-3);
  padding: var(--crm-space-4);
  border-bottom: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
}

.sp-head-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--crm-space-2);
}

.sp-head-append {
  display: flex;
  align-items: center;
  gap: var(--crm-space-2);
}

/* body scroll */
.sp-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--crm-space-4);
}

/* footer sabit */
.sp-foot {
  padding: var(--crm-space-4);
  border-top: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  background: rgb(var(--v-theme-surface));
}
</style>
