<template>
  <div class="ua-page">
    <!-- Genel Bilgiler (user_profiles) -->
    <ProfileSectionCard>
      <template #title>Genel Bilgiler</template>

      <template #actions>
        <v-btn
          variant="tonal"
          size="small"
          @click="openEdit"
          :disabled="loadingProfile"
        >
          Düzenle
        </v-btn>
      </template>

      <div v-if="loadingProfile" class="py-2">
        <v-progress-linear indeterminate color="primary" />
      </div>

      <div v-else>
        <div class="gi-grid">
          <div class="gi-row">
            <div class="gi-k">Title</div>
            <div class="gi-v">{{ profile?.title ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Specialty</div>
            <div class="gi-v">{{ profile?.specialty ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Daily Capacity</div>
            <div class="gi-v">{{ profile?.daily_capacity ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Phone</div>
            <div class="gi-v">{{ profile?.phone_number ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Address</div>
            <div class="gi-v gi-pre">{{ profile?.address_line ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">National ID</div>
            <div class="gi-v">{{ profile?.national_id ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Passport ID</div>
            <div class="gi-v">{{ profile?.passport_id ?? "—" }}</div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Emergency Contact</div>
            <div class="gi-v">
              <div>{{ profile?.emergency_contact_name ?? "—" }}</div>
              <div class="text-caption opacity-70">
                {{ profile?.emergency_contact_phone ?? "" }}
              </div>
            </div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Skills</div>
            <div class="gi-v">
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="s in (Array.isArray(profile?.skills) ? profile!.skills! : [])"
                  :key="s"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  {{ s }}
                </v-chip>
                <span
                  v-if="!Array.isArray(profile?.skills) || profile!.skills!.length === 0"
                  class="text-caption opacity-70"
                >
                  —
                </span>
              </div>
            </div>
          </div>

          <div class="gi-row">
            <div class="gi-k">Active</div>
            <div class="gi-v">
              <v-chip
                size="small"
                :color="profile?.is_active ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ profile?.is_active ? "Active" : "Inactive" }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
    </ProfileSectionCard>

    <!-- Roles & Permissions (Overview) -->
    <ProfileSectionCard>
      <template #title>Roles & Permissions (Overview)</template>

      <template #actions>
        <v-btn variant="tonal" size="small" @click="refresh" :loading="loading">
          Refresh
        </v-btn>
      </template>

      <div class="ua-grid">
        <div class="ua-box">
          <div class="ua-box-title">Roles</div>
          <div class="ua-box-sub">User assigned roles</div>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-for="r in roles"
              :key="String(r?.name ?? r)"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ r?.name ?? r }}
            </v-chip>

            <div v-if="!roles.length" class="ua-muted">No roles</div>
          </div>
        </div>

        <div class="ua-box">
          <div class="ua-box-title">Direct Permissions</div>
          <div class="ua-box-sub">Permissions assigned directly to user</div>

          <div class="d-flex flex-wrap ga-2 mt-3">
            <v-chip
              v-for="p in directPermissions"
              :key="String(p?.name ?? p)"
              size="small"
              color="secondary"
              variant="tonal"
            >
              {{ p?.name ?? p }}
            </v-chip>

            <div v-if="!directPermissions.length" class="ua-muted">
              No direct permissions
            </div>
          </div>
        </div>
      </div>

      <div class="ua-divider" />

      <div class="ua-box">
        <div class="ua-box-title">Effective Permissions</div>
        <div class="ua-box-sub">
          Union of (role permissions) + (direct permissions)
        </div>

        <div class="d-flex flex-wrap ga-2 mt-3">
          <v-chip
            v-for="p in effectivePermissions"
            :key="p"
            size="small"
            color="primary"
            variant="outlined"
          >
            {{ p }}
          </v-chip>

          <div v-if="!effectivePermissions.length" class="ua-muted">
            No effective permissions
          </div>
        </div>
      </div>
    </ProfileSectionCard>

    <!-- Departments -->
    <ProfileSectionCard>
      <template #title>Departments</template>

      <div class="d-flex flex-wrap ga-2">
        <v-chip
          v-for="d in departments"
          :key="String(d?.id ?? d?.name ?? d)"
          size="small"
          variant="tonal"
        >
          {{ d?.name ?? d }}
        </v-chip>

        <div v-if="!departments.length" class="ua-muted">No departments</div>
      </div>
    </ProfileSectionCard>

    <!-- Edit dialog -->
    <v-dialog v-model="editOpen" max-width="760">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="text-subtitle-1 font-weight-bold">Genel Bilgiler — Düzenle</div>
          <v-btn icon="mdi-close" variant="text" @click="editOpen = false" />
        </v-card-title>

        <v-card-text>
          <v-alert v-if="editErr" type="error" variant="tonal" class="mb-4">
            {{ editErr }}
          </v-alert>

          <div class="ed-grid">
            <v-text-field v-model="form.title" label="Title" variant="outlined" hide-details />
            <v-text-field v-model="form.specialty" label="Specialty" variant="outlined" hide-details />

            <v-text-field
              v-model="form.daily_capacity"
              label="Daily Capacity"
              type="number"
              variant="outlined"
              hide-details
            />

            <v-text-field
              v-model="form.phone_number"
              label="Phone Number"
              variant="outlined"
              hide-details
            />

            <v-textarea
              v-model="form.address_line"
              label="Address"
              variant="outlined"
              rows="3"
              hide-details
            />

            <v-text-field v-model="form.national_id" label="National ID" variant="outlined" hide-details />
            <v-text-field v-model="form.passport_id" label="Passport ID" variant="outlined" hide-details />

            <v-text-field
              v-model="form.emergency_contact_name"
              label="Emergency Contact Name"
              variant="outlined"
              hide-details
            />

            <v-text-field
              v-model="form.emergency_contact_phone"
              label="Emergency Contact Phone"
              variant="outlined"
              hide-details
            />

            <v-textarea
              v-model="form.skills_text"
              label="Skills (virgül ile ayır)"
              variant="outlined"
              rows="2"
              hide-details
            />

            <v-switch
              v-model="form.is_active"
              inset
              color="primary"
              label="Active"
            />
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-5">
          <v-spacer />
          <v-btn variant="tonal" @click="editOpen = false">İptal</v-btn>
          <v-btn color="primary" :loading="savingProfile" @click="saveProfile">
            Kaydet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ProfileSectionCard from "@/components/profile/ProfileSectionCard.vue";
import {
  getUser,
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "../../services/user.api";

defineOptions({ name: "UserAccountPage" });

const route = useRoute();
const userId = computed(() => String(route.params.id ?? "").trim());

const loading = ref(false);
const user = ref<any | null>(null);

const loadingProfile = ref(false);
const profile = ref<UserProfile | null>(null);

const fetchUser = async () => {
  if (!userId.value) return;
  loading.value = true;
  try {
    user.value = await getUser(userId.value);
  } finally {
    loading.value = false;
  }
};

const fetchProfile = async () => {
  if (!userId.value) return;
  loadingProfile.value = true;
  try {
    profile.value = await getUserProfile(userId.value);
  } finally {
    loadingProfile.value = false;
  }
};

onMounted(async () => {
  await fetchUser();
  await fetchProfile();
});

const refresh = async () => {
  await fetchUser();
  await fetchProfile();
};

const roles = computed(() => (Array.isArray(user.value?.roles) ? user.value.roles : []));
const directPermissions = computed(() =>
  Array.isArray(user.value?.permissions) ? user.value.permissions : [],
);
const departments = computed(() =>
  Array.isArray(user.value?.departments) ? user.value.departments : [],
);

const effectivePermissions = computed<string[]>(() => {
  const set = new Set<string>();

  for (const p of directPermissions.value) {
    const name = String(p?.name ?? p ?? "").trim();
    if (name) set.add(name);
  }

  for (const r of roles.value) {
    const perms = Array.isArray(r?.permissions) ? r.permissions : [];
    for (const p of perms) {
      const name = String(p?.name ?? p ?? "").trim();
      if (name) set.add(name);
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// edit dialog
const editOpen = ref(false);
const editErr = ref("");
const savingProfile = ref(false);

const form = ref({
  title: "",
  specialty: "",
  skills_text: "",
  daily_capacity: "" as any,

  address_line: "",
  phone_number: "",

  national_id: "",
  passport_id: "",

  emergency_contact_name: "",
  emergency_contact_phone: "",

  is_active: true,
});

const openEdit = () => {
  editErr.value = "";
  const p = profile.value;

  form.value.title = String(p?.title ?? "");
  form.value.specialty = String(p?.specialty ?? "");

  form.value.daily_capacity =
    p?.daily_capacity === null || p?.daily_capacity === undefined
      ? ""
      : String(p.daily_capacity);

  form.value.address_line = String(p?.address_line ?? "");
  form.value.phone_number = String(p?.phone_number ?? "");

  form.value.national_id = String(p?.national_id ?? "");
  form.value.passport_id = String(p?.passport_id ?? "");

  form.value.emergency_contact_name = String(p?.emergency_contact_name ?? "");
  form.value.emergency_contact_phone = String(p?.emergency_contact_phone ?? "");

  const skills = Array.isArray(p?.skills) ? p!.skills! : [];
  form.value.skills_text = skills.filter(Boolean).join(", ");

  form.value.is_active = Boolean(p?.is_active ?? true);

  editOpen.value = true;
};

const saveProfile = async () => {
  if (!userId.value) return;
  if (savingProfile.value) return;

  savingProfile.value = true;
  editErr.value = "";
  try {
    const skills = (form.value.skills_text ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const dailyCapRaw = String(form.value.daily_capacity ?? "").trim();
    const daily_capacity =
      dailyCapRaw === "" ? null : Number.isFinite(Number(dailyCapRaw)) ? Number(dailyCapRaw) : null;

    await updateUserProfile(userId.value, {
      title: form.value.title.trim() || null,
      specialty: form.value.specialty.trim() || null,
      skills: skills.length ? skills : [],
      daily_capacity,

      address_line: form.value.address_line.trim() || null,
      phone_number: form.value.phone_number.trim() || null,

      national_id: form.value.national_id.trim() || null,
      passport_id: form.value.passport_id.trim() || null,

      emergency_contact_name: form.value.emergency_contact_name.trim() || null,
      emergency_contact_phone: form.value.emergency_contact_phone.trim() || null,

      is_active: Boolean(form.value.is_active),
    });

    editOpen.value = false;
    await fetchProfile();
  } catch (e: any) {
    editErr.value =
      e?.response?.data?.message ?? e?.message ?? "Profile update failed.";
  } finally {
    savingProfile.value = false;
  }
};
</script>

<style scoped>
.ua-page {
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

.ua-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--crm-space-4);
}

@media (min-width: 960px) {
  .ua-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.ua-box {
  border: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-06));
  padding: var(--crm-space-4);
}

.ua-box-title {
  font-size: var(--crm-text-md);
  font-weight: var(--crm-fw-bold);
}

.ua-box-sub {
  margin-top: 4px;
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-70);
}

.ua-muted {
  font-size: var(--crm-text-sm);
  opacity: var(--crm-alpha-70);
  padding: 6px 0;
}

.ua-divider {
  height: 1px;
  background: rgba(var(--v-theme-on-surface), var(--crm-alpha-12));
  margin: var(--crm-space-3) 0;
}

/* Genel Bilgiler */
.gi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--crm-space-2);
}

.gi-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: var(--crm-space-3);
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), var(--crm-alpha-08));
}

.gi-row:last-child {
  border-bottom: none;
}

.gi-k {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-bold);
  opacity: var(--crm-alpha-75);
}

.gi-v {
  font-size: var(--crm-text-sm);
}

.gi-pre {
  white-space: pre-wrap;
}

/* Edit dialog layout */
.ed-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--crm-space-3);
}

@media (min-width: 960px) {
  .ed-grid {
    grid-template-columns: 1fr 1fr;
  }
  .ed-grid :deep(.v-textarea) {
    grid-column: span 2;
  }
  .ed-grid :deep(.v-switch) {
    grid-column: span 2;
  }
}
</style>
