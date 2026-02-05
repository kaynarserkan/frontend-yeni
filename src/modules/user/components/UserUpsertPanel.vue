<template>
  <div class="up">
    <div ref="topRef" />

    <v-alert v-if="err" type="error" variant="tonal" class="mb-4 up-error">
      {{ err }}
    </v-alert>

    <v-text-field
      v-model="form.name"
      label="Name"
      placeholder="Ad Soyad"
      variant="outlined"
      hide-details
      class="mb-3"
    />

    <v-text-field
      v-model="form.email"
      label="Email"
      placeholder="user@reginamed.com"
      variant="outlined"
      hide-details
      class="mb-3"
    />

    <v-text-field
      v-model="form.password"
      :label="mode === 'create' ? 'Password' : 'New Password (optional)'"
      :placeholder="mode === 'create' ? 'Minimum 8 karakter' : 'Boş bırak: değişmez'"
      type="password"
      variant="outlined"
      hide-details
      class="mb-4"
    />

    <div class="up-roles-head">
      <div class="up-roles-title">Roles</div>

      <v-text-field
        v-model="q"
        density="compact"
        variant="outlined"
        hide-details
        placeholder="Search role..."
        prepend-inner-icon="mdi-magnify"
        class="up-search"
      />
    </div>

    <div v-if="loading" class="py-2">
      <v-progress-linear indeterminate color="primary" />
    </div>

    <div v-else class="up-roles">
      <v-checkbox
        v-for="r in filteredRoles"
        :key="r.id"
        v-model="selectedRoles"
        :label="r.title ?? r.name"
        :value="r.name"
        density="compact"
        hide-details
        class="up-check"
      />

      <div v-if="!filteredRoles.length" class="up-empty">
        No roles found.
      </div>
    </div>

    <v-divider class="my-4" />

    <div class="up-actions">
      <v-btn variant="tonal" @click="onCancel">Cancel</v-btn>
      <v-btn color="primary" :loading="saving" @click="onSave">Save</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import { listRoles, type Role } from "@/modules/roles/services/role.api";
import { createUser, updateUser, type User } from "../services/user.api";

defineOptions({ name: "UserUpsertPanel" });

const props = defineProps<{
  mode: "create" | "edit";
  side: "left" | "right";
  user?: User | null;
  onSaved?: () => void;
}>();

const mode = computed(() => props.mode);

const overlay = useLayoutOverlayStore();

const topRef = ref<HTMLElement | null>(null);
const loading = ref(false);
const saving = ref(false);
const err = ref("");

const roles = ref<Role[]>([]);
const selectedRoles = ref<string[]>([]);
const q = ref("");

const form = ref({
  name: "",
  email: "",
  password: "",
});

const scrollToTop = async () => {
  await nextTick();
  topRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const closeSelf = () => {
  if (props.side === "left") overlay.closeLeft();
  else overlay.closeRight();
};

const filteredRoles = computed(() => {
  const query = (q.value ?? "").toString().trim().toLowerCase();
  if (!query) return roles.value;

  return roles.value.filter((r) => {
    const title = String(r.title ?? "").toLowerCase();
    const name = String(r.name ?? "").toLowerCase();
    return title.includes(query) || name.includes(query);
  });
});

const initFromUser = () => {
  if (props.mode !== "edit" || !props.user) return;

  form.value.name = props.user.name ?? "";
  form.value.email = props.user.email ?? "";
  form.value.password = "";

  const rnames = Array.isArray(props.user.roles)
    ? props.user.roles.map((r) => r.name).filter(Boolean)
    : [];
  selectedRoles.value = Array.from(new Set(rnames));
};

const loadRoles = async () => {
  loading.value = true;
  err.value = "";
  try {
    roles.value = await listRoles();
    initFromUser();
  } catch (e: any) {
    err.value = e?.response?.data?.message ?? e?.message ?? "Roles load failed.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadRoles);

watch(
  () => props.user?.id,
  () => {
    // edit panel aynı component ile tekrar açılırsa
    initFromUser();
  },
);

const onCancel = () => {
  closeSelf();
};

const onSave = async () => {
  if (saving.value) return;

  const name = (form.value.name ?? "").toString().trim();
  const email = (form.value.email ?? "").toString().trim();
  const password = (form.value.password ?? "").toString();

  if (!name) {
    err.value = "Name is required.";
    await scrollToTop();
    return;
  }
  if (!email) {
    err.value = "Email is required.";
    await scrollToTop();
    return;
  }
  if (props.mode === "create") {
    if (!password || password.length < 8) {
      err.value = "Password must be at least 8 characters.";
      await scrollToTop();
      return;
    }
  } else {
    // edit: boş olabilir, doluysa min 8
    if (password && password.length < 8) {
      err.value = "Password must be at least 8 characters.";
      await scrollToTop();
      return;
    }
  }

  saving.value = true;
  err.value = "";
  try {
    const rolesPayload = Array.from(
      new Set((selectedRoles.value ?? []).map((s) => s.trim()).filter(Boolean)),
    );

    if (props.mode === "create") {
      await createUser({
        name,
        email,
        password,
        roles: rolesPayload.length ? rolesPayload : undefined,
      });
    } else {
      const id = props.user?.id;
      if (!id) {
        err.value = "User id missing.";
        await scrollToTop();
        return;
      }

      await updateUser(id, {
        name,
        email,
        ...(password ? { password } : {}),
        roles: rolesPayload.length ? rolesPayload : undefined,
      });
    }

    closeSelf();
    props.onSaved?.();
  } catch (e: any) {
    err.value = e?.response?.data?.message ?? e?.message ?? "Save failed.";
    await scrollToTop();
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.up {
  display: flex;
  flex-direction: column;
}

.up-error {
  border: 1px solid rgba(var(--v-theme-error), var(--crm-alpha-30));
  background: rgba(var(--v-theme-error), var(--crm-alpha-08));
}

.up-roles-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-3);
  margin-bottom: var(--crm-space-3);
}

.up-roles-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
}

.up-search {
  max-width: 260px;
}

.up-roles {
  display: flex;
  flex-direction: column;
}

.up-check :deep(.v-label) {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-85);
}

.up-empty {
  padding: var(--crm-space-4);
  text-align: center;
  opacity: var(--crm-alpha-70);
  font-size: var(--crm-text-sm);
}

.up-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--crm-space-2);
}
</style>
