<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/core/auth/auth.store";
import ProfilePageShell from "@/components/profile/ProfilePageShell.vue";
import ProfileSidebarCard from "@/components/profile/ProfileSidebarCard.vue";
import ProfileTabsNav from "@/components/profile/ProfileTabsNav.vue";
import {
  getUser,
  getUserProfile,
  uploadUserAvatar,
  deleteUserAvatar,
  type User,
} from "../../services/user.api";

defineOptions({ name: "UserProfileLayout" });

const route = useRoute();
const auth = useAuthStore();

const loading = ref(false);
const user = ref<User | null>(null);

const userId = computed(() => String(route.params.id ?? "").trim());

const fetchAll = async () => {
  if (!userId.value) return;

  loading.value = true;
  try {
    const u = await getUser(userId.value);

    // profile ayrı endpoint’ten geliyor
    const profile = await getUserProfile(userId.value).catch(() => null);
    user.value = { ...(u as any), profile };
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAll);

watch(
  () => route.params.id,
  () => {
    fetchAll();
  },
);

const tabs = computed(() => {
  const id = route.params.id;

  const base = [
    {
      key: "overview",
      label: "Genel Bakış",
      icon: "mdi-account-box-outline",
      to: { name: "users-profile-account", params: { id } },
    },
  ];

  if (auth.isAdmin) {
    base.push({
      key: "roles",
      label: "Roles & Permissions",
      icon: "mdi-shield-account",
      to: { name: "users-profile-roles-permissions", params: { id } },
    });
  }

  return base;
});

const sidebarName = computed(() => user.value?.name ?? "");
const sidebarEmail = computed(() => user.value?.email ?? "");
const sidebarPhone = computed(() => user.value?.profile?.phone_number ?? null);

const sidebarAvatarUrl = computed(() => {
  return (
    (user.value as any)?.avatar_url ??
    (user.value as any)?.profile?.avatar_url ??
    null
  );
});

const onAvatarUpload = async (file: File) => {
  if (!userId.value) return;

  try {
    await uploadUserAvatar(userId.value, file);
    await fetchAll();
  } catch (e: any) {
    alert(e?.response?.data?.message ?? e?.message ?? "Avatar upload failed.");
  }
};

const onAvatarDelete = async () => {
  if (!userId.value) return;
  if (!confirm("Avatar silinsin mi?")) return;

  try {
    await deleteUserAvatar(userId.value);
    await fetchAll();
  } catch (e: any) {
    alert(e?.response?.data?.message ?? e?.message ?? "Avatar delete failed.");
  }
};
</script>

<template>
  <ProfilePageShell>
    <template #sidebar>
      <ProfileSidebarCard
        :loading="loading"
        :name="sidebarName"
        :email="sidebarEmail"
        :phone="sidebarPhone"
        :avatar-url="sidebarAvatarUrl"
        @upload="onAvatarUpload"
        @delete="onAvatarDelete"
      />
    </template>

    <template #tabs>
      <ProfileTabsNav :tabs="tabs" />
    </template>

    <router-view />
  </ProfilePageShell>
</template>
