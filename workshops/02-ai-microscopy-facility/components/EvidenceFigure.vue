<!--
  EvidenceFigure: a CoreOps screenshot with a caption. Click (or press Enter)
  opens the full-resolution image in a lightbox overlay; Escape, the close
  button or a click on the backdrop closes it.

  Props:
    src      path under public/, e.g. "img/coreops-dashboard.png" (no leading
             slash; the component prefixes Vite's base URL so the deck works
             under the GitHub Pages sub-path as well as at a domain root)
    alt      alt text for the screenshot
    caption  figcaption shown beneath the image
    height   CSS height of the frame (default 330px)
    fit      object-fit for the thumbnail: "contain" (default) or "top"
             (anchors tall screenshots to their top edge)
-->
<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
  height: { type: String, default: '330px' },
  fit: { type: String, default: 'contain' },
})

const base = import.meta.env.BASE_URL || '/'
const url = computed(() => base + props.src.replace(/^\//, ''))
const open = ref(false)

function onKey(event) {
  if (event.key === 'Escape') {
    event.stopPropagation()
    close()
  }
}
function show() {
  open.value = true
  window.addEventListener('keydown', onKey, true)
}
function close() {
  open.value = false
  window.removeEventListener('keydown', onKey, true)
}
onBeforeUnmount(() => window.removeEventListener('keydown', onKey, true))
</script>

<template>
  <figure class="evidence-figure" :style="{ '--frame-height': height }">
    <button class="evidence-figure__button" type="button" :aria-label="`Open full screen: ${alt}`" @click.stop="show">
      <img :src="url" :alt="alt" :class="`evidence-figure__img evidence-figure__img--${fit}`" loading="lazy" />
      <span class="evidence-figure__zoom">Open full screen</span>
    </button>
    <figcaption v-if="caption" class="evidence-figure__caption">{{ caption }}</figcaption>

    <Teleport to="body">
      <div v-if="open" class="evidence-lightbox" role="dialog" aria-modal="true" :aria-label="alt" @click="close">
        <button class="evidence-lightbox__close" type="button" aria-label="Close" @click.stop="close">Close</button>
        <img :src="url" :alt="alt" class="evidence-lightbox__img" @click.stop />
        <p v-if="caption" class="evidence-lightbox__caption">{{ caption }}</p>
      </div>
    </Teleport>
  </figure>
</template>

<style scoped>
.evidence-figure {
  margin: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.evidence-figure__button {
  position: relative;
  display: block;
  width: 100%;
  height: var(--frame-height);
  padding: 0;
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
  background: var(--bg2);
  overflow: hidden;
  cursor: zoom-in;
  transition: border-color var(--dur-fast) var(--ease-std);
}
.evidence-figure__button:hover { border-color: var(--nyu-violet); }
.evidence-figure__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
.evidence-figure__img--top { object-fit: cover; object-position: top center; }
.evidence-figure__zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracked-sm);
  color: var(--white);
  background: var(--nyu-violet);
  border-radius: var(--r-pill);
  padding: 3px 9px;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-std);
}
.evidence-figure__button:hover .evidence-figure__zoom,
.evidence-figure__button:focus-visible .evidence-figure__zoom { opacity: 1; }
.evidence-figure__caption {
  font-size: 11px;
  color: var(--fg2);
  line-height: 1.3;
}
</style>

<style>
/* Lightbox is teleported to <body>, outside the scoped tree, so it is global. */
.evidence-lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 32px 24px;
  background: rgba(31, 2, 51, 0.92);
  cursor: zoom-out;
}
.evidence-lightbox__img {
  max-width: 100%;
  max-height: calc(100vh - 110px);
  object-fit: contain;
  border: 1px solid #4A0577;
  border-radius: 4px;
  background: #fff;
  cursor: default;
}
.evidence-lightbox__caption {
  margin: 0;
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #C9A6E0;
}
.evidence-lightbox__close {
  position: absolute;
  top: 14px;
  right: 16px;
  font: 600 12px 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  background: transparent;
  border: 1px solid #C9A6E0;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}
.evidence-lightbox__close:hover { background: #57068C; border-color: #57068C; }
</style>
