<!--
  RasterScanDemo: the detector measurement repeated over an x-y grid until the
  frame is complete. Scan speed slider, start and reset buttons.
  Drawing: ../lib/imaging.js (initRaster).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initRaster } from '../lib/imaging.js'
const root = useDemo(initRaster)
</script>

<template>
  <div ref="root" class="demo demo--reverse" data-demo="raster-scan">
    <div class="demo__stage"><canvas id="raster-canvas" aria-label="Animated point-by-point raster scan"></canvas></div>
    <div class="demo__copy">
      <p class="demo__lead">The detector measurement is repeated at successive x-y positions until the grid becomes an image.</p>
      <div class="demo__controls">
        <label>Scan speed <output data-output-for="raster-speed">1.0×</output><input id="raster-speed" type="range" min="0.5" max="3" value="1" step="0.25"></label>
      </div>
      <div class="demo__actions">
        <button id="raster-play" class="demo__btn demo__btn--primary demo__btn--wide" type="button">Start raster scan</button>
        <button id="raster-reset" class="demo__btn" type="button">Reset</button>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Frame progress</span><strong id="raster-progress">0%</strong></div>
      </div>
      <p class="demo__caption"><strong>Longer dwell</strong> → more sampled photons → slower acquisition and more light dose</p>
    </div>
  </div>
</template>
