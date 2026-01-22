<template>
  <div class="ua-page">
    <ProfileSectionCard>
      <template #title>Account</template>
      <div class="ua-lorem">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </ProfileSectionCard>
  </div>
</template>

<script setup lang="ts">
import ProfileSectionCard from "@/components/profile/ProfileSectionCard.vue";

defineOptions({ name: "UserAccountPage" });
</script>

<style scoped>
.ua-page {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.ua-lorem {
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
  line-height: 1.6;
}
</style>
