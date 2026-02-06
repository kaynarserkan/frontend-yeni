<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { syncUserPermissions, type User } from "../services/user.api";
import {
  listPermissions,
  type Permission,
} from "@/modules/roles/services/permissions.api";
import { listRoles, type Role } from "@/modules/roles/services/role.api";

defineOptions({ name: "UserPermissionsPanel" });

const props = defineProps<{ user: User }>();
const emit = defineEmits<{ (e: "updated", u: User): void }>();

const all = ref<Permission[]>([]);
const loading = ref(false);

// sadece DIRECT permissions (role'dan gelenleri burada tutmuyoruz)
const selectedDirect = ref<string[]>([]);

// roles service'ten (permissions ile) gelen roller
const rolesWithPermissions = ref<Role[]>([]);

const directPermissionSet = computed(() => {
  const set = new Set<string>();
  const perms = Array.isArray(props.user?.permissions)
    ? props.user.permissions
    : [];
  for (const p of perms) {
    const name = String((p as any)?.name ?? p ?? "").trim();
    if (name) set.add(name);
  }
  return set;
});

const userRoleNames = computed<string[]>(() => {
  const roles = Array.isArray(props.user?.roles) ? props.user.roles : [];
  return roles.map((r: any) => String(r?.name ?? "").trim()).filter(Boolean);
});

// ✅ Role’dan gelen permission set’i artık user endpoint’inden değil,
// roles servisinden (permissions ile) hesaplıyoruz.
const rolePermissionSet = computed(() => {
  const set = new Set<string>();
  const roleNames = new Set(userRoleNames.value);

  for (const r of rolesWithPermissions.value) {
    const rname = String((r as any)?.name ?? "").trim();
    if (!rname || !roleNames.has(rname)) continue;

    const perms = Array.isArray((r as any)?.permissions)
      ? (r as any).permissions
      : [];

    for (const p of perms) {
      const name = String((p as any)?.name ?? p ?? "").trim();
      if (name) set.add(name);
    }
  }

  return set;
});

const isFromRole = (name: string) => rolePermissionSet.value.has(name);
const isDirectSelected = (name: string) => selectedDirect.value.includes(name);

// UI'da checkbox checked mi? (role + direct birleşimi)
const isChecked = (name: string) => isFromRole(name) || isDirectSelected(name);

// name -> group key (lead.view => lead)
const groupKeyOf = (name: string) => {
  const s = String(name ?? "").trim();
  if (!s) return "other";
  const idx = s.indexOf(".");
  return idx > 0 ? s.slice(0, idx) : "other";
};

const grouped = computed(() => {
  const map = new Map<string, Permission[]>();

  for (const p of all.value) {
    const name = String(p?.name ?? "").trim();
    const g = groupKeyOf(name);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(p);
  }

  const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  return keys.map((k) => {
    const items = (map.get(k) ?? [])
      .slice()
      .sort((a, b) => String(a.name ?? "").localeCompare(String(b.name ?? "")));
    return { key: k, items, count: items.length };
  });
});

const load = async () => {
  loading.value = true;
  try {
    // 1) tüm permission listesi (checkbox’lar)
    all.value = await listPermissions();

    // 2) role listesi (permissions ile) → role’dan gelenleri disable etmek için şart
    // Not: listRoles endpoint’in role.permissions döndürmesi gerekiyor
    rolesWithPermissions.value = await listRoles();

    // 3) direct permissions başlangıç (user endpoint’inden gelir)
    selectedDirect.value = Array.from(directPermissionSet.value);
  } finally {
    loading.value = false;
  }
};

const toggleDirect = (name: string, next: boolean) => {
  if (!name) return;

  // role'dan geliyorsa pasif: değiştirme
  if (isFromRole(name)) return;

  const has = selectedDirect.value.includes(name);
  if (next && !has) selectedDirect.value = [...selectedDirect.value, name];
  if (!next && has)
    selectedDirect.value = selectedDirect.value.filter((x) => x !== name);
};

const onSave = async () => {
  loading.value = true;
  try {
    // backend'e sadece DIRECT listesi gitsin
    const payload = Array.from(
      new Set(
        (selectedDirect.value ?? [])
          .map((s) => String(s ?? "").trim())
          .filter(Boolean),
      ),
    );

    const u = await syncUserPermissions(props.user.id, payload);
    emit("updated", u);
  } finally {
    loading.value = false;
  }
};

onMounted(load);

// user değişince (ör: role sync sonrası) role set + direct set doğru kalsın
watch(
  () => props.user?.id,
  () => {
    selectedDirect.value = Array.from(directPermissionSet.value);
  },
);

watch(
  () => props.user?.roles,
  () => {
    // role değiştiyse rolePermissionSet computed otomatik güncellenir,
    // ama direct set’i de user payload’ına göre tutarlı tutalım
    selectedDirect.value = Array.from(directPermissionSet.value);
  },
  { deep: true },
);

watch(
  () => props.user?.permissions,
  () => {
    selectedDirect.value = Array.from(directPermissionSet.value);
  },
  { deep: true },
);
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="d-flex align-center justify-space-between ga-3 mb-3">
      <div>
        <div class="text-subtitle-1 font-weight-bold">Direct Permissions</div>
        <div class="text-caption opacity-70">
          Role ile gelen yetkiler aktif ama pasif (değiştirilemez) gösterilir.
        </div>
      </div>

      <v-btn color="primary" :loading="loading" @click="onSave">
        Save permissions
      </v-btn>
    </div>

    <div v-if="loading" class="py-2">
      <v-progress-linear indeterminate color="primary" />
    </div>

    <div v-else class="perm-groups">
      <div v-for="g in grouped" :key="g.key" class="perm-group">
        <div class="perm-group__head">
          <div class="perm-group__title">{{ g.key }}</div>
          <div class="perm-group__count">{{ g.count }}</div>
        </div>

        <div class="perm-group__grid">
          <div v-for="p in g.items" :key="p.id" class="perm-item">
            <v-checkbox
              :model-value="isChecked(String(p.name ?? ''))"
              @update:model-value="
                (v: boolean | null) => toggleDirect(String(p.name ?? ''), !!v)
              "
              :label="p.name"
              density="compact"
              hide-details
              :disabled="isFromRole(String(p.name ?? ''))"
            />

            <div
              v-if="isFromRole(String(p.name ?? ''))"
              class="perm-item__hint"
            >
              role üzerinden
            </div>
          </div>
        </div>
      </div>

      <div v-if="!grouped.length" class="text-caption opacity-70 py-3">
        Permission bulunamadı.
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.perm-groups {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.perm-group {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  border-radius: 10px;
  overflow: hidden;
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-04));
}

.perm-group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.perm-group__title {
  font-weight: var(--crm-fw-xbold);
  text-transform: lowercase;
}

.perm-group__count {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-70);
}

.perm-group__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  padding: 10px 14px 14px;
}

@media (min-width: 900px) {
  .perm-group__grid {
    grid-template-columns: 1fr 1fr;
    column-gap: 18px;
  }
}

.perm-item {
  position: relative;
  padding: 2px 0;
}

.perm-item__hint {
  margin-left: 36px;
  margin-top: -4px;
  font-size: 11px;
  opacity: var(--crm-alpha-60);
}
</style>
