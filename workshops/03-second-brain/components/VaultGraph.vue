<!--
  VaultGraph: a drifting knowledge graph with travelling signals, drawn the way
  Obsidian's graph view looks (notes and the links between them). Pure SVG,
  no libraries. Animates only while its slide is the active one; in print,
  overview or reduced-motion it stays still.
  Data: vault-graph.json (four clusters around one index node).
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import data from './vault-graph.json'

const props = withDefaults(defineProps<{ pulses?: boolean }>(), { pulses: true })

const { $page, $nav, $renderContext } = useSlideContext()

const fills: Record<string, string> = {
  ink: 'var(--sb-g-ink)',
  a: 'var(--sb-g-a)',
  b: 'var(--sb-g-b)',
  c: 'var(--sb-g-c)',
  d: 'var(--sb-g-d)',
}

type N = { x: number; y: number; r: number; f: string; o: number; cls: string; ax: number; ay: number; fx: number; fy: number; px: number; py: number }
const nodes: N[] = (data.nodes as any[]).map(([x, y, r, c, o, cls]) => ({
  x, y, r, f: fills[c], o, cls,
  ax: 5 + Math.random() * 8, ay: 5 + Math.random() * 8,
  fx: 0.00022 + Math.random() * 0.0003, fy: 0.00022 + Math.random() * 0.0003,
  px: Math.random() * 6.283, py: Math.random() * 6.283,
}))
const edges = data.edges as [number, number][]

const pos = ref(nodes.map(n => [n.x, n.y]))
type P = { id: number; e: number; t0: number; dur: number; rev: boolean; x: number; y: number; o: number; f: string }
const live = ref<P[]>([])
let raf = 0
let last = 0
let seq = 0

function isActive() {
  return $renderContext.value === 'slide' && $nav.value.currentPage === $page.value
}
const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function frame(ts: number) {
  pos.value = nodes.map(n => [n.x + n.ax * Math.sin(ts * n.fx + n.px), n.y + n.ay * Math.cos(ts * n.fy + n.py)])
  if (props.pulses) {
    if (ts - last > 480 && live.value.length < 6) {
      last = ts
      const e = Math.floor(Math.random() * edges.length)
      live.value.push({ id: seq++, e, t0: ts, dur: 900 + Math.random() * 800, rev: Math.random() < 0.5, x: 0, y: 0, o: 0, f: nodes[edges[e][1]].f })
    }
    live.value = live.value.filter((p) => {
      const k = (ts - p.t0) / p.dur
      if (k >= 1) return false
      const [a, b] = p.rev ? [edges[p.e][1], edges[p.e][0]] : edges[p.e]
      const A = pos.value[a]
      const B = pos.value[b]
      p.x = A[0] + (B[0] - A[0]) * k
      p.y = A[1] + (B[1] - A[1]) * k
      p.o = Math.sin(Math.PI * k)
      return true
    })
  }
  raf = requestAnimationFrame(frame)
}
function start() { if (!raf && !still) raf = requestAnimationFrame(frame) }
function stop() { cancelAnimationFrame(raf); raf = 0; live.value = [] }

onMounted(() => { if (isActive()) start() })
watch(() => isActive(), v => (v ? start() : stop()))
onBeforeUnmount(stop)
</script>

<template>
  <svg class="sb-graph" viewBox="0 0 1000 1000" aria-hidden="true">
    <g class="sb-graph__edges">
      <line v-for="([a, b], i) in edges" :key="i" :x1="pos[a][0]" :y1="pos[a][1]" :x2="pos[b][0]" :y2="pos[b][1]" />
    </g>
    <g>
      <circle v-for="p in live" :key="p.id" r="4.6" :cx="p.x" :cy="p.y" :fill="p.f" :opacity="p.o" />
    </g>
    <g>
      <circle
        v-for="(n, i) in nodes" :key="i"
        :class="n.cls ? 'sb-graph__' + n.cls : ''"
        :cx="pos[i][0]" :cy="pos[i][1]" :r="n.r" :fill="n.f" :fill-opacity="n.o"
      />
    </g>
  </svg>
</template>

<style scoped>
.sb-graph {
  --sb-g-ink: var(--nyuad-deep-violet);
  --sb-g-a: var(--nyu-violet);
  --sb-g-b: var(--gold);
  --sb-g-c: var(--violet-300);
  --sb-g-d: var(--ink-500);
  display: block;
}
.sb-graph__edges line { stroke: var(--violet-200); stroke-width: 1.6; }
.sb-graph__hubn, .sb-graph__idx { transform-box: fill-box; transform-origin: center; animation: sb-hubpulse 3.2s ease-in-out infinite; }
.sb-graph__idx { animation-duration: 4.4s; }
@keyframes sb-hubpulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.28); } }
</style>
