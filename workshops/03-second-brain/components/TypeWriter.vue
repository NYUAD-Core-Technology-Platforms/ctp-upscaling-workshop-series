<!--
  TypeWriter: types `text` out each time its slide becomes active, with a caret.
  Full text in print, overview and reduced-motion. Newlines are kept.
-->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ text: string; delay?: number; speed?: number }>(), { delay: 600, speed: 14 })
const { $page, $nav, $renderContext } = useSlideContext()
const n = ref(props.text.length)
const typing = ref(false)
let t = 0

const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const isActive = () => $renderContext.value === 'slide' && $nav.value.currentPage === $page.value

function run() {
  clearTimeout(t)
  if (still) { n.value = props.text.length; return }
  n.value = 0
  typing.value = true
  const tick = () => {
    n.value = Math.min(props.text.length, n.value + 2)
    if (n.value < props.text.length) t = window.setTimeout(tick, props.speed * 2)
    else typing.value = false
  }
  t = window.setTimeout(tick, props.delay)
}
onMounted(() => { if (isActive()) run() })
watch(isActive, v => { if (v) run(); else { clearTimeout(t); n.value = props.text.length; typing.value = false } })
onBeforeUnmount(() => clearTimeout(t))
</script>

<template><span class="sb-typed">{{ text.slice(0, n) }}<span v-if="typing" class="sb-caret" /></span></template>

<style scoped>
.sb-typed { white-space: pre-wrap; }
.sb-caret { display: inline-block; width: .55em; height: 1.05em; background: var(--gold); vertical-align: -.16em; margin-left: 2px; animation: sb-blink 1s steps(1) infinite; }
</style>
