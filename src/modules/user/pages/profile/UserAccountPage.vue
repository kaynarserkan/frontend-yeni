<template>
  <div class="ua-page">
    <ProfileSectionCard>
      <template #title>Roles & Permissions (Overview)</template>

      <template #actions>
        <v-btn variant="tonal" size="small" @click="refresh" :loading="loading">
          Refresh
        </v-btn>
      </template>

      <div class="ua-grid">
        <div class="ua-box">
          <div class="ua-box-title">Roles</div>
          <div class="ua-box-sub">User assigned roles</div>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-for="r in roles"
              :key="String(r?.name ?? r)"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ r?.name ?? r }}
            </v-chip>

            <div v-if="!roles.length" class="ua-muted">No roles</div>
          </div>
        </div>

        <div class="ua-box">
          <div class="ua-box-title">Direct Permissions</div>
          <div class="ua-box-sub">Permissions assigned directly to user</div>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-for="p in directPermissions"
              :key="String(p?.name ?? p)"
              size="small"
              color="secondary"
              variant="tonal"
            >
              {{ p?.name ?? p }}
            </v-chip>

            <div v-if="!directPermissions.length" class="ua-muted">
              No direct permissions
            </div>
          </div>
        </div>
      </div>

      <div class="ua-divider" />

      <div class="ua-box">
        <div class="ua-box-title">Effective Permissions</div>
        <div class="ua-box-sub">
          Union of (role permissions) + (direct permissions)
        </div>

        <div class="d-flex flex-wrap ga-2 mt-3">
          <v-chip
            v-for="p in effectivePermissions"
            :key="p"
            size="small"
            color="primary"
            variant="outlined"
          >
            {{ p }}
          </v-chip>

          <div v-if="!effectivePermissions.length" class="ua-muted">
            No effective permissions
          </div>
        </div>
      </div>
    </ProfileSectionCard>

    <ProfileSectionCard>
      <template #title>Departments</template>

      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="d in departments"
          :key="String(d?.id ?? d?.name ?? d)"
          size="small"
          variant="tonal"
        >
          {{ d?.name ?? d }}
        </v-chip>

        <div v-if="!departments.length" class="ua-muted">No departments</div>
      </div>
    </ProfileSectionCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/core/http/api.client";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard.vue";

defineOptions({ name: "UserAccountPage" });

const route = useRoute();

const loading = ref(false);
const user = ref<any | null>(null);

const userId = computed(() => String(route.params.id ?? ""));

const fetchUser = async () => {
  if (!userId.value) return;

  loading.value = true;
  try {
    const res = await api.get(`/user-service/users/${userId.value}`);
    user.value = res.data ?? null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUser();
});

const refresh = async () => {
  await fetchUser();
};

const roles = computed(() =>
  Array.isArray(user.value?.roles) ? user.value.roles : [],
);
const directPermissions = computed(() =>
  Array.isArray(user.value?.permissions) ? user.value.permissions : [],
);

const departments = computed(() =>
  Array.isArray(user.value?.departments) ? user.value.departments : [],
);

const effectivePermissions = computed<string[]>(() => {
  const set = new Set<string>();

  // direct permissions
  for (const p of directPermissions.value) {
    const name = String(p?.name ?? p ?? "").trim();
    if (name) set.add(name);
  }

  // role permissions (roles -> permissions[])
  for (const r of roles.value) {
    const perms = Array.isArray(r?.permissions) ? r.permissions : [];
    for (const p of perms) {
      const name = String(p?.name ?? p ?? "").trim();
      if (name) set.add(name);
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
});
</script>

<style scoped>
.ua-page {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.ua-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--crm-space-4);
}

@media (min-width: 960px) {
  .ua-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.ua-box {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
  padding: var(--crm-space-4);
}

.ua-box-title {
  font-size: var(--crm-text-md);
  font-weight: var(--crm-fw-bold);
}

.ua-box-sub {
  margin-top: 4px;
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-70);
}

.ua-muted {
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-70);
  padding: 6px 0;
}

.ua-divider {
  height: 1px;
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  margin: var(--crm-space-3) 0;
}
</style>
