<template>
  <div
    class="kb-board"
    ref="boardRef"
    @dragover.prevent="onBoardDragOver"
  >
    <div class="kb-columns">
      <div
        v-for="(col, idx) in localColumns"
        :key="col.key"
        class="kb-col-wrap"
        :class="{
          'kb-col--scroll': scrollCols.has(col.key),
          'kb-col--gap-right': shouldGapRight(idx),
          'kb-col--divider-right': shouldDividerRight(idx),
          'kb-col--dragover': isDragOver(col.key),
        }"
      >
               <div class="kb-col" :class="{ 'kb-col--empty': (col.items?.length ?? 0) === 0 }">

          <div class="kb-col-head">
            <div class="d-flex align-center justify-space-between">
              <div class="kb-col-title">
                <span>{{ col.title }}</span>
                <span class="kb-count">{{ col.items.length }}</span>
              </div>

              <div class="d-flex align-center ga-2">
                <!-- ✅ Zoho: kolondaki tüm kartları seç -->
                             <v-checkbox-btn
                  v-if="enableSelection && col.items.length > 0"
                  class="kb-col-check"
                  :class="{ 'is-visible': isColAllSelected(col) || isColIndeterminate(col) }"
                  density="compact"
                  :model-value="isColAllSelected(col)"
                  :indeterminate="isColIndeterminate(col)"
                  @update:model-value="v => toggleColumn(col, Boolean(v))"
                />


                <slot name="column-actions" :column="col" />
              </div>
            </div>
          </div>

          <div
            class="kb-col-body"
            :ref="el => setColBodyRef(col.key, el)"
            @dragover.prevent="onDragOver(col.key, $event)"
            @dragleave="onDragLeave(col.key)"
            @drop.prevent="onDrop(col.key, $event)"
          >
            <div class="kb-col-body-inner">
              <template
                v-for="(card, cardIdx) in col.items"
                :key="(card as any)?.[itemKey ?? 'id']"
              >
                <div v-if="showInsertLine(col.key, cardIdx)" class="kb-drop-line" />

                <div
                  class="kb-dnd-card"
                  :class="{ 'kb-dnd-card--dragging': isDragging(col.key, card) }"
                  draggable="true"
                  @dragstart="onDragStart(col.key, card, $event)"
                  @dragend="onDragEnd"
                  @dragover.prevent="onCardDragOver(col.key, cardIdx, $event)"
                >
                  <!-- ✅ Kart kabuğu component’te: hover checkbox burada -->
                  <KanbanCard
                    :selectable="enableSelection"
                    :selected="isSelected(card)"
                    @toggle-select="() => toggleSelected(card)"
                  >
                    <slot
                      name="card"
                      :item="card"
                      :column="col"
                      :index="cardIdx"
                      :selected="isSelected(card)"
                      :toggle-select="() => toggleSelected(card)"
                    />
                  </KanbanCard>
                </div>
              </template>

              <div v-if="showInsertLine(col.key, col.items.length)" class="kb-drop-line" />

              <div v-if="$slots['column-footer']" class="kb-col-footer">
                <slot name="column-footer" :column="col" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- (İleride lazım olur) Selection'ı sıfırlamak istersen dışarıdan slot/btn ile çağırırız -->
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import KanbanCard from '@/components/kanban/KanbanCard.vue'

type KanbanColumn<T> = {
  key: string
  title: string
  items: T[]
}

const props = defineProps<{
  columns: Array<KanbanColumn<any>>
  itemKey?: string
  enableSelection?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:columns', v: Array<KanbanColumn<any>>): void
  (e: 'card-moved', payload: { item: any; from: string; to: string }): void

  // ✅ Seçim state board içinde, sayfa sadece “var/yok” alır
  (e: 'selection-change', payload: { selectedIds: Set<string | number>; hasSelection: boolean }): void
}>()

/* =========================
   ✅ columns clone (no prop mutate)
   ========================= */
const cloneColumns = (cols: Array<KanbanColumn<any>>): Array<KanbanColumn<any>> =>
  cols.map(c => ({
    key: c.key,
    title: c.title,
    items: Array.isArray(c.items) ? [...c.items] : [],
  }))

