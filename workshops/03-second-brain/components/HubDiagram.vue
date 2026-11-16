<!--
  HubDiagram: the whole talk in one picture. The second brain (plain Markdown,
  ringed by Git history) in the middle; you and every AI around it, each with a
  "reads context" lane (violet, flowing out) and a "writes back" lane (gold,
  flowing in). Pure SVG + CSS animation.
-->
<script setup lang="ts">
const spokes = [
  { out: [495.5, 235, 495.5, 110], inn: [484.5, 235, 484.5, 110] },
  { out: [686.7, 381.9, 805.5, 343.2], inn: [683.3, 371.4, 802.1, 332.8] },
  { out: [606.1, 609.1, 679.6, 710.2], inn: [615, 602.6, 688.4, 703.8] },
  { out: [365, 602.6, 291.6, 703.8], inn: [373.9, 609.1, 300.4, 710.2] },
  { out: [296.7, 371.4, 177.9, 332.8], inn: [293.3, 381.9, 174.5, 343.2] },
]
const chips = [
  { x: 350, y: 77, w: 280, label: 'You · Obsidian', me: true },
  { x: 688.8, y: 305, w: 230, label: 'Claude' },
  { x: 569, y: 674, w: 230, label: 'Codex' },
  { x: 181, y: 674, w: 230, label: 'Cursor' },
  { x: 61.2, y: 305, w: 230, label: 'Local model' },
]
</script>

<template>
  <svg class="sb-hub" viewBox="0 0 980 880" role="img" aria-label="One vault in the middle; you and several AI tools read from it and write back to it">
    <g>
      <template v-for="(s, i) in spokes" :key="i">
        <line class="lane out" :x1="s.out[0]" :y1="s.out[1]" :x2="s.out[2]" :y2="s.out[3]" />
        <line class="lane in" :x1="s.inn[0]" :y1="s.inn[1]" :x2="s.inn[2]" :y2="s.inn[3]" />
      </template>
    </g>
    <circle class="gitring" cx="490" cy="440" r="205" />
    <circle class="core" cx="490" cy="440" r="160" />
    <text x="490" y="428" text-anchor="middle" class="core-t">Second brain</text>
    <text x="490" y="474" text-anchor="middle" class="core-s">plain Markdown files</text>
    <text x="490" y="684" text-anchor="middle" class="git-t">GIT HISTORY</text>
    <g v-for="c in chips" :key="c.label">
      <rect :class="['chip', { me: c.me }]" :x="c.x" :y="c.y" :width="c.w" height="66" rx="33" />
      <text :class="['chip-t', { me: c.me }]" :x="c.x + c.w / 2" :y="c.y + 43" text-anchor="middle">{{ c.label }}</text>
    </g>
    <text x="490" y="830" text-anchor="middle" class="legend">
      <tspan class="dot-r">●</tspan><tspan> reads context   </tspan><tspan class="dot-w" dx="18">●</tspan><tspan> writes back</tspan>
    </text>
  </svg>
</template>

<style scoped>
.sb-hub { display: block; font-family: var(--font-sans); }
.lane { stroke-width: 3.4; stroke-linecap: round; stroke-dasharray: 3 13; fill: none; }
.lane.out { stroke: var(--sb-read); animation: hub-out 1.1s linear infinite; }
.lane.in { stroke: var(--sb-write); animation: hub-in 1.1s linear infinite; }
.gitring { fill: none; stroke: var(--nyu-violet); stroke-width: 3; stroke-dasharray: 2 12; stroke-linecap: round; transform-box: view-box; transform-origin: 490px 440px; animation: sb-spin 60s linear infinite; }
.core { fill: var(--nyuad-deep-violet); transform-box: fill-box; transform-origin: center; animation: sb-breathe 4.5s ease-in-out infinite; }
.core-t { fill: #fff; font: 700 44px var(--font-serif); }
.core-s { fill: var(--violet-200); font: 400 25px var(--font-sans); }
.git-t { fill: var(--nyu-violet); font: 700 21px var(--font-sans); letter-spacing: .18em; }
.chip { fill: var(--sb-violet-soft); }
.chip.me { fill: var(--gold); }
.chip-t { fill: var(--nyu-violet); font-weight: 650; font-size: 27px; }
.chip-t.me { fill: var(--violet-900); }
.legend { font-size: 25px; fill: var(--fg3); }
.dot-r { fill: var(--sb-read); }
.dot-w { fill: var(--sb-write); }
@keyframes hub-out { to { stroke-dashoffset: -32; } }
@keyframes hub-in { to { stroke-dashoffset: 32; } }
</style>
