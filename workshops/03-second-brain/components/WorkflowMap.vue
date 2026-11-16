<!--
  WorkflowMap: five jobs, each on the model that suits it, all wired into one
  vault. Wires draw in, then signals travel into the vault (SVG animateMotion).
  Coordinates follow a 1680 x 560 design grid.
-->
<script setup lang="ts">
const rows = [
  { job: 'Hard reasoning and reviews', model: 'Frontier model', cls: '', top: 21 },
  { job: 'Everyday edits and drafting', model: 'Fast model', cls: '', top: 133 },
  { job: 'Overnight email triage', model: 'Scheduled agent', cls: 'gold', top: 245 },
  { job: 'Monitoring and routine checks', model: 'Local model', cls: 'good', top: 357 },
  { job: 'Reading, writing, thinking', model: 'You, in Obsidian', cls: 'ink', top: 469 },
]
const paths = [
  'M855 56 C1040 56 1080 280 1250 280',
  'M855 168 C1040 168 1080 280 1250 280',
  'M855 280 L1250 280',
  'M855 392 C1040 392 1080 280 1250 280',
  'M855 504 C1040 504 1080 280 1250 280',
]
const pulses = [
  { p: 0, dur: 2.6, begin: 0, c: 'var(--nyu-violet)' },
  { p: 0, dur: 2.6, begin: 1.3, c: 'var(--nyu-violet)' },
  { p: 1, dur: 2.2, begin: 0.4, c: 'var(--violet-400)' },
  { p: 1, dur: 2.2, begin: 1.5, c: 'var(--violet-400)' },
  { p: 2, dur: 3, begin: 0.9, c: 'var(--gold)' },
  { p: 3, dur: 2.4, begin: 0.2, c: 'var(--sb-good)' },
  { p: 3, dur: 2.4, begin: 1.4, c: 'var(--sb-good)' },
  { p: 4, dur: 3.2, begin: 0.6, c: 'var(--fg2)' },
]
</script>

<template>
  <div class="sb-wf">
    <svg class="wires" viewBox="0 0 1680 560" preserveAspectRatio="none" aria-hidden="true">
      <path v-for="(d, i) in paths" :key="i" pathLength="1" :style="{ '--i': i }" :d="d" />
      <circle v-for="(z, i) in pulses" :key="'z' + i" class="pz" r="7" :fill="z.c">
        <animateMotion :dur="z.dur + 's'" :begin="z.begin + 's'" repeatCount="indefinite" :path="paths[z.p]" />
      </circle>
    </svg>
    <div v-for="(r, i) in rows" :key="r.job" class="row sb-rise" :style="{ '--d': i + 1, top: (r.top / 560 * 100) + '%' }">
      <span class="job">{{ r.job }}</span><span :class="['sb-chip', 'mdl', r.cls]">{{ r.model }}</span>
    </div>
    <div class="vault sb-rise" style="--d:6"><b>The vault</b><span>one shared memory for all of them</span></div>
  </div>
</template>

<style scoped>
.sb-wf { position: relative; height: 280px; flex: none; }
.wires { position: absolute; inset: 0; width: 100%; height: 100%; }
.wires path { fill: none; stroke: var(--violet-200); stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 0; animation: wf-draw 1.1s ease both; animation-delay: calc(var(--i, 0) * 140ms + 300ms); }
.pz { opacity: 0; animation: wf-fade .5s ease 1.7s both; }
.row { position: absolute; left: 0; width: 63%; display: grid; grid-template-columns: 31fr 1fr 18fr; align-items: center; height: 36px; }
.job { grid-column: 1; font-size: 14.5px; color: var(--fg2); text-align: right; }
.mdl { grid-column: 3; justify-self: start; width: 100%; justify-content: center; font-size: 11.5px; padding: 7px 10px; }
.vault { position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 25.6%; padding: 16px 18px; border-radius: 10px; background: var(--nyuad-deep-violet); color: #fff; text-align: center; box-shadow: 0 14px 26px -12px rgba(61, 4, 98, .6); }
.vault b { display: block; font: 700 20px/1.1 var(--font-serif); }
.vault span { display: block; font-size: 11.5px; line-height: 1.4; color: var(--violet-200); margin-top: 5px; }
@keyframes wf-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes wf-fade { from { opacity: 0; } to { opacity: 1; } }
</style>
