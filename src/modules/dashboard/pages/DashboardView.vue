<!-- C:\dev\crm\frontend_pure\src\modules\dashboard\pages\DashboardView.vue -->
<template>
  <div class="dash-page">
    <!-- Header -->
    <div class="dash-head">
      <div>
        <h1 class="dash-title">Dashboard</h1>
        <p class="dash-sub">Özet görünüm</p>
      </div>

      <div class="d-flex align-center ga-2">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-dock-left"
          size="small"
          density="compact"
          @click="openLeft()"
        >
          Left Panel
        </v-btn>

        <v-btn
          variant="tonal"
          prepend-icon="mdi-dock-right"
          size="small"
          density="compact"
          @click="openRight()"
        >
          Right Panel
        </v-btn>

        <v-btn
          variant="tonal"
          prepend-icon="mdi-message-text-outline"
          size="small"
          density="compact"
          @click="openDialog()"
        >
          Dialog
        </v-btn>

        <v-btn
          variant="tonal"
          prepend-icon="mdi-refresh"
          size="small"
          density="compact"
        >
          Refresh
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          density="compact"
        >
          New Lead
        </v-btn>
      </div>
    </div>

    <!-- Stats -->
    <div class="dash-grid">
      <div class="dash-card">
        <div class="dash-card-top">
          <span class="dash-label">Total Leads</span>
          <v-icon size="18">mdi-account-multiple-outline</v-icon>
        </div>
        <div class="dash-value">128</div>
        <div class="dash-muted">+12 this week</div>
      </div>

      <div class="dash-card">
        <div class="dash-card-top">
          <span class="dash-label">Open Tasks</span>
          <v-icon size="18">mdi-checkbox-marked-outline</v-icon>
        </div>
        <div class="dash-value">19</div>
        <div class="dash-muted">3 overdue</div>
      </div>

      <div class="dash-card">
        <div class="dash-card-top">
          <span class="dash-label">Appointments</span>
          <v-icon size="18">mdi-calendar-month-outline</v-icon>
        </div>
        <div class="dash-value">6</div>
        <div class="dash-muted">next 7 days</div>
      </div>

      <div class="dash-card">
        <div class="dash-card-top">
          <span class="dash-label">Revenue</span>
          <v-icon size="18">mdi-cash-multiple</v-icon>
        </div>
        <div class="dash-value">€8.4k</div>
        <div class="dash-muted">this month</div>
      </div>
    </div>

    <!-- Content -->
    <div class="dash-two">
      <div class="dash-panel">
        <div class="dash-panel-head">
          <div class="dash-panel-title">Recent Leads</div>
          <v-btn variant="text" size="small" density="compact">View all</v-btn>
        </div>

        <div class="dash-list">
          <div v-for="x in recentLeads" :key="x.id" class="dash-row">
            <div class="dash-row-main">
              <div class="dash-row-title">{{ x.name }}</div>
              <div class="dash-row-sub">{{ x.owner }} • {{ x.source }}</div>
            </div>
            <v-chip size="small" class="dash-chip">{{ x.stage }}</v-chip>
          </div>
        </div>
      </div>

      <div class="dash-panel">
        <div class="dash-panel-head">
          <div class="dash-panel-title">Today’s Tasks</div>
          <v-btn variant="text" size="small" density="compact">View all</v-btn>
        </div>

        <div class="dash-list">
          <div v-for="t in tasks" :key="t.id" class="dash-row">
            <div class="dash-row-main">
              <div class="dash-row-title">{{ t.title }}</div>
              <div class="dash-row-sub">{{ t.time }} • {{ t.assignee }}</div>
            </div>
            <v-chip
              size="small"
              :class="['dash-chip', t.priority === 'High' ? 'is-high' : '']"
            >
              {{ t.priority }}
            </v-chip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OverlayTestPanel from "@/modules/dashboard/components/OverlayTestPanel.vue";
import { useLayoutOverlayStore } from "@/core/layout/layoutOverlay.store";

const overlay = useLayoutOverlayStore();

const openLeft = () => {
  overlay.openLeft({
    component: OverlayTestPanel,
    props: {
      title: "Left Off-canvas",
      text: "Bu içerik sayfadan geldi. Sonra buraya Service Create Form vs. koyacağız.",
      onClose: () => overlay.closeLeft(),
      onAction: () => alert("Left action"),
    },
  });
};

