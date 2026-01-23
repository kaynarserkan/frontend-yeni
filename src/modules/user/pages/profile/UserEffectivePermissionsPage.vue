<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getUser, type User } from "../../services/user.api";

const route = useRoute();
const user = ref<User | null>(null);

onMounted(async () => {
  user.value = await getUser(Number(route.params.id));
});

const effectivePermissions = computed(() => {
  if (!user.value) return [];

  const fromRoles = user.value.roles
    .flatMap((r) => (r as any).permissions ?? [])
    .map((p: any) => p.name);

  const direct = user.value.permissions.map((p) => p.name);

  return Array.from(new Set([...fromRoles, ...direct])).sort();
});
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <v-card variant="flat" class="pa-4">
      <div class="text-subtitle-1 font-weight-bold mb-2">
        Effective Permissions
      </div>

      <div
        v-if="effectivePermissions.length === 0"
        class="text-caption opacity-70"
      >
        Bu kullanıcı için atanmış bir yetki yok.
      </div>

      <v-chip
        v-for="p in effectivePermissions"
        :key="p"
        size="small"
        variant="tonal"
        color="primary"
        class="ma-1"
      >
        {{ p }}
      </v-chip>
    </v-card>
  </div>
</template>
