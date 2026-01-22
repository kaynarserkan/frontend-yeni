<template>
  <div class="dtpg-page">
    <DataTable
      title="DataTable Playground"
      :headers="headers"
      :items="items"
      :loading="loading"
      search-label="Search"
      v-model:searchModelValue="search"
      filter-key="status"
      filter-label="Status"
      :filter-items="statusOptions"
      v-model:filterModelValue="status"
      :items-per-page="10"
      empty-text="No records found"
      :show-add="true"
      add-text="Add Service"
      :show-export="true"
      export-text="Export"
      :enable-name-avatar="true"
      name-key="name"
      subtitle-key="email"
      avatar-key="avatar"
      actions-key="actions"
      :actions="rowActions"
      :show-edit-icon="true"
      @add="onAdd"
      @export="onExport"
      @action="onRowAction"
      @edit="onEdit"
    />

    <v-snackbar v-model="snackbarOpen" :timeout="2500">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DataTable from "@/components/datatable/DataTable.vue";

defineOptions({ name: "DataTablePlaygroundPage" });

const loading = ref(false);
const search = ref("");
const status = ref<string | number | null>(null);

const statusOptions = computed(() => [
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" },
  { title: "Draft", value: "draft" },
]);

const headers = computed(() => [
  { title: "Name", key: "name", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Price", key: "price", sortable: true, align: "end" as const },
  { title: "Created", key: "created_at", sortable: true },
  {
    title: "",
    key: "actions",
    sortable: false,
    align: "end" as const,
    width: 80,
  },
]);

const items = computed(() => [
  {
    id: 1,
    name: "Hair Transplant",
    email: "service@reginamed.test",
    avatar: "",
    status: "active",
    price: 1200,
    created_at: "2026-01-10",
  },
  {
    id: 2,
    name: "Dental Implant",
    email: "dental@reginamed.test",
    avatar: "",
    status: "inactive",
    price: 890,
    created_at: "2026-01-05",
  },
  {
    id: 3,
    name: "Nose Aesthetics",
    email: "rhinoplasty@reginamed.test",
    avatar: "",
    status: "draft",
    price: 2100,
    created_at: "2025-12-28",
  },
  {
    id: 4,
    name: "Botox",
    email: "botox@reginamed.test",
    avatar: "",
    status: "active",
    price: 250,
    created_at: "2025-12-18",
  },
]);

const rowActions = computed(() => [
  { key: "view", label: "View" },
  { key: "duplicate", label: "Duplicate" },
  { key: "delete", label: "Delete", danger: true },
]);

const snackbarOpen = ref(false);
const snackbarText = ref("");

const toast = (t: string) => {
  snackbarText.value = t;
  snackbarOpen.value = true;
};

const onAdd = () => {
  toast("Add clicked");
};

const onExport = (payload: { format: "csv" | "xlsx" }) => {
  toast(`Export: ${payload.format}`);
};

const onRowAction = (payload: { key: string; item: any }) => {
  toast(`Action: ${payload.key} (id=${payload.item?.id ?? "-"})`);
};

const onEdit = (item: any) => {
  toast(`Edit clicked (id=${item?.id ?? "-"})`);
};
</script>

<style scoped>
.dtpg-page {
  padding: var(--crm-space-6);
}
</style>
