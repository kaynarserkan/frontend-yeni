<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DataTable from "@/components/datatable/DataTable.vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import UserUpsertPanel from "../components/UserUpsertPanel.vue";
import { deleteUser, listUsers, type User } from "../services/user.api";



defineOptions({ name: "UsersListView" });

const router = useRouter();
const overlay = useLayoutOverlayStore();

const loading = ref(false);
const items = ref<User[]>([]);
const errorText = ref("");

const searchModelValue = ref("");

const headers = [
  { title: "ID", key: "id", sortable: true, width: 80 },
  { title: "Name", key: "name", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Role", key: "role", sortable: false, width: 180 },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    width: 120,
    align: "end" as const,
  },
] as const;


// ✅ Route name'e bağlı kalma: path ile git (name yoksa da çalışır)
const goProfile = (u: User) => {
  router.push({ path: `/users/${u.id}` });
};

const openCreate = () => {
  overlay.openRight({
    title: "Create User",
    component: UserUpsertPanel,
    props: {
      mode: "create",
      side: "right",
      user: null,
      onSaved: async () => {
        await fetchUsers();
      },
    },
  });
};

const openEdit = (u: User) => {
  overlay.openLeft({
    title: `Edit User — ${u.name}`,
    component: UserUpsertPanel,
    props: {
      mode: "edit",
      side: "left",
      user: u,
      onSaved: async () => {
        await fetchUsers();
      },
    },
  });
};

const removeUser = async (u: User) => {
  if (!confirm(`Delete user "${u.name}" ?`)) return;

  errorText.value = "";
  loading.value = true;
  try {
    await deleteUser(u.id);
    await fetchUsers();
  } catch (e: any) {
    errorText.value =
      e?.response?.data?.message ?? e?.message ?? "Delete failed.";
  } finally {
    loading.value = false;
  }
};

const rowActions = [
  { key: "view", label: "View" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete", danger: true },
] as const;

const onRowAction = (payload: { key: string; item: User }) => {
  if (payload.key === "view") {
    goProfile(payload.item);
    return;
  }
  if (payload.key === "edit") {
    openEdit(payload.item);
    return;
  }
  if (payload.key === "delete") {
    removeUser(payload.item);
    return;
  }
};



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
  :show-add="true"
  add-text="New User"
  :show-export="false"
  empty-text="No users found"
  :actions="rowActions"
  @add="openCreate"
  @action="onRowAction"
>
  <template #item.name="{ item }">
    <span
      role="link"
      tabindex="0"
      class="u-link"
      @click="goProfile(item)"
      @keydown.enter="goProfile(item)"
      @keydown.space.prevent="goProfile(item)"
    >
      {{ item.name }}
    </span>
  </template>

  <template #item.email="{ item }">
    <span
      role="link"
      tabindex="0"
      class="u-link"
      @click="goProfile(item)"
      @keydown.enter="goProfile(item)"
      @keydown.space.prevent="goProfile(item)"
    >
      {{ item.email }}
    </span>
  </template>

  <template #item.role="{ item }">
    <div class="d-flex flex-wrap ga-1 justify-end justify-sm-start">
      <v-chip
        v-for="r in (Array.isArray(item?.roles) ? item.roles : [])"
        :key="String(r?.id ?? r?.name ?? r)"
        size="x-small"
        color="primary"
        variant="tonal"
      >
        {{ r?.title ?? r?.name ?? r }}
      </v-chip>

      <span v-if="!Array.isArray(item?.roles) || item.roles.length === 0" class="text-caption opacity-70">
        —
      </span>
    </div>
  </template>
</DataTable>


  </div>
</template>

<style scoped>
.u-link {
  cursor: pointer;
  color: rgb(var(--v-theme-primary));
  font-weight: var(--crm-fw-medium);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>

