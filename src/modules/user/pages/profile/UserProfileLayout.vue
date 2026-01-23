<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ProfilePageShell from "@/components/profile/ProfilePageShell.vue";
import ProfileSidebarCard from "@/components/profile/ProfileSidebarCard.vue";
import ProfileTabsNav from "@/components/profile/ProfileTabsNav.vue";
import { getUser, type User } from "../../services/user.api";

const route = useRoute();
const user = computed<User | null>(() => route.meta.user as User | null);

const tabs = computed(() => {
  const id = route.params.id;
  return [
    {
      key: "overview",
      label: "Genel Bakış",
      icon: "mdi-shield-account",
      to: { name: "user-profile-roles", params: { id } },
    },
    {
      key: "effective",
      label: "Effective Permissions",
      icon: "mdi-shield-check-outline",
      to: { name: "user-profile-effective", params: { id } },
    },
  ];
});
</script>

<template>
  <ProfilePageShell>
    <template #sidebar>
      <ProfileSidebarCard v-if="user">
        <template #title>
          {{ user.name }}
        </template>

        <template #subtitle>
          {{ user.email }}
        </template>
      </ProfileSidebarCard>
    </template>

    <template #tabs>
      <ProfileTabsNav :tabs="tabs" />
    </template>

    <router-view />
  </ProfilePageShell>
</template>
