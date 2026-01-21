<template>
  <div class="kb-toolbar d-flex align-center justify-space-between">
    <div class="kb-left d-flex align-center ga-3">
      <slot name="left">
        <!-- ✅ Seçim varsa: SADECE Actions -->
        <template v-if="hasSelection">
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

          <v-btn color="primary" prepend-icon="mdi-plus"> Create Lead </v-btn>

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
  hasSelection?: boolean;
}>();
</script>

<style scoped>
/* ===============================
   ✅ TOOLBAR — DAHA DA KÜÇÜK (24px)
   =============================== */

.kb-toolbar {
  gap: 6px;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 6px;
  min-height: 26px;
  align-items: center;
}

/* ✅ Asıl hedef: butonların yüksekliği + fontu */
.kb-toolbar :deep(.v-btn) {
  height: 24px;
  min-height: 24px;

  /* iç boşlukları küçült */
  padding-inline: 10px;
  padding-top: 0;
  padding-bottom: 0;

  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0;
}

/* ✅ Buton iç content bazen ekstra height veriyor, onu da sık */
.kb-toolbar :deep(.v-btn__content) {
  line-height: 1;
}

/* ✅ Prepend/append icon aralıkları küçülsün */
.kb-toolbar :deep(.v-btn__prepend),
.kb-toolbar :deep(.v-btn__append) {
  margin-inline: 4px;
}

/* ✅ Icon butonlar (pencil vb) */
.kb-toolbar :deep(.v-btn--icon) {
  width: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0;
}

/* ✅ Icon boyutu küçülsün */
.kb-toolbar :deep(.v-icon) {
  font-size: 14px;
  color: currentColor;
}

/* ✅ Toolbar label/text küçülsün */
.kb-toolbar :deep(.kb-muted),
.kb-toolbar span {
  font-size: 11px;
  line-height: 1;
}

/* ✅ Dropdown list */
.kb-toolbar :deep(.v-list-item-title) {
  font-size: 11px;
}
</style>
