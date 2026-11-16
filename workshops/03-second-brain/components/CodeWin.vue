<!--
  CodeWin: a dark editor/terminal window around a pre block.
  With `reveal`, the lines of the slotted pre appear one by one each time the
  slide is shown (pure CSS, restarts with Slidev's v-show).
  In slides.md keep the pre inside the tag with NO blank lines: write an empty
  line as a single zero-width space entity so Markdown keeps one HTML block.
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{ tab: string; rt?: string; reveal?: boolean; lstep?: number; l0?: number }>(), {
  rt: '', reveal: false, lstep: 80, l0: 250,
})
const body = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!props.reveal || !body.value) return
  const pre = body.value.querySelector('pre')
  if (!pre || pre.dataset.sbWrapped) return
  pre.dataset.sbWrapped = '1'
  pre.innerHTML = pre.innerHTML
    .replace(/^\n/, '')
    .split('\n')
    .map((l, i) => `<span class="sb-ln" style="--l:${i}">${l === '' ? '&#8203;' : l}</span>`)
    .join('')
})
</script>

<template>
  <div class="sb-win">
    <div class="sb-win__bar"><i /><i /><i /><span class="sb-win__tab">{{ tab }}</span><span v-if="rt" class="sb-win__rt">{{ rt }}</span></div>
    <div ref="body" class="sb-win__body" :style="{ '--lstep': lstep + 'ms', '--l0': l0 + 'ms' }"><slot /></div>
  </div>
</template>

<style scoped>
.sb-win__body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
</style>