const localColumns = ref<Array<KanbanColumn<any>>>(cloneColumns(props.columns))

watch(
  () => props.columns,
  async v => {
    localColumns.value = cloneColumns(v)
    await nextTick()
    calcScrollCols()
  },
  { deep: true },
)

/* =========================
   ✅ Selection (Zoho checkbox)
   ========================= */
const selectedIds = ref<Set<string | number>>(new Set())

const getItemId = (item: any) => {
  const k = props.itemKey ?? 'id'
  return (item as any)?.[k]
}

const enableSelection = !!props.enableSelection

const isSelected = (item: any) => selectedIds.value.has(getItemId(item))

const emitSelection = () => {
  emit('selection-change', {
    selectedIds: selectedIds.value,
    hasSelection: selectedIds.value.size > 0,
  })
}

const toggleSelected = (item: any) => {
  if (!props.enableSelection) return

  const id = getItemId(item)
  const next = new Set(selectedIds.value)

  if (next.has(id)) next.delete(id)
  else next.add(id)

  selectedIds.value = next
  emitSelection()
}

/* ✅ Kolon toplu seçim (Zoho) */
const getColIds = (col: KanbanColumn<any>) => {
  const k = props.itemKey ?? 'id'
  return (col.items ?? [])
    .map(x => (x as any)?.[k])
    .filter((v: any) => v !== undefined && v !== null) as Array<string | number>
}

const isColAllSelected = (col: KanbanColumn<any>) => {
  const ids = getColIds(col)
  if (ids.length === 0) return false
  return ids.every(id => selectedIds.value.has(id))
}

const isColIndeterminate = (col: KanbanColumn<any>) => {
  const ids = getColIds(col)
  if (ids.length === 0) return false
  const any = ids.some(id => selectedIds.value.has(id))
  const all = ids.every(id => selectedIds.value.has(id))
  return any && !all
}

const toggleColumn = (col: KanbanColumn<any>, checked: boolean) => {
  if (!props.enableSelection) return

  const ids = getColIds(col)
  const next = new Set(selectedIds.value)

  for (const id of ids) {
    if (checked) next.add(id)
    else next.delete(id)
  }

  selectedIds.value = next
  emitSelection()
}

/* =========================
   ✅ Scroll detection
   ========================= */
const bodyRefs = new Map<string, HTMLElement>()
const scrollCols = ref(new Set<string>())

const setColBodyRef = (key: string, el: Element | { $el?: unknown } | null) => {
  if (!el) {
    bodyRefs.delete(key)
    return
  }

  const rawEl = (el as any)?.$el ? (el as any).$el : el
  if (rawEl instanceof HTMLElement) bodyRefs.set(key, rawEl)
}

const calcScrollCols = () => {
  const next = new Set<string>()
  for (const [key, el] of bodyRefs.entries()) {
    const hasOverflow = el.scrollHeight > el.clientHeight + 1
    if (hasOverflow) next.add(key)
  }
  scrollCols.value = next
}

const shouldGapRight = (idx: number) => {
  const a = localColumns.value[idx]
  if (!a) return false
  return !scrollCols.value.has(a.key)
}

const shouldDividerRight = (idx: number) => {
  const a = localColumns.value[idx]
  if (!a) return false
  return scrollCols.value.has(a.key)
}

let ro: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  calcScrollCols()

  ro = new ResizeObserver(() => calcScrollCols())
  for (const el of bodyRefs.values()) ro.observe(el)

  window.addEventListener('resize', calcScrollCols)

  emitSelection()
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
const dragState = ref<null | { fromKey: string; item: any; itemId: string | number }>(null)
const dragOverCol = ref<string | null>(null)
const dragOverIndex = ref<number | null>(null)

/* =========================
   ✅ Board auto horizontal scroll (drag while)
   ========================= */
const boardRef = ref<HTMLElement | null>(null)

let autoScrollRaf: number | null = null
let lastClientX: number | null = null

const AUTO_SCROLL_EDGE_PX = 90
const AUTO_SCROLL_MAX_SPEED = 18

