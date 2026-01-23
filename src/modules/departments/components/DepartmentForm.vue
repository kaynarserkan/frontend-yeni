<template>
  <div class="df-wrap">
    <div class="df-head">
      <div class="df-title">{{ titleText }}</div>
      <div class="df-sub">
        Endpoint: <span class="df-mono">/api/config-service/departments</span>
      </div>
    </div>

    <v-alert
      v-if="errorText"
      type="error"
      variant="tonal"
      class="mt-3"
      density="comfortable"
    >
      {{ errorText }}
    </v-alert>

    <div class="df-body mt-4">
      <v-text-field
        v-model="form.name"
        label="Name"
        hide-details
        :disabled="isProcessing"
      />

      <v-text-field
        v-model="form.slug"
        label="Slug"
        hide-details
        class="mt-3"
        :disabled="isProcessing"
      />

      <v-textarea
        v-model="form.description"
        label="Description"
        rows="3"
        hide-details
        class="mt-3"
        :disabled="isProcessing"
      />

      <div class="d-flex align-center ga-3 mt-3">
        <v-switch
          v-model="form.is_active"
          label="Active"
          inset
          hide-details
          :disabled="isProcessing"
        />

        <v-text-field
          v-model.number="form.sort_order"
          label="Sort Order"
          type="number"
          hide-details
          class="df-sort"
          :disabled="isProcessing"
        />
      </div>
    </div>

    <div class="df-actions mt-5">
      <v-btn
        color="primary"
        :loading="isProcessing"
        :disabled="isProcessing"
        @click="onSave"
      >
        Save
      </v-btn>

      <v-btn variant="tonal" :disabled="isProcessing" @click="onCancel">
        Cancel
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";
import {
  createDepartment,
  getDepartment,
  updateDepartment,
  type Department,
  type DepartmentUpsertPayload,
} from "@/modules/departments/services/departments.api";

const props = defineProps<{
  mode: "create" | "edit";
  id?: number | string;
  initial?: Partial<Department> | null;
  side?: "left" | "right";
}>();

const emit = defineEmits<{
  (e: "saved", item: Department): void;
}>();

const overlay = useLayoutOverlayStore();

const isProcessing = ref(false);
const errorText = ref("");

const form = ref<DepartmentUpsertPayload>({
  name: "",
  slug: "",
  description: "",
  is_active: true,
  sort_order: 1,
});

const titleText = computed(() =>
  props.mode === "create" ? "Add Department" : "Edit Department",
);

const closeSelf = () => {
  const side = props.side ?? (props.mode === "create" ? "right" : "left");
  if (side === "right") overlay.closeRight();
  else overlay.closeLeft();
};

const applyInitial = (src: Partial<Department> | null | undefined) => {
  if (!src) return;

  if (typeof src.name === "string") form.value.name = src.name;

  if (typeof src.slug === "string") form.value.slug = src.slug;

  if (typeof src.description === "string" || src.description === null)
    form.value.description = src.description ?? "";

  if (typeof src.is_active === "boolean") form.value.is_active = src.is_active;

  if (typeof src.sort_order === "number" || src.sort_order === null)
    form.value.sort_order = src.sort_order ?? null;
};

onMounted(async () => {
  errorText.value = "";

  // create: initial varsa doldur
  if (props.mode === "create") {
    applyInitial(props.initial);
    return;
  }

  // edit: initial varsa kullan, yoksa show ile çek
  if (props.initial) {
    applyInitial(props.initial);
    return;
  }

  if (props.id === undefined || props.id === null || props.id === "") {
    errorText.value = "Missing department id.";
    return;
  }

  try {
    isProcessing.value = true;
    const d = await getDepartment(props.id);
    applyInitial(d);
  } catch (e: any) {
    errorText.value =
      e?.response?.data?.message ?? "Failed to load department.";
  } finally {
    isProcessing.value = false;
  }
});

const onCancel = () => {
  if (isProcessing.value) return;

  closeSelf();
};

const onSave = async () => {
  if (isProcessing.value) return;

  errorText.value = "";

  const payload: DepartmentUpsertPayload = {
    name: (form.value.name ?? "").toString().trim(),
    slug: (form.value.slug ?? "").toString().trim(),
    description: form.value.description ?? "",
    is_active: Boolean(form.value.is_active),
    sort_order:
      typeof form.value.sort_order === "number" ? form.value.sort_order : null,
  };

  if (!payload.name) {
    errorText.value = "Name is required.";
    return;
  }

  if (!payload.slug) {
    errorText.value = "Slug is required.";
    return;
  }

  try {
    isProcessing.value = true;

    const saved =
      props.mode === "create"
        ? await createDepartment(payload)
        : await updateDepartment(props.id as any, payload);

    emit("saved", saved);
    closeSelf();
  } catch (e: any) {
    errorText.value = e?.response?.data?.message ?? "Save failed.";
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
.df-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
}

.df-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.df-sub {
  margin-top: 6px;
  font-size: var(--crm-text-xs);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}

.df-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: var(--crm-text-xs);
}

.df-sort {
  min-width: 160px;
  max-width: 220px;
}

.df-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--crm-space-2);
}
</style>
