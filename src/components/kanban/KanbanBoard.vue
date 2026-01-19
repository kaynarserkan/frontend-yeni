<template>
  <div class="kb-board">
  <div class="kb-columns">
  <div
    v-for="(col, idx) in columns"
    :key="col.key"
    class="kb-col-wrap"
    :class="{
      'kb-col--scroll': scrollCols.has(col.key),
      'kb-col--gap-right': shouldGapRight(idx),
      'kb-col--divider-right': shouldDividerRight(idx),
    }"
  >
    <div class="kb-col">
      <div class="kb-col-head">
        <div class="d-flex align-center justify-space-between">
          <div class="kb-col-title">
            <span>{{ col.title }}</span>
            <span class="kb-count">{{ col.items.length }}</span>
          </div>

          <slot name="column-actions" :column="col" />
        </div>
      </div>

      <div class="kb-col-body" :ref="el => setColBodyRef(col.key, el)">
        <div class="kb-col-body-inner">
          <template v-for="card in col.items" :key="(card as any)?.[itemKey ?? 'id']">
            <slot name="card" :item="card" :column="col" />
          </template>

          <div v-if="$slots['column-footer']" class="kb-col-footer">
            <slot name="column-footer" :column="col" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

type KanbanColumn<T> = {
  key: string
  title: string
  items: T[]
}

const props = defineProps<{
  columns: Array<KanbanColumn<any>>
  itemKey?: string
}>()

const bodyRefs = new Map<string, HTMLElement>()
const scrollCols = ref(new Set<string>())

const setColBodyRef = (key: string, el: Element | { $el?: unknown } | null) => {
  if (!el) {
    bodyRefs.delete(key)
    return
  }

  // Vue template ref bazen component instance döndürebilir
  const rawEl = (el as any)?.$el ? (el as any).$el : el

  if (rawEl instanceof HTMLElement)
    bodyRefs.set(key, rawEl)
}



const calcScrollCols = () => {
  const next = new Set<string>()

  for (const [key, el] of bodyRefs.entries()) {
    // body içinde footer dahil olduğu için: overflow var mı kontrol
    const hasOverflow = el.scrollHeight > el.clientHeight + 1
    if (hasOverflow)
      next.add(key)
  }

  scrollCols.value = next
}

const shouldGapRight = (idx: number) => {
  const a = props.columns[idx]
  const b = props.columns[idx + 1]
  if (!a || !b) return false

  // KURAL: iki kolon da scroll DEĞİLSE arada boşluk olsun
  return !scrollCols.value.has(a.key) && !scrollCols.value.has(b.key)
}

const shouldDividerRight = (idx: number) => {
  const a = props.columns[idx]
  const b = props.columns[idx + 1]
  if (!a || !b) return false

  // KURAL: iki kolon arasında boşluk YOKSA divider olsun (scroll varsa)
  return !shouldGapRight(idx)
}

let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  calcScrollCols()

  ro = new ResizeObserver(() => calcScrollCols())
  for (const el of bodyRefs.values())
    ro.observe(el)

  window.addEventListener('resize', calcScrollCols)
})

onUnmounted(() => {
  if (ro) ro.disconnect()
  window.removeEventListener('resize', calcScrollCols)
})

// kolon sayısı / item sayısı değişince yeniden ölç
watch(
  () => props.columns,
  async () => {
    await nextTick()
    calcScrollCols()
  },
  { deep: true },
)
</script>

<style scoped>
.kb-board {
  /* ✅ Zoho hissi: scrollbar için fiziksel boşluk (gutter) */
  --kb-scrollbar-gutter: var(--crm-space-4);

  /* yatay scroll */
  overflow-x: auto;
  padding-bottom: var(--crm-space-3);

  /* dikey alanı parent belirler; board o alanı doldurur */
  height: 100%;
}

.kb-columns {
  display: flex;
  align-items: stretch;
  gap: 0;
  height: 100%;
}

/* ✅ Kolon wrapper: kolonun SAĞINDA scroll-gutter ayıracağımız katman */
.kb-col-wrap {
  width: 320px;
  flex: 0 0 320px;
  height: 100%;
  display: flex;
}

/* scroll varsa: kolon + gutter kadar yer kaplasın (sonra diğer kolon gelsin) */
.kb-col-wrap.kb-col--scroll {
  width: calc(320px + var(--kb-scrollbar-gutter));
  flex-basis: calc(320px + var(--kb-scrollbar-gutter));
  padding-right: var(--kb-scrollbar-gutter);
}

/* Column (görsel kart) */
.kb-col {
  width: 320px;
  flex: 0 0 320px;

  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 var(--crm-shadow-y) var(--crm-shadow-blur)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);

  display: flex;
  flex-direction: column;
  height: 100%;
}

/* KURAL 1: scroll YOKSA kolonlar arasında boşluk */
.kb-col-wrap.kb-col--gap-right {
  margin-right: var(--crm-space-4);
}

/* KURAL 2: scroll VARSA (gap yoksa) kolonlar bitişik + arada dikey çizgi (wrap sınırında) */
.kb-col-wrap.kb-col--divider-right {
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

/* son wrap'ta extra çizgi olmasın */
.kb-col-wrap:last-child {
  border-right: none;
  margin-right: 0;
}

.kb-col-head {
  padding: var(--crm-space-4);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 10%, rgb(var(--v-theme-surface)));
  border-bottom: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}

.kb-col-title {
  display: flex;
  align-items: center;
  gap: var(--crm-space-2);
  font-size: var(--crm-text-sm);
  font-weight: var(--crm-fw-xbold);
  color: rgb(var(--v-theme-on-surface));
}

.kb-count {
  padding: 2px 8px;
  font-size: var(--crm-text-xs);
  font-weight: var(--crm-fw-bold);
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 18%, transparent);
  color: rgb(var(--v-theme-primary));
}

.kb-col-body {
  /* Scroll container */
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  /* padding burada değil */
  padding: 0;
}

/* ✅ Scrollbar’ı kolonun DIŞINA (wrap’in gutter alanına) taşı
   Artık gutter fiziksel olarak ayrıldığı için scrollbar diğer kolona binmez.
*/
.kb-col-wrap.kb-col--scroll .kb-col-body {
  margin-right: calc(var(--kb-scrollbar-gutter) * -1);
  padding-right: var(--kb-scrollbar-gutter);
}

.kb-col-body-inner {
  padding: var(--crm-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--crm-space-3);
}

.kb-col-footer {
  padding-top: var(--crm-space-2);
}
</style>


