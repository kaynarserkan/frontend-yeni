<template>
  <v-card class="dt-card" flat>
    <v-card-text>
      <!-- Header row: title + actions -->
      <div class="dt-head d-flex align-center justify-space-between">
        <div v-if="title" class="dt-title">
          {{ title }}
        </div>

        <div class="d-flex align-center ga-3">
          <!-- Export dropdown -->
          <v-menu v-if="showExport" location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="tonal"
                color="primary"
                class="dt-btn"
                prepend-icon="mdi-tray-arrow-up"
              >
                {{ exportText }}
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list density="comfortable">
              <v-list-item title="Export CSV" @click="onExport('csv')" />
              <v-list-item title="Export Excel" @click="onExport('xlsx')" />
            </v-list>
          </v-menu>

          <!-- Add button -->
          <v-btn
            v-if="showAdd"
            color="primary"
            class="dt-btn"
            prepend-icon="mdi-plus"
            @click="emit('add')"
          >
            {{ addText }}
          </v-btn>

          <!-- extra actions slot -->
          <slot name="header-actions" />
        </div>
      </div>

      <!-- Filters row -->
      <div class="dt-toolbar d-flex flex-column flex-md-row ga-3 align-md-center justify-space-between mt-4">
        <div class="dt-left d-flex flex-column flex-md-row ga-3 align-md-center">
          <v-text-field
            v-model="localSearch"
            :label="searchLabel"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="dt-search"
          />
        </div>

        <div class="dt-right d-flex flex-column flex-sm-row ga-3">
          <v-autocomplete
            v-if="filterKey && filterOptions.length"
            v-model="localFilter"
            :items="filterOptions"
            item-title="title"
            item-value="value"
            :label="filterLabel"
            clearable
            hide-details
            class="dt-filter"
          />

          <slot name="toolbar-actions" />
        </div>
      </div>

      <!-- Table -->
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="loading"
        :items-per-page="itemsPerPage"
        class="dt-table mt-4"
        density="comfortable"
        hover
      >
        <template #loading>
          <div class="py-6 text-center">
            Loading...
          </div>
        </template>

        <template #no-data>
          <div class="py-6 text-center">
            {{ emptyText }}
          </div>
        </template>

        <!-- Name cell (avatar + name + subtitle) -->
        <template v-if="enableNameAvatar" #[`item.${nameKeyResolved}`]="{ item }">
          <div class="dt-name d-flex align-center ga-3">
            <v-avatar size="36" class="dt-avatar">
              <template v-if="item?.[avatarKeyResolved]">
                <v-img :src="item[avatarKeyResolved]" cover />
              </template>
              <template v-else>
                <span class="dt-initials">{{ getInitials(String(item?.[nameKeyResolved] ?? '')) }}</span>
              </template>
            </v-avatar>

            <div class="dt-name-text">
              <div class="dt-name-title">{{ item?.[nameKeyResolved] }}</div>
              <div v-if="subtitleKeyResolved && item?.[subtitleKeyResolved]" class="dt-name-sub">
                {{ item?.[subtitleKeyResolved] }}
              </div>
            </div>
          </div>
        </template>

        <!-- Actions cell (kebab menu) -->
        <template v-if="actions.length" #[`item.${actionsKeyResolved}`]="{ item }">
          <div class="d-flex justify-end">
            <v-menu location="bottom end">
              <template #activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  icon
                  variant="text"
                  class="dt-action-btn"
                  aria-label="Row actions"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list density="comfortable" class="dt-actions">
                <v-list-item
                  v-for="a in actions"
                  :key="a.key"
                  :title="a.label"
                  :class="a.danger ? 'dt-danger' : undefined"
                  @click="emit('action', { key: a.key, item })"
                />
              </v-list>
            </v-menu>

            <v-btn
              v-if="showEditIcon"
              icon
              variant="text"
              class="dt-action-btn"
              aria-label="Edit"
              @click="emit('edit', item)"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </div>
        </template>

        <!-- Cell slots passthrough (kullanıcı custom slot yazarsa bozmadan çalışsın) -->
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type Header = {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: string | number
}

type FilterOption = {
  title: string
  value: string | number
}

type RowAction = {
  key: string
  label: string
  danger?: boolean
}

type ExportFormat = 'csv' | 'xlsx'

const props = defineProps<{
  title?: string
  headers: Header[]
  items: Record<string, any>[]
  loading?: boolean

  // Search
  searchLabel?: string
  searchModelValue?: string

  // Filter (searchable dropdown)
  filterKey?: string
  filterLabel?: string
  filterItems?: Array<string | number | FilterOption>
  filterModelValue?: string | number | null

  // Table options (local)
  itemsPerPage?: number
  emptyText?: string

  // Header actions
  showAdd?: boolean
  addText?: string
  showExport?: boolean
  exportText?: string

  // Name cell avatar
  enableNameAvatar?: boolean
  nameKey?: string
  subtitleKey?: string
  avatarKey?: string

  // Row actions column
  actionsKey?: string
  actions?: RowAction[]
  showEditIcon?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:searchModelValue', v: string): void
  (e: 'update:filterModelValue', v: string | number | null): void

  (e: 'add'): void
  (e: 'export', payload: { format: ExportFormat }): void

  (e: 'action', payload: { key: string; item: any }): void
  (e: 'edit', item: any): void
}>()

