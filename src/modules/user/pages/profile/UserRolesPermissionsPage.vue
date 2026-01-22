<template>
  <div class="ur-page">
    <ProfileSectionCard>
      <template #title>Roles &amp; Permissions</template>
      <div class="ur-lorem">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </ProfileSectionCard>
  </div>
</template>

<script setup lang="ts">
import ProfileSectionCard from "@/components/profile/ProfileSectionCard.vue";

defineOptions({ name: "UserRolesPermissionsPage" });
</script>

<style scoped>
.ur-page {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.ur-lorem {
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
  line-height: 1.6;
}
</style>
