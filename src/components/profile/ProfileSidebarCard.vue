<template>
  <v-card class="ps-card" variant="elevated">
    <div class="ps-card__top">
      <div class="ps-card__avatar">
        <slot name="avatar" />
      </div>

      <div class="ps-card__title">
        <slot name="title" />
      </div>

      <div class="ps-card__subtitle">
        <slot name="subtitle" />
      </div>
    </div>

    <div v-if="$slots.stats" class="ps-card__stats">
      <slot name="stats" />
    </div>

    <v-divider class="ps-card__divider" />

    <div class="ps-card__details">
      <slot name="details" />
    </div>

    <div v-if="$slots.actions" class="ps-card__actions">
      <slot name="actions" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineOptions({ name: "ProfileSidebarCard" });
</script>

<style scoped>
.ps-card {
  padding: var(--crm-space-6);
  border-radius: var(--crm-radius-1);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.ps-card__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--crm-space-3);
}

.ps-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ps-card__title {
  font-size: var(--crm-text-lg);
  font-weight: var(--crm-fw-bold);
  line-height: 1.2;
  text-align: center;
}

.ps-card__subtitle {
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-70);
}

.ps-card__stats {
  margin-top: var(--crm-space-5);
}

/* Divider daha “light” dursun */
.ps-card__divider {
  margin: var(--crm-space-5) 0;
  opacity: var(--crm-alpha-70);
}

/* Details alanı: satırlar biraz daha ferah */
.ps-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-3);
}

.ps-card__actions {
  margin-top: var(--crm-space-6);
  display: flex;
  gap: var(--crm-space-3);
  justify-content: center;
}
</style>
