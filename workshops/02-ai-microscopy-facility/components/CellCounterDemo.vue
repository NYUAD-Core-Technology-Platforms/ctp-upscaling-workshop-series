<!--
  CellCounterDemo: threshold + minimum-size segmentation on a synthetic
  fluorescence image, with the overlay that exposes misses, merges and false
  detections. Drawing and analysis: ../lib/imaging.js (initCellCounter).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initCellCounter } from '../lib/imaging.js'
const root = useDemo(initCellCounter)
</script>

<template>
  <div ref="root" class="demo demo--reverse" data-demo="cell-counter">
    <div class="demo__stage"><canvas id="cell-canvas" aria-label="Synthetic fluorescence cell-counting demonstration"></canvas></div>
    <div class="demo__copy">
      <p class="demo__lead">The count is only trustworthy when the segmentation overlay exposes misses, merges and false detections.</p>
      <div class="demo__controls">
        <label>Detection threshold <output data-output-for="cell-threshold">55%</output><input id="cell-threshold" type="range" min="20" max="90" value="55" step="1"></label>
        <label>Minimum object size <output data-output-for="cell-size">18 px</output><input id="cell-size" type="range" min="6" max="45" value="18" step="1"></label>
      </div>
      <div class="demo__actions">
        <button id="cell-run" class="demo__btn demo__btn--primary demo__btn--wide" type="button">Run segmentation</button>
        <button id="cell-reset" class="demo__btn" type="button">Reset</button>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Detected objects</span><strong id="cell-count">–</strong></div>
        <div class="demo__metric demo__metric--wrap"><span>Pipeline</span><strong id="cell-stage">Ready</strong></div>
      </div>
      <div class="demo__steps" aria-label="AI-assisted cell-counting development loop"><span>Describe</span><i>→</i><span>Build</span><i>→</i><span>Inspect</span><i>→</i><span>Correct</span><i>↺</i></div>
    </div>
  </div>
</template>