const localSearch = ref(props.searchModelValue ?? '')
const localFilter = ref<string | number | null>(props.filterModelValue ?? null)

watch(
  () => props.searchModelValue,
  v => {
    if (typeof v === 'string' && v !== localSearch.value)
      localSearch.value = v
  },
)

watch(
  () => props.filterModelValue,
  v => {
    if (v !== localFilter.value)
      localFilter.value = v ?? null
  },
)

watch(localSearch, v => emit('update:searchModelValue', v))
watch(localFilter, v => emit('update:filterModelValue', v))

const filterOptions = computed<FilterOption[]>(() => {
  const raw = props.filterItems ?? []
  return raw.map(it => {
    if (typeof it === 'string' || typeof it === 'number')
      return { title: String(it), value: it }
    return { title: it.title, value: it.value }
  })
})

const searchLabel = computed(() => props.searchLabel ?? 'Search')
const filterLabel = computed(() => props.filterLabel ?? 'Filter')
const itemsPerPage = computed(() => props.itemsPerPage ?? 10)
const emptyText = computed(() => props.emptyText ?? 'No records found')
const loading = computed(() => props.loading ?? false)

const showAdd = computed(() => props.showAdd ?? false)
const addText = computed(() => props.addText ?? 'Add New Record')
const showExport = computed(() => props.showExport ?? false)
const exportText = computed(() => props.exportText ?? 'Export')

const enableNameAvatar = computed(() => props.enableNameAvatar ?? false)
const nameKeyResolved = computed(() => (props.nameKey ?? 'name').trim())
const subtitleKeyResolved = computed(() => (props.subtitleKey ?? '').trim() || undefined)
const avatarKeyResolved = computed(() => (props.avatarKey ?? 'avatar').trim())

const actionsKeyResolved = computed(() => (props.actionsKey ?? 'actions').trim())
const actions = computed<RowAction[]>(() => props.actions ?? [])
const showEditIcon = computed(() => props.showEditIcon ?? false)

const onExport = (format: ExportFormat) => {
  emit('export', { format })
}

const getInitials = (fullName: string) => {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase()
}

const filteredItems = computed(() => {
  const items = Array.isArray(props.items) ? props.items : []
  const q = (localSearch.value ?? '').toString().trim().toLowerCase()
  const fk = props.filterKey?.toString().trim()
  const fv = localFilter.value

  return items.filter(row => {
    // Dropdown filter
    if (fk && fv !== null && fv !== undefined && fv !== '') {
      const rowVal = row?.[fk]
      if (String(rowVal) !== String(fv))
        return false
    }

    // Search filter (across all primitive values)
    if (!q)
      return true

    const values = Object.values(row ?? {})
    return values.some(v => {
      if (v === null || v === undefined)
        return false

      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
        return String(v).toLowerCase().includes(q)

      return false
    })
  })
})
</script>

<style scoped>
.dt-card {
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  box-shadow: 0 var(--crm-shadow-y) var(--crm-shadow-blur)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
}

.dt-head {
  min-height: var(--crm-head-h);
}

.dt-title {
  font-size: var(--crm-text-md);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.dt-btn {
  height: var(--crm-control-h);
  font-weight: var(--crm-fw-medium);
}

.dt-search {
  min-width: var(--crm-field-min-w);
}

.dt-filter {
  min-width: var(--crm-field-min-w);
}

.dt-table :deep(th) {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-85), transparent);
  padding-top: calc(var(--crm-table-cell-py) - var(--crm-space-1));
  padding-bottom: calc(var(--crm-table-cell-py) - var(--crm-space-1));
  padding-left: var(--crm-table-cell-px);
  padding-right: var(--crm-table-cell-px);
}

/* Zebra rows (1. satır BEYAZ başlasın) */
.dt-table :deep(tbody tr:nth-child(odd)) {
  background: var(--crm-table-row-even) !important; /* ✅ 1,3,5... */
}
.dt-table :deep(tbody tr:nth-child(even)) {
  background: var(--crm-table-row-odd) !important;  /* ✅ 2,4,6... */
}

/* Header bold (Vuetify internal header title'ı da yakala) */
.dt-table :deep(th),
.dt-table :deep(.v-data-table__th),
.dt-table :deep(.v-data-table-header__content) {
  font-weight: var(--crm-fw-xbold) !important;
}

/* Name cell: Mehmet Kaya ↔ Subtitle arası boşluğu azalt */
.dt-name {
  align-items: center !important; /* d-flex align-center override */
}

.dt-avatar {
  margin-top: var(--crm-space-1);
}

.dt-name-title {
  font-size: var(--crm-text-md);
  font-weight: var(--crm-fw-bold);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-88), transparent);
  line-height: 1.15;
}

.dt-name-sub {
  font-size: var(--crm-text-xs);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-55), transparent);
  margin-top: 0;            /* ✅ boşluk kapandı */
  line-height: 1.15;        /* ✅ daha sıkı */
}

.dt-initials {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-primary));
}

.dt-action-btn {
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-70), transparent);
}

.dt-actions :deep(.v-list-item-title) {
  font-size: var(--crm-text-sm);
}

.dt-danger :deep(.v-list-item-title) {
  color: rgb(var(--v-theme-accent));
  font-weight: var(--crm-fw-bold);
}

</style>
