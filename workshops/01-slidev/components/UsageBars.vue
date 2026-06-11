<!--
  UsageBars: top instruments by booked hours, from stats.json (Booked usage).
  Horizontal bars (names are long), widths relative to the busiest instrument.
  Pure display, no runtime network call, aggregates only.
-->
<script setup lang="ts">
import stats from '../stats.json'

const items = ((stats as any).topByHours ?? []) as { name: string; hours: number }[]
const max = Math.max(1, ...items.map((i) => i.hours))
const pct = (h: number) => (h / max) * 100 + '%'
const fmt = (n: number) => Math.round(n).toLocaleString()
</script>

<template>
  <div class="bars">
    <div v-for="it in items" :key="it.name" class="bars__row">
      <div class="bars__name" :title="it.name">{{ it.name }}</div>
      <div class="bars__track">
        <div class="bars__fill" :style="{ width: pct(it.hours) }"></div>
      </div>
      <div class="bars__val">{{ fmt(it.hours) }} h</div>
    </div>
  </div>
</template>

<style scoped>
.bars {
  margin-top: var(--s-4);
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.bars__row {
  display: grid;
  grid-template-columns: 290px 1fr 60px;
  align-items: center;
  gap: var(--s-3);
}
.bars__name {
  font-size: 12px;
  color: var(--fg1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bars__track {
  background: var(--bg3);
  border-radius: var(--r-pill);
  height: 14px;
  overflow: hidden;
}
.bars__fill {
  height: 100%;
  background: var(--ctp-color-violet);
  border-radius: var(--r-pill);
}
.bars__val {
  font-size: 12px;
  color: var(--fg2);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
