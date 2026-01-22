<template>
  <v-card class="psc-card" variant="elevated">
    <div class="psc-card__head">
      <div class="psc-card__title">
        <slot name="title" />
      </div>

      <div v-if="$slots.actions" class="psc-card__actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="psc-card__body">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineOptions({ name: "ProfileSectionCard" });
</script>

<style scoped>
.psc-card {
  border-radius: var(--crm-radius-1);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  overflow: hidden;
}

/* Header satırı: ayrı bir şerit gibi */
.psc-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-4);
  padding: var(--crm-space-4) var(--crm-space-6);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.psc-card__title {
  font-size: var(--crm-text-md);
  font-weight: var(--crm-fw-bold);
}

.psc-card__actions {
  display: flex;
  align-items: center;
  gap: var(--crm-space-3);
}

/* Body padding header’dan ayrıldı */
.psc-card__body {
  padding: var(--crm-space-6);
}
</style>
