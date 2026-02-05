<script setup lang="ts">
import { onMounted, ref } from "vue";
import { syncUserPermissions, type User } from "../services/user.api";
import {
  listPermissions,
  type Permission,
} from "@/modules/roles/services/permissions.api";

const props = defineProps<{ user: User }>();
const emit = defineEmits<{ (e: "updated", u: User): void }>();

const all = ref<Permission[]>([]);
const selected = ref<string[]>([]);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  try {
    all.value = await listPermissions();
    selected.value = props.user.permissions.map((p) => p.name);
  } finally {
    loading.value = false;
  }
};

const onSave = async () => {
  loading.value = true;
  try {
    const u = await syncUserPermissions(props.user.id, selected.value);
    emit("updated", u);
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<template>
  <v-card variant="flat" class="pa-4">
    <div class="text-subtitle-1 font-weight-bold mb-3">Direct Permissions</div>

    <v-checkbox
      v-for="p in all"
      :key="p.id"
      v-model="selected"
      :label="p.name"
      :value="p.name"
      density="compact"
      hide-details
    />

    <v-divider class="my-4" />

    <v-btn color="primary" @click="onSave"> Save permissions </v-btn>
  </v-card>
</template>
