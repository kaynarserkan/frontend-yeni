<template>
  <v-card variant="flat" class="psc">
    <!-- avatar -->
    <div class="psc-avatar-wrap">
      <div class="psc-avatar">
        <template v-if="loading">
          <v-skeleton-loader type="avatar" />
        </template>

        <template v-else>
          <v-avatar size="84" class="psc-va" color="primary" variant="tonal">
            <v-img v-if="avatarUrl" :src="avatarUrl" cover />
            <span v-else class="psc-initials">{{ initials }}</span>
          </v-avatar>
        </template>
      </div>

      <div class="psc-avatar-actions" v-if="!loading">
        <input
          ref="fileRef"
          type="file"
          accept="image/*"
          class="d-none"
          @change="onFilePicked"
        />

        <template v-if="!avatarUrl">
          <v-btn size="small" variant="tonal" @click="pickFile">
            Ekle
          </v-btn>
        </template>

        <template v-else>
          <v-btn size="small" variant="tonal" @click="pickFile">
            Değiştir
          </v-btn>
          <v-btn size="small" variant="text" color="error" @click="onDelete">
            Sil
          </v-btn>
        </template>
      </div>
    </div>

    <v-divider class="my-4" />

    <!-- identity -->
    <div class="psc-body">
      <template v-if="loading">
        <v-skeleton-loader type="text" class="mb-2" />
        <v-skeleton-loader type="text" width="70%" class="mb-2" />
        <v-skeleton-loader type="text" width="55%" />
      </template>

      <template v-else>
        <div class="psc-name">{{ name }}</div>
        <div class="psc-sub">{{ email }}</div>

        <div v-if="phone" class="psc-sub mt-2">
          {{ phone }}
        </div>
      </template>
    </div>

    <!-- extra slot (opsiyonel) -->
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

defineOptions({ name: "ProfileSidebarCard" });

const props = defineProps<{
  loading?: boolean;

  name?: string;
  email?: string;
  phone?: string | null;

  avatarUrl?: string | null;
}>();

const emit = defineEmits<{
  (e: "upload", file: File): void;
  (e: "delete"): void;
}>();

const fileRef = ref<HTMLInputElement | null>(null);

const loading = computed(() => Boolean(props.loading));
const name = computed(() => String(props.name ?? "").trim());
const email = computed(() => String(props.email ?? "").trim());
const phone = computed(() => (props.phone ?? "").toString().trim());
const avatarUrl = computed(() => (props.avatarUrl ?? "").toString().trim());

const initials = computed(() => {
  const n = name.value;
  if (!n) return "U";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] ?? "U").toUpperCase();
  const b = (parts[1]?.[0] ?? "").toUpperCase();
  return (a + b).slice(0, 2);
});

const pickFile = () => {
  fileRef.value?.click();
};

const onFilePicked = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  input.value = "";
  if (!f) return;
  emit("upload", f);
};

const onDelete = () => {
  emit("delete");
};
</script>

<style scoped>
.psc {
  padding: var(--crm-space-4);
}

.psc-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--crm-space-2);
}

.psc-avatar {
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
}

.psc-va {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
}

.psc-initials {
  font-weight: var(--crm-fw-xbold);
  font-size: 22px;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-primary));
}

.psc-avatar-actions {
  display: flex;
  gap: var(--crm-space-2);
  align-items: center;
}

.psc-body {
  text-align: center;
}

.psc-name {
  font-size: var(--crm-text-lg);
  font-weight: var(--crm-fw-xbold);
}

.psc-sub {
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-75);
}
</style>
