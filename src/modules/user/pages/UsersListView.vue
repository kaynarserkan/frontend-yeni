<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTable from "@/components/datatable/DataTable.vue";
import { listUsers, type User } from "../services/user.api";

defineOptions({ name: "UsersListView" });

const loading = ref(false);
const items = ref<User[]>([]);
const errorText = ref("");

const searchModelValue = ref("");

const headers = [
  { title: "ID", key: "id", sortable: true, width: 80 },
  { title: "Name", key: "name", sortable: true },
  { title: "Email", key: "email", sortable: true },
];

const fetchUsers = async () => {
  loading.value = true;
  errorText.value = "";

  try {
    // backend list endpoint paginated: { data: [...] }
    const res = await listUsers();
    items.value = Array.isArray(res?.data) ? res.data : [];
  } catch (e: any) {
    errorText.value =
      e?.response?.data?.message ?? e?.message ?? "Users fetch error";
    items.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="pa-6">
    <v-alert v-if="errorText" type="error" variant="tonal" class="mb-4">
      {{ errorText }}
    </v-alert>

    <DataTable
      title="Users"
      :headers="headers"
      :items="items"
      :loading="loading"
      v-model:searchModelValue="searchModelValue"
      search-label="Search user"
      :showAdd="false"
      :showExport="false"
      empty-text="No users found"
    />
  </div>
</template>
