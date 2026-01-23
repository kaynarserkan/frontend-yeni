<template>
  <div class="rp">
    <v-alert v-if="err" type="error" variant="tonal" class="mb-4">
      {{ err }}
    </v-alert>

    <v-text-field
      v-model="form.title"
      label="Role title"
      placeholder="Yönetici / Doktor / Sosyal Medya"
      variant="outlined"
      hide-details
      class="mb-2"
    />

    <div class="rp-hint mb-4">
      Name otomatik üretilecek: <strong>{{ form.name || "—" }}</strong>
    </div>

    <div class="rp-perm-head">
      <div class="rp-perm-title">Permissions</div>

      <v-text-field
        v-model="q"
        density="compact"
        variant="outlined"
        hide-details
        placeholder="Search permission..."
        prepend-inner-icon="mdi-magnify"
        class="rp-search"
      />
    </div>

    <div v-if="loading" class="py-2">
      <v-progress-linear indeterminate color="primary" />
    </div>

    <div v-else class="rp-groups">
      <div v-for="g in filteredGroups" :key="g.key" class="rp-group">
        <div class="rp-group-head">
          <div class="rp-group-title">{{ g.title }}</div>
          <div class="rp-group-count">{{ g.items.length }}</div>
        </div>

        <div class="rp-checks">
          <v-checkbox
            v-for="p in g.items"
            :key="p.name"
            v-model="selected"
            :label="p.name"
            :value="p.name"
            density="compact"
            hide-details
            class="rp-check"
          />
        </div>
      </div>

      <div v-if="!filteredGroups.length" class="rp-empty">
        No permissions found.
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="rp-actions">
      <v-btn variant="tonal" @click="onCancel">Cancel</v-btn>
      <v-btn color="primary" :loading="saving" @click="onSave"> Save </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import { listPermissions, type Permission } from "../services/permissions.api";
import {
  createRole,
  syncRolePermissions,
  updateRole,
  type Role,
} from "../services/role.api";

defineOptions({ name: "RoleUpsertPanel" });

const props = defineProps<{
  mode: "create" | "edit";
  side: "left" | "right";
  role?: Role | null;
  onSaved?: () => void;
}>();

const overlay = useLayoutOverlayStore();

const loading = ref(false);
const saving = ref(false);
const err = ref("");

const all = ref<Permission[]>([]);
const selected = ref<string[]>([]);
const q = ref("");

const form = ref({
  title: "",
  name: "",
});
const slugifyRoleName = (input: string) => {
  const s = (input ?? "").toString().trim().toLowerCase();

  // Türkçe karakterler → latin
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    i: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };

  const normalized = s
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("");

  // harf/rakam dışı → underscore, çoklu underscore sadeleştir
  return normalized
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
};

const closeSelf = () => {
  if (props.side === "left") overlay.closeLeft();
  else overlay.closeRight();
};

const normalizeGroupKey = (permissionName: string) => {
  const s = (permissionName ?? "").toString().trim();
  const idx = s.indexOf(".");
  return idx > 0 ? s.slice(0, idx) : "other";
};

type Group = { key: string; title: string; items: Permission[] };

const groups = computed<Group[]>(() => {
  const map = new Map<string, Permission[]>();

  for (const p of all.value) {
    const key = normalizeGroupKey(p.name);
    const arr = map.get(key) ?? [];
    arr.push(p);
    map.set(key, arr);
  }

  // stable sort: group name + permission name
  const out: Group[] = [];
  const keys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  for (const k of keys) {
    const items = (map.get(k) ?? [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    out.push({ key: k, title: k, items });
  }
  return out;
});

const filteredGroups = computed<Group[]>(() => {
  const query = (q.value ?? "").toString().trim().toLowerCase();
  if (!query) return groups.value;

  return groups.value
    .map((g) => {
      const items = g.items.filter((p) => p.name.toLowerCase().includes(query));
      return { ...g, items };
    })
    .filter((g) => g.items.length > 0);
});

const load = async () => {
  loading.value = true;
  err.value = "";
  try {
    all.value = await listPermissions();

    // init form
    form.value.title = props.role?.title ?? props.role?.name ?? "";
    form.value.name = props.role?.name ?? slugifyRoleName(form.value.title);

    // init selected
    selected.value = (props.role?.permissions ?? []).map((p) => p.name);
  } catch (e: any) {
    err.value =
      e?.response?.data?.message ?? e?.message ?? "Permissions load failed.";
  } finally {
    loading.value = false;
  }
};
watch(
  () => form.value.title,
  (v) => {
    const next = slugifyRoleName(v ?? "");
    form.value.name = next;
  },
  { immediate: true },
);

watch(
  () => props.role?.id,
  () => load(),
  { immediate: true },
);

const onCancel = () => {
  closeSelf();
};

const onSave = async () => {
  if (saving.value) return;

  const title = (form.value.title ?? "").toString().trim();
  if (!title) {
    err.value = "Role title is required.";
    return;
  }

  const name = slugifyRoleName(title);
  if (!name) {
    err.value = "Role name could not be generated.";
    return;
  }

  saving.value = true;
  err.value = "";

  try {
    let saved: Role;

    if (props.mode === "create") {
      saved = await createRole({ name, title });
    } else {
      const id = props.role?.id;
      if (!id) {
        err.value = "Role id missing.";
        return;
      }
      saved = await updateRole(id, { name, title });
    }

    const perms = Array.from(
      new Set((selected.value ?? []).map((s) => s.trim()).filter(Boolean)),
    );
    await syncRolePermissions(saved.id, perms);

    closeSelf();
    props.onSaved?.();
  } catch (e: any) {
    err.value = e?.response?.data?.message ?? e?.message ?? "Save failed.";
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.rp {
  display: flex;
  flex-direction: column;
}

.rp-perm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-3);
  margin-bottom: var(--crm-space-3);
}

.rp-perm-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
}

.rp-search {
  max-width: 260px;
}

.rp-groups {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-3);
}

.rp-group {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-03));
  padding: var(--crm-space-3);
}

.rp-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--crm-space-2);
}

.rp-group-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-bold);
  text-transform: none;
}

.rp-group-count {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-70);
}

.rp-checks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--crm-space-4);
}

.rp-check :deep(.v-label) {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-85);
}

.rp-empty {
  padding: var(--crm-space-4);
  text-align: center;
  opacity: var(--crm-alpha-70);
  font-size: var(--crm-text-sm);
}

.rp-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--crm-space-2);
}
</style>
