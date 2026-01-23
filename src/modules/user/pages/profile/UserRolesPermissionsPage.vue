<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getUser, type User } from "../../services/user.api";
import UserRolesPanel from "../../components/UserRolesPanel.vue";
import UserPermissionsPanel from "../../components/UserPermissionsPanel.vue";

const route = useRoute();
const user = ref<User | null>(null);

const load = async () => {
  user.value = await getUser(Number(route.params.id));
};

onMounted(load);
</script>

<template>
  <div v-if="user" class="d-flex flex-column gap-4">
    <UserRolesPanel :user="user" @updated="load" />
    <UserPermissionsPanel :user="user" @updated="load" />
  </div>
</template>
