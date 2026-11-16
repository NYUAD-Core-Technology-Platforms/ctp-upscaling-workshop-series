<!--
  CountUp: counts from 0 to `to` each time its slide becomes active.
  Shows the final number in print, overview and reduced-motion.
-->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ to: number; delay?: number; dur?: number }>(), { delay: 0, dur: 1300 })
const { $page, $nav, $renderContext } = useSlideContext()
const shown = ref(props.to)
let t = 0
let raf = 0

const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const isActive = () => $renderContext.value === 'slide' && $nav.value.currentPage === $page.value

function run() {
  clearTimeout(t); cancelAnimationFrame(raf)
  if (still) { shown.value = props.to; return }
  shown.value = 0
  t = window.setTimeout(() => {
    const t0 = performance.now()
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / props.dur)
      shown.value = Math.round(props.to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    step()
  }, props.delay)
}
onMounted(() => { if (isActive()) run() })
watch(isActive, v => { if (v) run(); else { clearTimeout(t); cancelAnimationFrame(raf); shown.value = props.to } })
onBeforeUnmount(() => { clearTimeout(t); cancelAnimationFrame(raf) })
</script>

<template><span class="sb-count">{{ shown }}</span></template>

<style scoped>
.sb-count { font-variant-numeric: tabular-nums; }
</style>
