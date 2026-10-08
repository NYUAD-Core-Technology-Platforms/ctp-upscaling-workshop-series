/**
 * useDemo(init): mount/unmount glue for the canvas demos in ../lib.
 *
 * `init(rootElement)` is one of the exported init functions from optics.js or
 * imaging.js. It is called once the component's root element exists and the
 * returned destroy() runs before unmount, so animation frames and observers
 * never outlive the slide. Slidev keeps neighbouring slides mounted (hidden),
 * which is why the demos query their controls inside their own root instead
 * of the document.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useDemo(init) {
  const root = ref(null)
  let destroy = null
  onMounted(() => {
    if (root.value) destroy = init(root.value) || null
  })
  onBeforeUnmount(() => {
    if (destroy) destroy()
    destroy = null
  })
  return root
}
