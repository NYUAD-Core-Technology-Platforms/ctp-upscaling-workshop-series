<!-- components/Counter.vue, a tiny interactive component for slides -->
<template>
  <button class="counter" @click="count++">
    Clicked {{ count }} time{{ count === 1 ? '' : 's' }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<style scoped>
.counter {
  font-family: var(--ctp-font-mono);
  padding: 0.5em 1em;
  border-radius: var(--ctp-radius-sm);
  border: 1px solid var(--ctp-color-violet);
  background: var(--ctp-color-paper-warm);
  cursor: pointer;
}
.counter:hover { background: var(--ctp-color-accent-soft); }
</style>
