<template>
  <ProfilePageShell>
    <template #sidebar>
      <ProfileSidebarCard>
        <template #avatar>
          <v-avatar size="88" color="primary" variant="flat">
            <span class="up-initials">{{ initials }}</span>
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
          <div class="up-stats">
            <div class="up-stat">
              <div class="up-stat__value">1.23k</div>
              <div class="up-stat__label">Task Done</div>
            </div>
            <div class="up-stat">
              <div class="up-stat__value">568</div>
              <div class="up-stat__label">Project Done</div>
            </div>
          </div>
        </template>

        <template #details>
          <div class="up-details-title">Details</div>

          <div class="up-kv">
            <span class="up-kv__k">Email:</span>
            <span class="up-kv__v">{{ demoUser.email }}</span>
          </div>
          <div class="up-kv">
            <span class="up-kv__k">Phone:</span>
            <span class="up-kv__v">{{ demoUser.phone }}</span>
          </div>
          <div class="up-kv">
            <span class="up-kv__k">Department:</span>
            <span class="up-kv__v">{{ demoUser.department }}</span>
          </div>
          <div class="up-kv">
            <span class="up-kv__k">Status:</span>
            <span class="up-kv__v">{{ demoUser.status }}</span>
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

defineOptions({ name: "UserProfileLayout" });

const route = useRoute();

const demoUser = computed(() => {
  const id = (route.params.id ?? "1").toString();

  // şimdilik statik: backend bağlanınca burası api/store olacak
  if (id === "2") {
    return {
      id,
      name: "Eileen Ramos",
      role: "Manager",
      email: "eileen@reginamed.test",
      phone: "+90 555 222 33 44",
      department: "Sales",
      status: "inactive",
    };
  }

  if (id === "3") {
    return {
      id,
      name: "Owen Hughes",
      role: "Staff",
      email: "owen@reginamed.test",
      phone: "+90 555 333 44 55",
      department: "Support",
      status: "active",
    };
  }

  return {
    id,
    name: "Violet Mendoza",
    role: "Author",
    email: "vafgt@vultukir.org",
    phone: "+90 555 111 22 33",
    department: "Operations",
    status: "active",
  };
});

const initials = computed(() => {
  const n = (demoUser.value.name ?? "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/g);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return `${a}${b}`.toUpperCase() || "U";
});

const tabs = computed(() => {
  const id = (route.params.id ?? "1").toString();

  return [
    {
      key: "account",
      label: "Account",
      icon: "mdi-account-outline",
      to: { name: "users-profile-account", params: { id } },
    },
    {
      key: "roles",
      label: "Roles & Permissions",
      icon: "mdi-shield-account-outline",
      to: { name: "users-profile-roles", params: { id } },
    },
  ];
});
</script>

<style scoped>
.up-initials {
  font-size: var(--crm-text-xl);
  font-weight: var(--crm-fw-bold);
  color: rgb(var(--v-theme-on-primary));
}

.up-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--crm-space-3);
}

.up-stat {
  padding: var(--crm-space-3);
  border-radius: var(--crm-radius-1);
  background: rgba(var(--v-theme-primary), var(--crm-alpha-10));
  text-align: center;
}

.up-stat__value {
  font-size: var(--crm-text-lg);
  font-weight: var(--crm-fw-xbold);
  line-height: 1.1;
}

.up-stat__label {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-70);
}

.up-details-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  margin-bottom: var(--crm-space-2);
}

.up-kv {
  display: flex;
  gap: var(--crm-space-2);
  font-size: var(--crm-text-sm);
}

.up-kv__k {
  opacity: var(--crm-alpha-70);
}

.up-kv__v {
  font-weight: var(--crm-fw-medium);
}
</style>
