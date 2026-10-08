<!--
  ScanHeadFrame: embeds the interactive 3D confocal scan-head model that lives
  as a standalone page in public/scan-head/ (three.js, bundled locally). The
  iframe src is prefixed with Vite's base URL so it resolves on GitHub Pages.
  The page needs WebGL; static exports (PDF/PPTX) show whatever the headless
  browser renders, which is why the slide keeps a one-line description too.
-->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const base = import.meta.env.BASE_URL || '/'
const src = base + 'scan-head/index.html'

// Slidev keeps neighbouring slides mounted but hidden. Creating the iframe only
// once this slide is actually visible avoids running a WebGL render loop (and
// its zero-size framebuffer warnings) while the slide is off screen.
const root = ref(null)
const loaded = ref(false)
let observer = null
onMounted(() => {
  if (!root.value) return
  if (!('IntersectionObserver' in window)) { loaded.value = true; return }
  observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      loaded.value = true
      observer?.disconnect()
      observer = null
    }
  })
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="scan-head">
    <iframe
      v-if="loaded"
      :src="src"
      class="scan-head__frame"
      title="Interactive SP8-inspired confocal scan head showing excitation, XY scanning, focusing and fluorescence detection"
      loading="lazy"
      allow="fullscreen"
    ></iframe>
  </div>
</template>

<style scoped>
.scan-head {
  height: 405px;
  border: 1px solid var(--violet-700);
  border-radius: var(--r-3);
  overflow: hidden;
  background: var(--violet-900);
}
.scan-head__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
