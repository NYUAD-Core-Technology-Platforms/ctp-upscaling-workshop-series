<!--
  EquipmentList: renders lab-equipment names baked into equipment.json by
  scripts/fetch-equipment.mjs. Pure display, no network call at runtime, so no
  credentials ever ship in the published deck. Paginated because the catalog is
  large (~300 resources): Prev/Next step through fixed-size pages that fit one
  slide. The grid height is capped so the Prev/Next bar is always visible.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../equipment.json'

const equipment: string[] = (data as any).equipment ?? []
const fetchedAt: string | null = (data as any).fetchedAt ?? null

const COLS = 4
const ROWS = 5
const PER_PAGE = COLS * ROWS // 20 per page

const page = ref(0)
const pageCount = computed(() => Math.max(1, Math.ceil(equipment.length / PER_PAGE)))
const start = computed(() => page.value * PER_PAGE)
const end = computed(() => Math.min(start.value + PER_PAGE, equipment.length))
const pageItems = computed(() => equipment.slice(start.value, end.value))

const stamp = computed(() =>
  fetchedAt ? `pulled ${new Date(fetchedAt).toLocaleDateString()}` : 'sample data',
)

function prev() {
  if (page.value > 0) page.value--
}
function next() {
  if (page.value < pageCount.value - 1) page.value++
}
</script>

<template>
  <div class="equipment">
    <ul class="equipment__grid">
      <li v-for="name in pageItems" :key="name" :title="name">{{ name }}</li>
    </ul>

    <div class="equipment__bar">
      <button class="equipment__btn" @click.stop="prev" :disabled="page === 0">
        ‹ Prev
      </button>
      <span class="equipment__status">
        {{ start + 1 }}–{{ end }} of {{ equipment.length }}
        <span class="equipment__sep">·</span> page {{ page + 1 }}/{{ pageCount }}
        <span class="equipment__sep">·</span> {{ stamp }}
      </span>
      <button class="equipment__btn" @click.stop="next" :disabled="page >= pageCount - 1">
        Next ›
      </button>
    </div>
  </div>
</template>

<style scoped>
.equipment {
  margin-top: var(--s-3);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}
.equipment__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: var(--s-2);
}
.equipment__grid li {
  padding: 6px 10px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
  font-size: 12px;
  line-height: 1.18;
  color: var(--fg1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.equipment__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-3);
  border-top: 1px solid var(--hairline);
  padding-top: var(--s-2);
}
.equipment__btn {
  font: inherit;
  font-size: var(--t-small);
  font-weight: 600;
  color: var(--fg-inv);
  background: var(--ctp-color-violet);
  border: none;
  border-radius: var(--r-2);
  padding: 4px 16px;
  cursor: pointer;
}
.equipment__btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.equipment__status {
  font-size: var(--t-caption);
  color: var(--fg2);
}
.equipment__sep {
  margin: 0 4px;
}
</style>
