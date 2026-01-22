<template>
  <v-container fluid class="ul-page">
    <DataTable
      title="Users"
      :headers="headers"
      :items="items"
      :actions="[]"
      :show-add="true"
      add-text="Add User"
      :show-export="true"
      export-text="Export"
      :enable-name-avatar="true"
      name-key="name"
      subtitle-key="email"
      avatar-key="avatar"
      actions-key="actions"
      :show-edit-icon="false"
      filter-key="status"
      filter-label="Status"
      :filter-items="statusFilterItems"
      v-model:search-model-value="search"
      v-model:filter-model-value="statusFilter"
      @add="openAdd"
      @export="onExport"
    >
      <!-- Status cell -->
      <template #item.status="{ item }">
        <div class="d-flex justify-end">
          <v-switch
            v-model="item.status"
            class="ul-status-switch"
            density="compact"
            color="primary"
            hide-details
            inset
            :true-value="'active'"
            :false-value="'inactive'"
          />
        </div>
      </template>

      <!-- Actions cell: trash + eye + kebab menu (Edit/Suspend) -->
      <template #item.actions="{ item }">
        <div class="ul-actions">
          <v-btn
            icon
            variant="text"
            class="ul-action-btn"
            aria-label="Delete"
            @click="onDelete(item)"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
            class="ul-action-btn"
            aria-label="View"
            @click="goToProfile(item)"
          >
            <v-icon>mdi-eye-outline</v-icon>
          </v-btn>

          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon
                variant="text"
                class="ul-action-btn ul-action-btn--kebab"
                aria-label="More"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list density="comfortable" class="ul-actions-menu">
              <v-list-item title="Edit" @click="openEdit(item)" />
              <v-list-item title="Suspend" @click="onSuspend(item)" />
            </v-list>
          </v-menu>
        </div>
      </template>
    </DataTable>

    <!-- RIGHT OFFCANVAS: Add -->
    <v-navigation-drawer
      v-model="rightDrawer"
      width="420"
      temporary
      location="right"
    >
      <div class="ul-drawer-head">
        <div class="ul-drawer-title">Add User</div>
        <v-btn
          icon
          variant="text"
          aria-label="Close right"
          @click="rightDrawer = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="ul-drawer-body">
        <div class="ul-lorem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </v-navigation-drawer>

    <!-- LEFT OFFCANVAS: Edit -->
    <v-navigation-drawer
      v-model="leftDrawer"
      width="360"
      temporary
      location="left"
    >
      <div class="ul-drawer-head">
        <div class="ul-drawer-title">Edit User</div>
        <v-btn
          icon
          variant="text"
          aria-label="Close left"
          @click="leftDrawer = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="ul-drawer-body">
        <div class="ul-lorem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import DataTable from "@/components/datatable/DataTable.vue";

defineOptions({ name: "UsersListView" });

type DTHeader = {
  title: string;
  key: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: string | number;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  phone: string;
  department: string;
  status: "active" | "inactive";
};

const search = ref("");
const statusFilter = ref<string | number | null>(null);

const rightDrawer = ref(false);
const leftDrawer = ref(false);

const headers = [
  { title: "Name", key: "name" },
  { title: "Role", key: "role" },
  { title: "Phone", key: "phone", align: "end" },
  { title: "Department", key: "department", align: "end" },
  { title: "Status", key: "status", align: "end" },
  { title: "", key: "actions", align: "end", width: 140 },
] satisfies DTHeader[];

const items = ref<UserRow[]>([
  {
    id: "1",
    name: "Violet Mendoza",
    email: "vafgt@vultukir.org",
    role: "Author",
    phone: "+90 555 111 22 33",
    department: "Operations",
    status: "active",
  },
  {
    id: "2",
    name: "Eileen Ramos",
    email: "eileen@reginamed.test",
    role: "Manager",
    phone: "+90 555 222 33 44",
    department: "Sales",
    status: "inactive",
  },
  {
    id: "3",
    name: "Owen Hughes",
    email: "owen@reginamed.test",
    role: "Staff",
    phone: "+90 555 333 44 55",
    department: "Support",
    status: "active",
  },
  {
    id: "4",
    name: "Merline Ford",
    email: "merline@reginamed.test",
    role: "Staff",
    phone: "+90 555 444 55 66",
    department: "Clinic",
    status: "active",
  },
]);

const statusFilterItems = [
  { title: "active", value: "active" },
  { title: "inactive", value: "inactive" },
];

const openAdd = () => {
  rightDrawer.value = true;
};

const router = useRouter();

const openEdit = (_item: any) => {
  leftDrawer.value = true;
};

const onExport = (_payload: { format: "csv" | "xlsx" }) => {
  // şimdilik statik
};

const goToProfile = (item: any) => {
  const id = (item?.id ?? "").toString();
  if (!id) return;

  router.push({ name: "users-profile-account", params: { id } });
};

const onDelete = (_item: any) => {
  // şimdilik statik
};

const onSuspend = (_item: any) => {
  // şimdilik statik
};
</script>

<style scoped>
.ul-page {
  padding: var(--crm-space-4);
}

.ul-drawer-head {
  height: 56px;
  padding: 0 var(--crm-space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.ul-drawer-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ul-drawer-body {
  padding: var(--crm-space-3);
}

.ul-lorem {
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
  line-height: 1.6;
}

.ul-view-card {
  border-radius: var(--crm-radius-1);
}

.ul-view-head {
  height: 56px;
  padding: 0 var(--crm-space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.ul-view-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.ul-view-body {
  padding: 0;
}

.ul-avatar-text {
  font-size: var(--crm-text-xl);
  font-weight: var(--crm-fw-bold);
  color: rgb(var(--v-theme-on-primary));
}

.ul-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--crm-space-3);
}

.ul-stat {
  padding: var(--crm-space-3);
  border-radius: var(--crm-radius-1);
  background: rgba(var(--v-theme-primary), var(--crm-alpha-10));
  text-align: center;
}

.ul-stat__value {
  font-size: var(--crm-text-lg);
  font-weight: var(--crm-fw-xbold);
  line-height: 1.1;
}

.ul-stat__label {
  font-size: var(--crm-text-xs);
  opacity: var(--crm-alpha-70);
}

.ul-details-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  margin-bottom: var(--crm-space-2);
}

.ul-details {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
}

.ul-kv {
  display: flex;
  gap: var(--crm-space-2);
  font-size: var(--crm-text-sm);
}

.ul-kv__k {
  opacity: var(--crm-alpha-70);
}

.ul-kv__v {
  font-weight: var(--crm-fw-medium);
}

.ul-view-sections {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}
/* Actions görseldeki gibi sıkı ve modern */
.ul-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}

.ul-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
}

.ul-action-btn:hover {
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
}

.ul-action-btn--kebab {
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
}

.ul-actions-menu {
  min-width: 180px;
}

/* Status switch biraz küçülsün (kibar) */
.ul-status-switch {
  transform: scale(0.55);
  transform-origin: right center;
}
</style>
