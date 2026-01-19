<template>
  <div class="kb-board">
  <div class="kb-columns">
  <div
    v-for="(col, idx) in localColumns"
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

      <div
  class="kb-col-body"
  :ref="el => setColBodyRef(col.key, el)"
  @dragover="onDragOver(col.key, $event)"
  @dragleave="onDragLeave(col.key)"
  @drop="onDrop(col.key, $event)"
>
        <div class="kb-col-body-inner">
          <template v-for="(card, cardIdx) in col.items" :key="(card as any)?.[itemKey ?? 'id']">
            <div
                class="kb-dnd-card"
                draggable="true"
                @dragstart="onDragStart(col.key, card, $event)"
                @dragend="onDragEnd"
            >
                <slot name="card" :item="card" :column="col" :index="cardIdx" />
            </div>
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

const emit = defineEmits<{
  (e: 'update:columns', v: Array<KanbanColumn<any>>): void
  (e: 'card-moved', payload: { item: any; from: string; to: string }): void
}>()

/**
 * ✅ Reusable component kuralı:
 * props'u doğrudan mutate etmeyelim; local kopya ile render edelim.
 * (item objeleri referans kalır; sadece dizi yapısını kopyalıyoruz)
 */
const cloneColumns = (cols: Array<KanbanColumn<any>>): Array<KanbanColumn<any>> =>
  cols.map(c => ({
    key: c.key,
    title: c.title,
    items: Array.isArray(c.items) ? [...c.items] : [],
  }))

const localColumns = ref<Array<KanbanColumn<any>>>(cloneColumns(props.columns))

watch(
  () => props.columns,
  async (v) => {
    localColumns.value = cloneColumns(v)
    await nextTick()
    calcScrollCols()
  },
  { deep: true },
)

const bodyRefs = new Map<string, HTMLElement>()
const scrollCols = ref(new Set<string>())

const setColBodyRef = (key: string, el: Element | { $el?: unknown } | null) => {
  if (!el) {
    bodyRefs.delete(key)
    return
  }

  const rawEl = (el as any)?.$el ? (el as any).$el : el
  if (rawEl instanceof HTMLElement)
    bodyRefs.set(key, rawEl)
}

const calcScrollCols = () => {
  const next = new Set<string>()
  for (const [key, el] of bodyRefs.entries()) {
    const hasOverflow = el.scrollHeight > el.clientHeight + 1
    if (hasOverflow)
      next.add(key)
  }
  scrollCols.value = next
}

const shouldGapRight = (idx: number) => {
  const a = localColumns.value[idx]
  const b = localColumns.value[idx + 1]
  if (!a || !b) return false
  return !scrollCols.value.has(a.key) && !scrollCols.value.has(b.key)
}

const shouldDividerRight = (idx: number) => {
  const a = localColumns.value[idx]
  const b = localColumns.value[idx + 1]
  if (!a || !b) return false
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

watch(
  () => localColumns.value,
  async () => {
    await nextTick()
    calcScrollCols()
  },
  { deep: true },
)

/* =========================
   ✅ Drag & Drop (native)
   ========================= */

const dragState = ref<null | { fromKey: string; item: any }>(null)
const dragOverCol = ref<string | null>(null)

const getColByKey = (key: string) => localColumns.value.find(c => c.key === key)

const onDragStart = (fromKey: string, item: any, e: DragEvent) => {
  dragState.value = { fromKey, item }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    // bazı tarayıcılarda drop çalışması için data şart
    e.dataTransfer.setData('text/plain', 'kb-card')
  }
}

const onDragEnd = () => {
  dragState.value = null
  dragOverCol.value = null
}

const onDragOver = (toKey: string, e: DragEvent) => {
  if (!dragState.value) return
  e.preventDefault()
  dragOverCol.value = toKey
  if (e.dataTransfer)
    e.dataTransfer.dropEffect = 'move'
}

const onDragLeave = (toKey: string) => {
  if (dragOverCol.value === toKey)
    dragOverCol.value = null
}

const onDrop = async (toKey: string, e: DragEvent) => {
  if (!dragState.value) return
  e.preventDefault()

  const { fromKey, item } = dragState.value
  dragState.value = null
  dragOverCol.value = null

  if (fromKey === toKey) return

  const fromCol = getColByKey(fromKey)
  const toCol = getColByKey(toKey)
  if (!fromCol || !toCol) return

  const idx = fromCol.items.indexOf(item)
  if (idx >= 0)
    fromCol.items.splice(idx, 1)

  // ✅ basit: hedef kolona sona ekle (Zoho gibi)
  toCol.items.push(item)

  emit('update:columns', localColumns.value)
  emit('card-moved', { item, from: fromKey, to: toKey })

  await nextTick()
  calcScrollCols()
}
</script>


<style scoped>
.kb-board {
  /* ✅ Zoho hissi: scrollbar için fiziksel boşluk (gutter) */
  --kb-scrollbar-gutter: var(--crm-space-4);

  /* ✅ kart radius (token varsa onu kullan) */
  --kb-card-radius: var(--crm-radius-sm, var(--crm-space-1));

  overflow-x: auto;
  padding-bottom: var(--crm-space-3);
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

/* Column */
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0;
}

/* ✅ Scrollbar’ı kolonun DIŞINA taşı */
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

/* ✅ Kart wrapper: full width + küçük radius + drag hissi */
.kb-dnd-card {
  width: 100%;
  border-radius: var(--kb-card-radius);
}

/* slot içeriğinin kendisi kart ise (kb-card class), yine tam genişlik */
.kb-dnd-card :deep(.kb-card) {
  width: 100%;
  border-radius: var(--kb-card-radius);
}

/* drag sırasında seçilebilsin */
.kb-dnd-card[draggable="true"] {
  cursor: grab;
}

.kb-dnd-card[draggable="true"]:active {
  cursor: grabbing;
}

.kb-col-footer {
  padding-top: var(--crm-space-2);
}
</style>