const openRight = () => {
  overlay.openRight({
    component: OverlayTestPanel,
    props: {
      title: "Right Off-canvas",
      text: "Bu içerik sayfadan geldi. Sonra buraya Edit Form / Details Panel koyabiliriz.",
      onClose: () => overlay.closeRight(),
      onAction: () => alert("Right action"),
    },
  });
};

const openDialog = () => {
  overlay.openDialog({
    title: "Popup Dialog",
    component: OverlayTestPanel,
    props: {
      title: "Dialog Content",
      text: "Bu da popup dialog. Confirm/Preview gibi işler için ideal.",
      onClose: () => overlay.closeDialog(),
      onAction: () => alert("Dialog action"),
    },
  });
};

type RecentLead = {
  id: number;
  name: string;
  owner: string;
  source: string;
  stage: string;
};

type Task = {
  id: number;
  title: string;
  time: string;
  assignee: string;
  priority: "Low" | "Normal" | "High";
};

const recentLeads: RecentLead[] = [
  {
    id: 1,
    name: "Halima Umir",
    owner: "Osman",
    source: "Website",
    stage: "Not Responding",
  },
  {
    id: 2,
    name: "Gifty Yeboah",
    owner: "Osman",
    source: "Website",
    stage: "İlgilenmiyor",
  },
  {
    id: 3,
    name: "TL Hardie",
    owner: "Osman",
    source: "Website",
    stage: "Fotoğraf Gönderecek",
  },
  {
    id: 4,
    name: "Kayley Parker",
    owner: "Osman",
    source: "Website",
    stage: "WP Sent / NR1",
  },
];

const tasks: Task[] = [
  {
    id: 1,
    title: "Call lead: Halima",
    time: "10:30",
    assignee: "Osman",
    priority: "High",
  },
  {
    id: 2,
    title: "Send WhatsApp follow-up",
    time: "12:00",
    assignee: "Osman",
    priority: "Normal",
  },
  {
    id: 3,
    title: "Check clinic availability",
    time: "15:00",
    assignee: "Admin",
    priority: "Low",
  },
];
</script>

<style scoped>
.dash-page {
  padding: var(--crm-space-4);
  height: calc(100vh - 64px);
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-4);
}

/* Header */
.dash-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--crm-space-4);
}

.dash-title {
  font-size: 20px;
  font-weight: var(--crm-fw-xbold);
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.dash-sub {
  margin: 6px 0 0;
  font-size: var(--crm-text-sm);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}

/* Stats cards */
.dash-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--crm-space-3);
}

@media (max-width: 1200px) {
  .dash-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
}

.dash-card {
  border: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  background: rgb(var(--v-theme-surface));
  border-radius: var(--crm-radius-sm, var(--crm-space-1));
  padding: var(--crm-space-4);
  box-shadow: 0 var(--crm-shadow-y) calc(var(--crm-shadow-blur) * 0.7)
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-10),
      transparent
    );
}

.dash-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dash-label {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-bold);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-70),
    transparent
  );
}

.dash-value {
  margin-top: 10px;
  font-size: 22px;
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.dash-muted {
  margin-top: 6px;
  font-size: var(--crm-text-xs);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-55),
    transparent
  );
}

/* Panels */
.dash-two {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--crm-space-3);
}

@media (max-width: 1200px) {
  .dash-two {
    grid-template-columns: 1fr;
  }
}

.dash-panel {
  border: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-12),
      transparent
    );
  background: rgb(var(--v-theme-surface));
  border-radius: var(--crm-radius-sm, var(--crm-space-1));
  padding: var(--crm-space-4);
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.dash-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--crm-space-2);
}

.dash-panel-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.dash-list {
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-2);
  padding-right: 2px;
}

.dash-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--crm-space-3);
  padding: var(--crm-space-3);
  border-radius: 12px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 6%, transparent);
  border: 1px solid
    color-mix(
      in srgb,
      rgb(var(--v-theme-secondary)) var(--crm-alpha-08),
      transparent
    );
}

.dash-row-title {
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-bold);
  color: rgb(var(--v-theme-on-surface));
}

.dash-row-sub {
  margin-top: 4px;
  font-size: var(--crm-text-xs);
  color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) var(--crm-alpha-60),
    transparent
  );
}

.dash-chip {
  font-weight: var(--crm-fw-medium);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 14%, transparent);
  color: rgb(var(--v-theme-on-surface));
}

.dash-chip.is-high {
  background: color-mix(in srgb, rgb(var(--v-theme-error)) 18%, transparent);
}
</style>
