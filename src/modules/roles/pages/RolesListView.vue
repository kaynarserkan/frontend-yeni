<template>
  <div class="page">
    <DataTable
      title="Roles"
      :headers="headers"
      :items="roles"
      :loading="loading"
      :show-add="canRolesCreate()"
      add-text="New Role"
      :actions="rowActions()"
      @add="openCreate"
      @action="onRowAction"
    >
      <template #item.name="{ item }">
        <div class="role-name">
          {{ item.title ?? item.name }}
        </div>
      </template>

      <template #item.permissions="{ item }">
        <div class="chips">
          <v-chip
            v-for="p in item.permissions"
            :key="p.id"
            size="x-small"
            variant="tonal"
            class="me-1 mb-1"
          >
            {{ p.name }}
          </v-chip>
          <span v-if="!item.permissions?.length" class="muted">—</span>
        </div>
      </template>
    </DataTable>

    <v-alert v-if="err" type="error" variant="tonal" class="mt-4">
      {{ err }}
    </v-alert>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "@/components/datatable/DataTable.vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import { useAuthStore } from "@/core/auth/auth.store";
import RoleUpsertPanel from "../components/RoleUpsertPanel.vue";
import { deleteRole, listRoles, type Role } from "../services/role.api";

defineOptions({ name: "RolesListView" });

const overlay = useLayoutOverlayStore();
const auth = useAuthStore();

const canRolesRead = () => auth.canAny(["role.read", "roles.read"]);
const canRolesCreate = () => auth.canAny(["role.create", "roles.create"]);
const canRolesUpdate = () => auth.canAny(["role.update", "roles.update"]);
const canRolesDelete = () => auth.canAny(["role.delete", "roles.delete"]);

const roles = ref<Role[]>([]);
const loading = ref(false);
const err = ref("");

const headers = [
  { title: "ID", key: "id", width: 80 },
  { title: "Name", key: "name", width: 200 },
  { title: "Permissions", key: "permissions" },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    width: 80,
    align: "end" as const,
  },
] as const;

const rowActions = () => {
  const a: Array<{ key: string; label: string; danger?: boolean }> = [];

  if (canRolesUpdate()) a.push({ key: "edit", label: "Edit" });
  if (canRolesDelete())
    a.push({ key: "delete", label: "Delete", danger: true });

  return a;
};

const fetchRoles = async () => {
  if (!canRolesRead()) {
    roles.value = [];
    err.value = "Bu sayfayı görüntülemek için yetkiniz yok (role.read).";
    return;
  }

  err.value = "";
  loading.value = true;
  try {
    roles.value = await listRoles();
  } catch (e: any) {
    err.value =
      e?.response?.data?.message ?? e?.message ?? "Roles load failed.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRoles);

const openCreate = () => {
  overlay.openRight({
    title: "Create Role",
    component: RoleUpsertPanel,
    props: {
      mode: "create",
      side: "right",
      role: null,
      onSaved: () => fetchRoles(),
    },
  });
};

const openEdit = (role: Role) => {
  overlay.openLeft({
    title: `Edit Role — ${role.name}`,
    component: RoleUpsertPanel,
    props: {
      mode: "edit",
      side: "left",
      role,
      onSaved: () => fetchRoles(),
    },
  });
};

const removeRole = async (role: Role) => {
  if (!confirm(`Delete role "${role.name}" ?`)) return;

  err.value = "";
  loading.value = true;
  try {
    await deleteRole(role.id);
    await fetchRoles();
  } catch (e: any) {
    err.value = e?.response?.data?.message ?? e?.message ?? "Delete failed.";
  } finally {
    loading.value = false;
  }
};

const onRowAction = (payload: { key: string; item: Role }) => {
  if (payload.key === "edit") {
    openEdit(payload.item);
    return;
  }
  if (payload.key === "delete") {
    removeRole(payload.item);
    return;
  }
};
</script>
<style scoped>
.page {
  padding: var(--crm-space-6);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.muted {
  opacity: var(--crm-alpha-70);
}

.role-name {
  font-weight: var(--crm-fw-medium);
}
</style>