const stopAutoScroll = () => {
  if (autoScrollRaf !== null) {
    cancelAnimationFrame(autoScrollRaf)
    autoScrollRaf = null
  }
  lastClientX = null
}

const tickAutoScroll = () => {
  if (!dragState.value || !boardRef.value || lastClientX === null) {
    stopAutoScroll()
    return
  }

  const el = boardRef.value
  const rect = el.getBoundingClientRect()

  const distLeft = lastClientX - rect.left
  const distRight = rect.right - lastClientX

  let speed = 0

  if (distLeft >= 0 && distLeft < AUTO_SCROLL_EDGE_PX) {
    const t = 1 - distLeft / AUTO_SCROLL_EDGE_PX
    speed = -Math.ceil(t * AUTO_SCROLL_MAX_SPEED)
  }

  if (distRight >= 0 && distRight < AUTO_SCROLL_EDGE_PX) {
    const t = 1 - distRight / AUTO_SCROLL_EDGE_PX
    speed = Math.ceil(t * AUTO_SCROLL_MAX_SPEED)
  }

  if (speed !== 0) el.scrollLeft += speed

  autoScrollRaf = requestAnimationFrame(tickAutoScroll)
}

const onBoardDragOver = (e: DragEvent) => {
  if (!dragState.value) return
  if (typeof e.clientX === 'number') lastClientX = e.clientX
  if (autoScrollRaf === null) autoScrollRaf = requestAnimationFrame(tickAutoScroll)
}

const getColByKey = (key: string) => localColumns.value.find(c => c.key === key)

const isDragging = (colKey: string, item: any) => {
  if (!dragState.value) return false
  return dragState.value.fromKey === colKey && dragState.value.itemId === getItemId(item)
}

const isDragOver = (toKey: string) => {
  if (!dragState.value) return false
  if (!dragOverCol.value) return false
  return dragOverCol.value === toKey
}

const onCardDragOver = (toKey: string, idx: number, e: DragEvent) => {
  if (!dragState.value) return
  e.preventDefault()
  dragOverCol.value = toKey
  dragOverIndex.value = idx
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const showInsertLine = (colKey: string, idx: number) => {
  if (!dragState.value) return false
  if (dragOverCol.value !== colKey) return false
  return dragOverIndex.value === idx
}

const onDragStart = (fromKey: string, item: any, e: DragEvent) => {
  dragState.value = { fromKey, item, itemId: getItemId(item) }

  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', 'kb-card')
  }
}

const onDragEnd = () => {
  stopAutoScroll()
  dragState.value = null
  dragOverCol.value = null
  dragOverIndex.value = null
}

const onDragOver = (toKey: string, e: DragEvent) => {
  if (!dragState.value) return
  e.preventDefault()

  dragOverCol.value = toKey
  dragOverIndex.value = getColByKey(toKey)?.items.length ?? 0

  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
}

const onDragLeave = (toKey: string) => {
  if (dragOverCol.value === toKey) {
    dragOverCol.value = null
    dragOverIndex.value = null
  }
}

const onDrop = async (toKey: string, e: DragEvent) => {
  if (!dragState.value) return
  e.preventDefault()

  stopAutoScroll()

  const { fromKey, item, itemId } = dragState.value

  const toIndex = dragOverCol.value === toKey ? (dragOverIndex.value ?? 0) : 0

  dragState.value = null
  dragOverCol.value = null
  dragOverIndex.value = null

  if (fromKey === toKey) return

  const fromCol = getColByKey(fromKey)
  const toCol = getColByKey(toKey)
  if (!fromCol || !toCol) return

  const fromIdx = fromCol.items.findIndex(x => getItemId(x) === itemId)
  if (fromIdx >= 0) fromCol.items.splice(fromIdx, 1)

  const safeIndex = Math.max(0, Math.min(toIndex, toCol.items.length))
  toCol.items.splice(safeIndex, 0, item)

  const placedIdx = toCol.items.findIndex(x => getItemId(x) === itemId)
  if (placedIdx > 0) {
    const [moved] = toCol.items.splice(placedIdx, 1)
    toCol.items.unshift(moved)
  } else if (placedIdx === -1) {
    toCol.items.unshift(item)
  }

  emit('update:columns', localColumns.value)
  emit('card-moved', { item, from: fromKey, to: toKey })

  await nextTick()
  calcScrollCols()
}
</script>

