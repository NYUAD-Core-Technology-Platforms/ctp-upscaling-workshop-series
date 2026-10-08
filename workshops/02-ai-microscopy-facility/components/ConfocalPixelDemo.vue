<!--
  ConfocalPixelDemo: animates the sequence that produces one confocal pixel
  (focus, emit, reject out-of-focus light, detect, integrate). Dwell time and
  pinhole size change the animation. Drawing: ../lib/imaging.js (initConfocal).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initConfocal } from '../lib/imaging.js'
const root = useDemo(initConfocal)
</script>

<template>
  <div ref="root" class="demo" data-demo="confocal-pixel">
    <div class="demo__copy">
      <p class="demo__lead">Every pixel is one timed photon measurement, not a tiny photograph.</p>
      <div class="demo__controls">
        <label>Pixel dwell time <output data-output-for="confocal-dwell">4 µs</output><input id="confocal-dwell" type="range" min="1" max="12" value="4" step="1"></label>
        <label>Pinhole size <output data-output-for="confocal-pinhole">1.0 AU</output><input id="confocal-pinhole" type="range" min="0.4" max="2" value="1" step="0.1"></label>
      </div>
      <div class="demo__actions">
        <button id="confocal-play" class="demo__btn demo__btn--primary demo__btn--wide" type="button">Generate one pixel</button>
      </div>
      <p id="confocal-stage" class="demo__caption" aria-live="polite">Ready: focus the excitation spot in the sample.</p>
      <ol class="demo__steps micro-sequence">
        <li>Focus</li><li>Emit</li><li>Reject out-of-focus light</li><li>Detect</li><li>Integrate</li>
      </ol>
    </div>
    <div class="demo__stage"><canvas id="confocal-canvas" aria-label="Animated confocal one-pixel measurement"></canvas></div>
  </div>
</template>
