<template>
  <div class="kb-page">
<KanbanToolbar :has-selection="hasSelection"></KanbanToolbar>


    <div class="kb-board-wrap">
    <KanbanBoard
  :columns="columns"
  item-key="id"
  :enable-selection="true"
  @selection-change="onSelectionChange"
>

        <template #column-actions>
          <v-btn icon variant="text" aria-label="Column actions">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

                     <template #card="{ item }">

          <div>
            <div class="kb-card-title">
              {{ item.name }}
            </div>

            <div class="kb-card-meta">
              <div>{{ item.owner }}</div>
              <div class="kb-card-sub">{{ item.email }}</div>
            </div>

            <div class="d-flex align-center justify-space-between mt-2">
              <div class="d-flex align-center ga-2">
                <v-chip size="small" class="kb-tag kb-tag--source">
                  {{ item.source }}
                </v-chip>
                <v-chip size="small" class="kb-tag kb-tag--stage">
                  {{ item.stage }}
                </v-chip>
              </div>
            </div>

            <div class="kb-card-foot">
              <div class="d-flex align-center ga-2">
                <span>{{ item.phone }}</span>

                <v-btn
                  icon
                  variant="text"
                  class="kb-mini-btn"
                  size="small"
                  density="compact"
                  aria-label="Call"
                >
                  <v-icon>mdi-phone-outline</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </template>


        <template #column-footer>
          <v-btn variant="text" class="kb-add" prepend-icon="mdi-plus">
            Create Lead
          </v-btn>
        </template>
      </KanbanBoard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KanbanToolbar from '@/components/kanban/KanbanToolbar.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'


type LeadCard = {
  id: number
  name: string
  owner: string
  email: string
  phone: string
  source: string
  stage: string
}

type KanbanColumn = {
  key: string
  title: string
  items: LeadCard[]
}

const hasSelection = ref(false)

const onSelectionChange = (payload: { selectedIds: Set<string | number>; hasSelection: boolean }) => {
  hasSelection.value = payload.hasSelection
}

const columns: KanbanColumn[] = [
  {
    key: 'not-responding',
    title: 'Not Responding',
    items: [
      {
        id: 1,
        name: 'Halima Umir',
        owner: 'Osman Berat Tunçtan',
        email: 'halima.99@hotmail.co.uk',
        phone: '+44 7398235081',
        source: 'Website',
        stage: 'Not Responding',
      },
      {
        id: 2,
        name: 'dsdwwd',
        owner: 'Osman Berat Tunçtan',
        email: '—',
        phone: '+90 533 198 36 89',
        source: 'Manychat',
        stage: 'Not Responding',
      },
      {
        id: 2,
        name: 'dsdwwd',
        owner: 'Osman Berat Tunçtan',
        email: '—',
        phone: '+90 533 198 36 89',
        source: 'Manychat',
        stage: 'Not Responding',
      },
      {
        id: 2,
        name: 'dsdwwd',
        owner: 'Osman Berat Tunçtan',
        email: '—',
        phone: '+90 533 198 36 89',
        source: 'Manychat',
        stage: 'Not Responding',
      },
      {
        id: 2,
        name: 'dsdwwd',
        owner: 'Osman Berat Tunçtan',
        email: '—',
        phone: '+90 533 198 36 89',
        source: 'Manychat',
        stage: 'Not Responding',
      },
    ],
  },
  {
    key: 'uninterested',
    title: 'İlgilenmiyor',
    items: [
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
      {
        id: 3,
        name: 'Gifty yeboah',
        owner: 'Osman Berat Tunçtan',
        email: 'giftyyeboah1@yahoo.com',
        phone: '+44 7949393883',
        source: 'Website',
        stage: 'İlgilenmiyor',
      },
    ],
  },
  {
    key: 'photo',
    title: 'Fotoğraf Gönderecek',
    items: [
      {
        id: 4,
        name: 'TL Hardie',
        owner: 'Osman Berat Tunçtan',
        email: 'tarynleehardie@gmail.com',
        phone: '+44 7455606873',
        source: 'Website',
        stage: 'Fotoğraf Gönderecek',
      },
    ],
  },
  {
    key: 'wp-sent',
    title: 'WP Sent / NR1',
    items: [
      {
        id: 5,
        name: 'arzuural',
        owner: 'Osman Berat Tunçtan',
        email: '—',
        phone: '+90 5402233536',
        source: 'Website',
        stage: 'WP Sent / NR1',
      },
      {
        id: 6,
        name: 'Kayley Parker',
        owner: 'Osman Berat Tunçtan',
        email: 'kayleyparker@live.com',
        phone: '—',
        source: 'Website',
        stage: 'WP Sent / NR1',
      },
    ],
  },
  {
    key: 'wp-sent-2',
    title: 'WP Sent 2 / NR2',
    items: [],
  },
  {
    key: 'no-answer',
    title: 'No Answer',
    items: [],
  },
  {
    key: 'follow-up',
    title: 'Follow Up',
    items: [],
  },
  {
    key: 'won',
    title: 'Won',
    items: [],
  },
  {
    key: 'lost',
    title: 'Lost',
    items: [],
  },
]
</script>


<style scoped>
.kb-page {
  padding: var(--crm-space-2);

  height: calc(100vh - 64px); /* app-bar 64 */
  min-height: 0;

  display: flex;
  flex-direction: column;
}

.kb-board-wrap {
  flex: 1;
  min-height: 0;
}

/* ✅ sayfa seviyesinde sadece “domain content” stilleri kalsın */
.kb-card-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: var(--crm-space-2);
}

.kb-card-meta {
  font-size: var(--crm-text-sm);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-85), transparent);
}

.kb-card-sub {
  font-size: var(--crm-text-xs);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-60), transparent);
  margin-top: 2px;
}

.kb-tag {
  font-weight: var(--crm-fw-medium);
  border-radius: 999px;
  height: 24px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 12%, transparent);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 88%, transparent);
}

.kb-tag--source {
  background: color-mix(in srgb, rgb(var(--v-theme-info)) 22%, transparent);
  color: rgb(var(--v-theme-on-surface));
}

.kb-tag--stage {
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
  color: rgb(var(--v-theme-on-surface));
}

.kb-mini-btn {
  width: var(--crm-icon-btn-sm);
  height: var(--crm-icon-btn-sm);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-70), transparent);
}

.kb-card-foot {
  margin-top: var(--crm-space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--crm-text-xs);
  color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) var(--crm-alpha-70), transparent);
}

.kb-add {
  justify-content: flex-start;
  font-weight: var(--crm-fw-medium);
  color: rgb(var(--v-theme-primary));
}
</style>
