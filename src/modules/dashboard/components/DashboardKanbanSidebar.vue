<template>
  <KanbanSidebarShell>
    <template #title>
      <div class="kb-side-title">Saved Filters</div>
    </template>

    <template #title-append>
      <v-chip size="small" variant="tonal">{{ savedFilters.length }}</v-chip>
    </template>

    <template #body>
      <v-list-item
  v-for="f in savedFilters"
  :key="f.title"
  :title="f.title"
  class="kb-side-item"
>
  <template #append>
    <v-chip size="x-small" variant="tonal">{{ f.count }}</v-chip>
  </template>
</v-list-item>





      <div class="kb-side-divider" />

      <div class="kb-side-title mt-4">Filter Leads by</div>

      <v-text-field
        v-model="q"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="mt-3"
      />

      <div class="kb-side-title mt-4">System Defined Filters</div>

      <v-text-field
        v-model="systemSearch"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="mt-3"
      />

      <div class="kb-checks mt-3">
        <v-checkbox v-for="c in systemChecks" :key="c" :label="c" hide-details density="compact" />
      </div>

      <div class="kb-side-title mt-4">Website Activity</div>
      <div class="kb-checks mt-3">
        <v-checkbox v-for="c in websiteChecks" :key="c" :label="c" hide-details density="compact" />
      </div>
    </template>

    <template #footer>
      <v-btn block color="primary">
        Apply
      </v-btn>
    </template>
  </KanbanSidebarShell>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import KanbanSidebarShell from '@/components/kanban/KanbanSidebarShell.vue'

const q = ref('')
const systemSearch = ref('')

const savedFilters = [
  { title: 'irem NEW', count: 36 },
  { title: 'Orhan NEW', count: 0 },
  { title: 'Yasin NEW', count: 0 },
  { title: 'Şerife NEW', count: 43 },
]

const systemChecks = [
  'Touched Records',
  'Untouched Records',
  'Record Action',
  'Related Records Action',
  'Locked',
  'Latest Email Status',
  'Activities',
  'Cadences',
]

const websiteChecks = [
  'Average Time Spent (Minutes)',
  'Days Visited',
  'First Page Visited',
]
</script>
