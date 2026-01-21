<template>
  <div class="kb-toolbar d-flex align-center justify-space-between">
    <div class="kb-left d-flex align-center ga-3">
      <!-- ✅ Override isteyen sayfa varsa slot ile ezebilir -->
      <slot name="left">
        <!-- ✅ Seçim varsa: Edit + Actions -->
        <template v-if="hasSelection">
          <v-btn variant="tonal" class="kb-edit">
            Edit
          </v-btn>

          <v-menu location="bottom start">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="tonal">
                Actions
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list density="comfortable">
              <v-list-item title="Güncelle" />
              <v-list-item title="Sahip Değiştir" />
              <v-list-item title="Sil" />
              <v-list-item title="Dışa Aktar" />
            </v-list>
          </v-menu>
        </template>

        <!-- ✅ Seçim yoksa: All Leads + pencil -->
        <template v-else>
          <v-menu location="bottom start">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="tonal">
                All Leads
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list density="comfortable">
              <v-list-item title="All Leads" />
              <v-list-item title="My Leads" />
              <v-list-item title="Unassigned" />
            </v-list>
          </v-menu>

          <v-btn icon variant="text" aria-label="Edit list">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
      </slot>
    </div>

    <div class="kb-right d-flex align-center ga-3">
      <!-- ✅ Override isteyen sayfa varsa slot ile ezebilir -->
      <slot name="right">
        <!-- ✅ seçim varsa sağ taraf komple gizli -->
        <template v-if="!hasSelection">
          <div class="d-flex align-center ga-2">
            <span class="kb-muted">Layouts</span>
            <v-menu location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="tonal">
                  Standard
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list density="comfortable">
                <v-list-item title="Standard" />
                <v-list-item title="Compact" />
              </v-list>
            </v-menu>
          </div>

          <div class="d-flex align-center ga-2">
            <span class="kb-muted">Sort By</span>
            <v-menu location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="tonal">
                  Created Time
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list density="comfortable">
                <v-list-item title="Created Time" />
                <v-list-item title="Updated Time" />
              </v-list>
            </v-menu>

            <v-btn variant="tonal">
              Desc
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
          </div>

          <v-btn color="primary" prepend-icon="mdi-plus">
            Create Lead
          </v-btn>

          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="tonal">
                Actions
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list density="comfortable">
              <v-list-item title="Export" />
              <v-list-item title="Import" />
            </v-list>
          </v-menu>
        </template>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hasSelection?: boolean
}>()
</script>

<style scoped>
.kb-toolbar {
  gap: var(--crm-space-4);
  margin-bottom: var(--crm-space-4);
}

.kb-toolbar :deep(.v-btn) {
  /* ✅ biraz daha kısa (Zoho hissi) */
  height: calc(var(--crm-control-h) - var(--crm-space-2));
  min-height: calc(var(--crm-control-h) - var(--crm-space-2));
  font-weight: var(--crm-fw-medium);
}

.kb-toolbar :deep(.v-icon) {
  color: currentColor;
}

.kb-toolbar :deep(.kb-muted) {
  font-size: var(--crm-text-sm);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-60), transparent);
}

.kb-edit {
  font-weight: var(--crm-fw-medium);
}
</style>
