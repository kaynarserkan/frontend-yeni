<template>
  <div class="kb-side">
    <div class="kb-side-header d-flex align-center justify-space-between">
      <slot name="title" />
      <slot name="title-append" />
    </div>

    <div v-if="$slots.body" class="kb-side-body">
      <slot name="body" />
    </div>

    <div v-if="$slots.footer" class="kb-side-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// shared shell: içerik tamamen slot ile gelir
</script>

<style scoped>
.kb-side {
  display: flex;
  flex-direction: column;

  /* drawer iç yüksekliğini doldur */
  height: 100%;
  min-height: 0;

  /* ✅ içerik kenara yapışmasın */
  padding: var(--crm-space-4);
}


/* Header: tek satırda kalsın, taşmayı düzgün yönet */
.kb-side-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-3);

  flex-wrap: nowrap;
  min-width: 0;
  margin-bottom: var(--crm-space-3);

  /* içerik padding burada (scrollbar değil) */
  padding: var(--crm-space-5) var(--crm-space-5) 0;
}

/* slot içerikleri daralabilsin */
.kb-side-header :deep(*) {
  min-width: 0;
}

.kb-side-body {
  display: flex;
  flex-direction: column;

  /* scroll'u drawer yapsın (tek scrollbar) */
  flex: 1;
  min-height: 0;
  overflow-y: visible;
}

/* Divider standardı (module değil shell belirler) */
.kb-side-body :deep(.kb-side-divider) {
  height: 1px;
  background: color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  margin: var(--crm-space-4) 0;
}

/* ===== Saved Filters list fix (Vuetify structure bozulmadan) ===== */
.kb-side-body :deep(.kb-side-list) {
  padding: 0;
  margin: 0;
}

.kb-side-body :deep(.kb-side-list .v-list-item) {
  min-height: 40px; /* satır yüksekliği sabit */
}

/* content alanı daralabilsin */
.kb-side-body :deep(.kb-side-list .v-list-item__content) {
  min-width: 0;
}

/* title taşarsa ellipsis */
.kb-side-body :deep(.kb-side-list .v-list-item-title) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* append chip ortalı dursun */
.kb-side-body :deep(.kb-side-list .v-list-item__append) {
  align-self: center;
}

.kb-side-footer {
  /* footer padding burada; scrollbar sınırda kalır */
  padding: 0 var(--crm-space-5) var(--crm-space-5);
}

</style>
