<script setup lang="ts">
import { onMounted, ref } from "vue";
import { syncUserRoles, type User } from "../services/user.api";
import { listRoles, type Role } from "@/modules/roles/services/role.api";

const props = defineProps<{ user: User }>();
const emit = defineEmits<{ (e: "updated", u: User): void }>();

const roles = ref<Role[]>([]);
const selected = ref<string[]>([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    roles.value = await listRoles();
    selected.value = props.user.roles.map((r) => r.name);
  } finally {
    loading.value = false;
  }
};

const onSave = async () => {
  loading.value = true;
  try {
    const u = await syncUserRoles(props.user.id, selected.value);
    emit("updated", u);
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="text-subtitle-1 font-weight-bold mb-3">Roles</div>

    <v-checkbox
      v-for="r in roles"
      :key="r.id"
      v-model="selected"
      :label="r.name"
      :value="r.name"
      density="compact"
      hide-details
    />

    <v-divider class="my-4" />

    <v-btn color="primary" @click="onSave"> Save roles </v-btn>
  </v-card>
</template>
