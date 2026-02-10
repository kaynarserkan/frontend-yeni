<template>
  <div class="dp-page">
    <DataTable
      title="Departments"
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-per-page="10"
      empty-text="No departments found"
      search-label="Search departments"
      :show-add="canDepartmentsCreate()"
      add-text="Add Department"
      :actions="rowActions"
      actions-key="actions"
      :show-edit-icon="canDepartmentsUpdate()"
      @add="onAdd"
      @edit="onEdit"
      @action="onRowAction"
    >
      <template #toolbar-actions>
        <v-btn
          variant="tonal"
          class="dp-btn"
          prepend-icon="mdi-refresh"
          :loading="loading"
          @click="load"
        >
          Refresh
        </v-btn>
      </template>

      <template #item.is_active="{ item }">
        <v-chip
          size="small"
          variant="tonal"
          :class="item.is_active ? 'dp-chip-on' : 'dp-chip-off'"
        >
          {{ item.is_active ? "Active" : "Inactive" }}
        </v-chip>
      </template>

      <template #item.updated_at="{ item }">
        <span class="dp-muted">{{ formatDate(item.updated_at) }}</span>
      </template>

      <template #item.created_at="{ item }">
        <span class="dp-muted">{{ formatDate(item.created_at) }}</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "@/components/datatable/DataTable.vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import { useAuthStore } from "@/core/auth/auth.store";
import DepartmentForm from "@/modules/departments/components/DepartmentForm.vue";
import {
  deleteDepartment,
  listDepartments,
  type Department,
} from "@/modules/departments/services/departments.api";

type Header = {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: string | number;
};

const overlay = useLayoutOverlayStore();
const auth = useAuthStore();

const canDepartmentsRead = () =>
  auth.canAny(["department.read", "departments.read"]);

const canDepartmentsCreate = () =>
  auth.canAny(["department.create", "departments.create"]);

const canDepartmentsUpdate = () =>
  auth.canAny(["department.update", "departments.update"]);

const canDepartmentsDelete = () =>
  auth.canAny(["department.delete", "departments.delete"]);

const loading = ref(false);
const items = ref<Department[]>([]);

const headers = ref<Header[]>([
  { title: "Name", key: "name" },
  { title: "Slug", key: "slug" },
  { title: "Description", key: "description" },
  { title: "Active", key: "is_active", width: 120 },
  { title: "Sort", key: "sort_order", width: 90 },
  { title: "Updated", key: "updated_at", width: 140 },
  { title: "", key: "actions", align: "end", width: 80 },
]);

const rowActions = ref(
  canDepartmentsDelete()
    ? [{ key: "delete", label: "Delete", danger: true }]
    : [],
);

const load = async () => {
  if (!canDepartmentsRead()) {
    items.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    items.value = await listDepartments();
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  load();
});

const onAdd = () => {
  overlay.openRight({
    component: DepartmentForm,
    props: {
      mode: "create",
      side: "right",
      initial: null,
      onSaved: () => load(),
    },
  });
};

const onEdit = (item: Department) => {
  overlay.openLeft({
    component: DepartmentForm,
    props: {
      mode: "edit",
      side: "left",
      id: item.id,
      initial: item,
      onSaved: () => load(),
    },
  });
};

const onRowAction = async ({
  key,
  item,
}: {
  key: string;
  item: Department;
}) => {
  if (key === "delete") {
    const ok = window.confirm(`Delete department "${item.name}"?`);
    if (!ok) return;

    loading.value = true;
    try {
      await deleteDepartment(item.id);
      await load();
    } finally {
      loading.value = false;
    }
  }
};

const formatDate = (iso: string) => {
  if (!iso) return "";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  // TR style (kısa, net)
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear());
  return `${dd}.${mm}.${yy}`;
};
</script>

<style scoped>
.dp-page {
  padding: var(--crm-space-4);
}

.dp-btn {
  height: var(--crm-control-h);
  font-weight: var(--crm-fw-medium);
}

.dp-muted {
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
  font-size: var(--crm-text-sm);
}

.dp-chip-on :deep(.v-chip__content),
.dp-chip-off :deep(.v-chip__content) {
  font-size: var(--crm-text-xs);
  font-weight: var(--crm-fw-bold);
}

.dp-chip-on {
  color: rgb(var(--v-theme-primary));
}

.dp-chip-off {
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}
</style>
