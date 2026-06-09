<!--
  EquipmentList: renders lab-equipment names baked into equipment.json by
  scripts/fetch-equipment.mjs (run locally on the NYU VPN). Pure display: it
  reads a static JSON at build time, makes no network call at runtime, so no
  credentials ever ship in the published deck.
-->
<script setup lang="ts">
import data from '../equipment.json'

const equipment: string[] = (data as any).equipment ?? []
const fetchedAt: string | null = (data as any).fetchedAt ?? null
</script>

<template>
  <div class="equipment">
    <ul class="equipment__grid">
      <li v-for="name in equipment" :key="name">{{ name }}</li>
    </ul>
    <p class="equipment__stamp" v-if="fetchedAt">
      {{ equipment.length }} resources · pulled from Booked on
      {{ new Date(fetchedAt).toLocaleDateString() }}
    </p>
    <p class="equipment__stamp" v-else>
      Sample data · run <code>npm run data</code> on the NYU VPN to pull the live list
    </p>
  </div>
</template>

<style scoped>
.equipment__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s-2) var(--s-4);
}
.equipment__grid li {
  padding: var(--s-2) var(--s-3);
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
  font-size: var(--t-small);
  color: var(--fg1);
}
.equipment__stamp {
  margin-top: var(--s-4);
  color: var(--fg2);
  font-size: var(--t-caption);
}
.equipment__stamp code {
  background: var(--bg2);
  padding: 0 var(--s-1);
  border-radius: var(--r-1);
}
</style>
