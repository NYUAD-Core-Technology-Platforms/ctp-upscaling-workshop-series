<!--
  RegressionFitDemo: weighted least-squares polynomial fit (linear, quadratic,
  cubic) to synthetic data with error bars, with residuals, R² and reduced χ².
  Logic and drawing: ../lib/imaging.js (initRegressionFitting).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initRegressionFitting } from '../lib/imaging.js'
const root = useDemo(initRegressionFitting)
</script>

<template>
  <div ref="root" class="demo demo--reverse fit" data-demo="regression-fit">
    <div id="fit-chart-stage" class="demo__stage fit__stage" data-state="loading">
      <canvas id="fit-canvas" aria-label="Interactive polynomial regression showing data with error bars, fitted curve and residuals"></canvas>
    </div>
    <div class="demo__copy">
      <div class="demo__group fit-models" role="group" aria-label="Polynomial degree">
        <span>Model</span>
        <button id="fit-linear" class="demo__btn" type="button" aria-pressed="true" data-degree="1" disabled>Linear</button>
        <button id="fit-quadratic" class="demo__btn" type="button" aria-pressed="false" data-degree="2" disabled>Quadratic</button>
        <button id="fit-cubic" class="demo__btn" type="button" aria-pressed="false" data-degree="3" disabled>Cubic</button>
      </div>
      <div class="demo__actions">
        <button id="fit-run" class="demo__btn demo__btn--primary demo__btn--wide" type="button" disabled>Loading fitter…</button>
        <button id="fit-new-data" class="demo__btn" type="button" disabled>New noisy data</button>
      </div>
      <p id="fit-stage" class="demo__caption" role="status">Synthetic measurements loaded with known vertical uncertainty.</p>
      <div class="demo__metric fit__equation">
        <span>Fitted equation</span>
        <strong id="fit-equation">Choose a model, then fit</strong>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>R²</span><strong id="fit-r2">–</strong></div>
        <div class="demo__metric"><span>Reduced χ²</span><strong id="fit-chi2">–</strong></div>
      </div>
      <p id="fit-check" class="fit__check">Check three things together: the curve, the error bars, and the residuals.</p>
    </div>
  </div>
</template>

<style scoped>
.fit { grid-template-columns: minmax(0, 1fr) 300px; }
.fit__stage { height: 380px; }
.fit__equation strong { font-size: 12px; white-space: normal; line-height: 1.35; }
.fit__check { margin: 0; font-size: 11px; line-height: 1.35; color: var(--fg2); }
</style>
