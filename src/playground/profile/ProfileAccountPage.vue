<template>
  <div class="pg-page">
    <ProfileSectionCard>
      <template #title>Project List</template>

      <template #actions>
        <v-text-field
          density="compact"
          variant="outlined"
          hide-details
          placeholder="Search Project"
          prepend-inner-icon="mdi-magnify"
        />
      </template>

      <div class="pg-placeholder">
        Account içeriği (tablo vs.) burada olacak.
      </div>
    </ProfileSectionCard>

    <ProfileSectionCard>
      <template #title>User Activity Timeline</template>

      <div class="pg-placeholder">Timeline içeriği burada olacak.</div>
    </ProfileSectionCard>
  </div>
</template>

<script setup lang="ts">
import ProfileSectionCard from "@/components/profile/ProfileSectionCard.vue";

defineOptions({ name: "ProfileAccountPage" });
</script>

<style scoped>
.pg-page {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.pg-placeholder {
  padding: var(--crm-space-6);
  border-radius: var(--crm-radius-1);
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-85);
}
</style>
