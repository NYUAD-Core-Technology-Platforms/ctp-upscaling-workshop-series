<!--
  StatCards: headline KPI cards from stats.json (Booked usage) plus the catalog
  size from equipment.json. Numbers count up on mount. Pure display, no runtime
  network call. All figures are aggregates, no personal data.
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import stats from '../stats.json'
import equipment from '../equipment.json'

const totals = (stats as any).totals ?? {}
const catalog = ((equipment as any).equipment ?? []).length

const cards = [
  { label: 'Instruments in the catalog', value: catalog },
  { label: 'Hours booked', value: totals.bookedHours ?? 0 },
  { label: 'Reservations', value: totals.reservations ?? 0 },
  { label: 'Researchers served', value: totals.distinctUsers ?? 0 },
]

const display = ref(cards.map(() => 0))
const fmt = (n: number) => Math.round(n).toLocaleString()

onMounted(() => {
  const dur = 900
  const t0 = performance.now()
  function tick(now: number) {
    const p = Math.min(1, (now - t0) / dur)
    const e = 1 - Math.pow(1 - p, 3) // easeOutCubic
    display.value = cards.map((c) => c.value * e)
    if (p < 1) requestAnimationFrame(tick)
    else display.value = cards.map((c) => c.value)
  }
  requestAnimationFrame(tick)
})

const isSample = /sample/i.test(String((stats as any).source || ''))
const windowLabel =
  (stats as any).windowStart && (stats as any).windowEnd
    ? `${(stats as any).windowStart} to ${(stats as any).windowEnd}`
    : ''
</script>

<template>
  <div class="kpi">
    <div class="kpi__grid">
      <div v-for="(c, i) in cards" :key="c.label" class="kpi__card">
        <div class="kpi__value">{{ fmt(display[i]) }}</div>
        <div class="kpi__label">{{ c.label }}</div>
      </div>
    </div>
    <div class="kpi__foot">
      Booked reservation system<span v-if="windowLabel"> · {{ windowLabel }}</span>
      <span v-if="isSample"> · sample data (run npm run data:stats)</span>
    </div>
  </div>
</template>

<style scoped>
.kpi {
  margin-top: var(--s-4);
}
.kpi__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--s-4);
}
.kpi__card {
  border: 1px solid var(--hairline);
  border-left: 4px solid var(--ctp-color-violet);
  border-radius: var(--r-3);
  background: var(--bg2);
  padding: var(--s-5);
}
.kpi__value {
  font-family: var(--font-serif);
  font-size: 42px;
  line-height: 1.05;
  color: var(--fg1);
  font-variant-numeric: tabular-nums;
}
.kpi__label {
  margin-top: var(--s-2);
  font-size: var(--t-small);
  color: var(--fg2);
}
.kpi__foot {
  margin-top: var(--s-5);
  font-size: var(--t-caption);
  color: var(--fg3);
}
</style>
