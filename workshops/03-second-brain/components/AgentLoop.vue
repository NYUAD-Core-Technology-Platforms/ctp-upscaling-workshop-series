<!--
  AgentLoop: the six-step navigation loop an agent follows in the vault.
  A marker orbits the ring and each step flashes as it passes.
-->
<script setup lang="ts">
const arcs = [
  'M887.7 149.6 A250 250 0 0 1 1028.7 231',
  'M1076.4 313.6 A250 250 0 0 1 1076.4 476.4',
  'M1028.7 559 A250 250 0 0 1 887.7 640.4',
  'M792.3 640.4 A250 250 0 0 1 651.3 559',
  'M603.6 476.4 A250 250 0 0 1 603.6 313.6',
  'M651.3 231 A250 250 0 0 1 792.3 149.6',
]
const nodes = [
  [840, 145], [1056.5, 270], [1056.5, 520], [840, 645], [623.5, 520], [623.5, 270],
]
const labels = [
  { x: 840, y: 66, a: 'middle', t: 'Read the contract', s: 'AGENTS.md' },
  { x: 1112, y: 262, a: 'start', t: 'Load the role', s: 'only the one the task needs' },
  { x: 1112, y: 512, a: 'start', t: 'Enter through an index', s: 'index → hub → note' },
  { x: 840, y: 726, a: 'middle', t: 'Search narrowly', s: 'names, tags, properties' },
  { x: 568, y: 512, a: 'end', t: 'Resolve the current state', s: 'the latest decision wins' },
  { x: 568, y: 262, a: 'end', t: 'Do the work, write back', s: 'update, log, commit' },
]
</script>

<template>
  <svg class="sb-loop" viewBox="0 0 1680 780" role="img" aria-label="Six-step loop: read the contract, load the role, enter through an index, search narrowly, resolve the current state, do the work and write back">
    <defs>
      <marker id="sb-ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" class="ah" />
      </marker>
    </defs>
    <circle class="ring" cx="840" cy="395" r="250" />
    <path v-for="(d, i) in arcs" :key="'a' + i" class="arc" marker-end="url(#sb-ah)" :d="d" />
    <circle v-for="(n, i) in nodes" :key="'h' + i" class="halo" :style="{ '--k': i }" :cx="n[0]" :cy="n[1]" r="36" />
    <g v-for="(n, i) in nodes" :key="'n' + i">
      <circle class="nd" :cx="n[0]" :cy="n[1]" r="36" />
      <text class="nn" :x="n[0]" :y="n[1]">{{ i + 1 }}</text>
    </g>
    <g class="orbit"><circle cx="840" cy="145" r="12" class="marker" /></g>
    <g v-for="l in labels" :key="l.t">
      <text class="lt" :x="l.x" :y="l.y" :text-anchor="l.a">{{ l.t }}</text>
      <text class="ls" :x="l.x" :y="l.y + 34" :text-anchor="l.a">{{ l.s }}</text>
    </g>
    <text class="ctr" x="840" y="385">No agent</text>
    <text class="ctr" x="840" y="437">reads everything</text>
  </svg>
</template>

<style scoped>
.sb-loop { display: block; font-family: var(--font-sans); }
.ring { fill: none; stroke: var(--sb-line); stroke-width: 4; }
.arc { fill: none; stroke: var(--nyu-violet); stroke-width: 4; stroke-linecap: round; }
.ah { fill: var(--nyu-violet); }
.nd { fill: var(--nyu-violet); }
.nn { fill: #fff; font: 700 30px var(--font-serif); text-anchor: middle; dominant-baseline: central; }
.lt { font: 700 32px var(--font-serif); fill: var(--fg1); }
.ls { font: 400 26px var(--font-sans); fill: var(--fg3); }
.ctr { font: 700 42px var(--font-serif); fill: var(--fg1); text-anchor: middle; }
.marker { fill: var(--gold); stroke: var(--bg1); stroke-width: 4; }
.orbit { transform-box: view-box; transform-origin: 840px 395px; animation: sb-spin 9s linear infinite; }
.halo { fill: none; stroke: var(--gold); stroke-width: 4; opacity: 0; transform-box: fill-box; transform-origin: center; animation: loop-halo 9s linear infinite; animation-delay: calc(var(--k) * 1.5s - .15s); }
@keyframes loop-halo { 0% { opacity: 0; transform: scale(1); } 2% { opacity: .75; } 12% { opacity: 0; transform: scale(1.9); } 100% { opacity: 0; transform: scale(1.9); } }
</style>
