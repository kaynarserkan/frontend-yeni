<template>
  <ProfilePageShell>
    <template #sidebar>
      <ProfileSidebarCard>
        <template #avatar>
          <v-avatar size="88" color="primary" variant="flat">
            <span class="pg-avatar-text">{{ initials }}</span>
          </v-avatar>
        </template>

        <template #title>
          {{ demoUser.name }}
        </template>

        <template #subtitle>
          <v-chip size="small" variant="tonal" color="primary">
            {{ demoUser.role }}
          </v-chip>
        </template>

        <template #stats>
          <div class="pg-stats">
            <div class="pg-stat">
              <div class="pg-stat__value">{{ demoUser.stats.tasks }}</div>
              <div class="pg-stat__label">Task Done</div>
            </div>
            <div class="pg-stat">
              <div class="pg-stat__value">{{ demoUser.stats.projects }}</div>
              <div class="pg-stat__label">Project Done</div>
            </div>
          </div>
        </template>

        <template #details>
          <div class="pg-details-title">Details</div>
          <div class="pg-details">
            <div class="pg-kv">
              <span class="pg-kv__k">Username:</span>
              <span class="pg-kv__v">{{ demoUser.username }}</span>
            </div>
            <div class="pg-kv">
              <span class="pg-kv__k">Email:</span>
              <span class="pg-kv__v">{{ demoUser.email }}</span>
            </div>
            <div class="pg-kv">
              <span class="pg-kv__k">Status:</span>
              <span class="pg-kv__v">{{ demoUser.status }}</span>
            </div>
            <div class="pg-kv">
              <span class="pg-kv__k">Role:</span>
              <span class="pg-kv__v">{{ demoUser.role }}</span>
            </div>
          </div>
        </template>

        <template #actions>
          <v-btn color="primary" variant="flat">Edit</v-btn>
          <v-btn color="error" variant="tonal">Suspend</v-btn>
        </template>
      </ProfileSidebarCard>
    </template>

    <template #tabs>
      <ProfileTabsNav :tabs="tabs" />
    </template>

    <router-view />
  </ProfilePageShell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ProfilePageShell from "@/components/profile/ProfilePageShell.vue";
import ProfileSidebarCard from "@/components/profile/ProfileSidebarCard.vue";
import ProfileTabsNav from "@/components/profile/ProfileTabsNav.vue";

defineOptions({ name: "ProfileLayout" });

const route = useRoute();

const demoUser = {
  id: "1",
  name: "Violet Mendoza",
  role: "Author",
  username: "@violet.dev",
  email: "vafgt@vultukir.org",
  status: "Active",
  stats: {
    tasks: "1.23k",
    projects: "568",
  },
};

const initials = computed(() => {
  const parts = demoUser.name.trim().split(/\s+/g);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return `${a}${b}`.toUpperCase();
});

const tabs = computed(() => {
  const id = (route.params.id ?? demoUser.id).toString();

  return [
    {
      key: "account",
      label: "Account",
      icon: "mdi-account-outline",
      to: { name: "playground-profile-account", params: { id } },
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "mdi-bell-outline",
      to: { name: "playground-profile-notifications", params: { id } },
    },
  ];
});
</script>

<style scoped>
.pg-avatar-text {
  font-size: var(--crm-text-xl);
  font-weight: var(--crm-fw-bold);
  color: rgb(var(--v-theme-on-primary));
}

.pg-tabs {
  background: rgb(var(--v-theme-surface));
  border-radius: var(--crm-radius-1);
  padding: var(--crm-space-2);
}

.pg-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--crm-space-3);
}

.pg-stat {
  padding: var(--crm-space-3);
  border-radius: var(--crm-radius-1);
  background: rgba(var(--v-theme-primary), var(--crm-alpha-12));
  text-align: center;
}

.pg-stat__value {
  font-size: var(--crm-text-lg);
  font-weight: var(--crm-fw-bold);
  line-height: 1.1;
}

.pg-stat__label {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-70);
}

.pg-details-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-bold);
  margin-bottom: var(--crm-space-2);
}

.pg-details {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
}

.pg-kv {
  display: flex;
  gap: var(--crm-space-2);
  font-size: var(--crm-text-sm);
}

.pg-kv__k {
  opacity: var(--crm-alpha-70);
}

.pg-kv__v {
  font-weight: var(--crm-fw-medium);
}
</style>
