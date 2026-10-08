<!--
  LensObjectiveDemo: a focused Gaussian beam through a singlet or a corrected
  doublet. Shows the diffraction-limited waist and the chromatic focus shift
  (singlet only). Model and drawing: ../lib/optics.js (initLensObjective).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initLensObjective } from '../lib/optics.js'
const root = useDemo(initLensObjective)
</script>

<template>
  <div ref="root" class="demo demo--reverse lens" data-demo="lens-objective">
    <div class="demo__stage"><canvas id="lens-canvas" aria-label="Interactive focused Gaussian beam simulation"></canvas></div>
    <div class="demo__copy">
      <div class="demo__group" role="group" aria-label="Lens design">
        <span>Lens design</span>
        <button id="lens-singlet" class="demo__btn" type="button" aria-pressed="true">Singlet</button>
        <button id="lens-doublet" class="demo__btn" type="button" aria-pressed="false">Corrected doublet</button>
      </div>
      <div class="demo__controls">
        <label>Focal length <output data-output-for="lens-focal">40 mm</output><input id="lens-focal" type="range" min="10" max="100" value="40" step="1"></label>
        <label>Input beam radius <output data-output-for="lens-input">2.5 mm</output><input id="lens-input" type="range" min="0.5" max="5" value="2.5" step="0.1"></label>
        <label>Wavelength <output data-output-for="lens-wave">550 nm</output><input id="lens-wave" type="range" min="450" max="700" value="550" step="5"></label>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Est. waist</span><strong id="lens-waist">–</strong></div>
        <div class="demo__metric"><span>Divergence</span><strong id="lens-div">–</strong></div>
        <div class="demo__metric"><span>Focus shift</span><strong id="lens-shift">–</strong></div>
      </div>
      <p id="lens-aberration" class="demo__caption" aria-live="polite">At 550 nm, the singlet focus defines the reference plane.</p>
      <p class="demo__equation"><span>f(λ) ∝ 1 / [n(λ) − 1]</span><span>w₀ ≈ λf / (πwᵢₙ)</span></p>
    </div>
  </div>
</template>

<style scoped>
.lens { grid-template-columns: minmax(0, 1fr) 320px; }
.lens .demo__copy { gap: var(--s-2); }
.lens .demo__metric strong { font-size: 13px; }
.lens .demo__equation { width: 100%; justify-content: space-between; }
.lens .demo__caption { min-height: 0; }
</style>