<style scoped>
.kb-board {
  --kb-scrollbar-gutter: var(--crm-space-4);
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

.kb-col-wrap {
  width: 320px;
  flex: 0 0 320px;
  height: 100%;
  display: flex;
}

.kb-col-wrap.kb-col--scroll {
  width: calc(320px + var(--kb-scrollbar-gutter));
  flex-basis: calc(320px + var(--kb-scrollbar-gutter));
  padding-right: var(--kb-scrollbar-gutter);
}



.kb-col-wrap.kb-col--gap-right {
  margin-right: var(--crm-space-4);
}

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

.kb-col-wrap.kb-col--scroll .kb-col-body {
  /* ✅ global border-box yüzünden kartların daralmasını engelle */
  box-sizing: content-box;

  /* ✅ scrollbar gutter sağda dursun */
  margin-right: calc(var(--kb-scrollbar-gutter) * -1);
  padding-right: 0;
}
/* =========================
   ✅ Scrollbar – sadece scroll olan kolonlar
   ========================= */

/* Chrome / Edge / Safari */
.kb-col-wrap.kb-col--scroll .kb-col-body::-webkit-scrollbar {
  width: 12px;
}

.kb-col-wrap.kb-col--scroll .kb-col-body::-webkit-scrollbar-track {
  background: transparent;
}

.kb-col-wrap.kb-col--scroll .kb-col-body::-webkit-scrollbar-thumb {
  background-color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) 28%,
    transparent
  );
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: content-box;
}

.kb-col-wrap.kb-col--scroll .kb-col-body::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(
    in srgb,
    rgb(var(--v-theme-on-surface)) 35%,
    transparent
  );
}

/* Firefox */
.kb-col-wrap.kb-col--scroll .kb-col-body {
  scrollbar-width: auto;
  scrollbar-color:
    color-mix(in srgb, rgb(var(--v-theme-on-surface)) 28%, transparent)
    transparent;
}


.kb-col {
  width: 100%;
  flex: 1 1 auto;

  /* ✅ dolu kolon: “kutu” hissi yok */
  border: none;
  background: transparent;
  box-shadow: none;

  display: flex;
  flex-direction: column;
  height: 100%;
}



/* ✅ sadece kolon boşsa arka plan ver */
.kb-col.kb-col--empty {
  /* ✅ sadece boş kolonda kart/kolon kabuğu görünsün */
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 var(--crm-shadow-y) var(--crm-shadow-blur)
    color-mix(in srgb, rgb(var(--v-theme-secondary)) var(--crm-alpha-12), transparent);
}


/* ✅ head ile ilk kart arası 10px */
.kb-col-body-inner {
  padding: 10px 0 var(--crm-space-4) 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  gap: var(--crm-space-3);
}

/* ✅ Kolon başlığındaki toplu seçim checkbox: hover’da görünsün, seçiliyse görünür kalsın */
.kb-col-check {
  margin: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.kb-col-head:hover .kb-col-check,
.kb-col-check.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.kb-col-check :deep(.v-selection-control__input) {
  width: 18px;
  height: 18px;
}


.kb-drop-line {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 20%, transparent);
}

.kb-dnd-card {
  width: 100%;
  display: block;
  box-sizing: border-box;
  border-radius: var(--kb-card-radius);
}

.kb-dnd-card--dragging {
  opacity: 0.5;
}

.kb-col-wrap.kb-col--dragover .kb-col {
  outline: 2px dashed color-mix(in srgb, rgb(var(--v-theme-primary)) var(--crm-alpha-60), transparent);
  outline-offset: 2px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 4%, rgb(var(--v-theme-surface)));
}

.kb-dnd-card[draggable='true'] {
  cursor: grab;
}

.kb-dnd-card[draggable='true']:active {
  cursor: grabbing;
}

.kb-col-footer {
  padding-top: var(--crm-space-2);
}


</style>

