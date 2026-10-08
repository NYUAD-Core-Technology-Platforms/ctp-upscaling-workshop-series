<!--
  ObjectAnalysisDemo: segmented objects become a measurement table, then a
  histogram or violin plot, then a two-population comparison. All values are
  deterministic synthetic data. Logic and drawing: ../lib/imaging.js
  (initObjectMeasurements).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initObjectMeasurements } from '../lib/imaging.js'
const root = useDemo(initObjectMeasurements)
</script>

<template>
  <div ref="root" class="demo objects" data-demo="object-analysis">
    <div class="demo__copy">
      <div class="demo__actions objects__actions">
        <button id="objects-build-table" class="demo__btn demo__btn--primary" type="button" disabled>Loading analysis…</button>
        <button id="objects-plot-histogram" class="demo__btn" type="button" disabled>2 · Plot</button>
        <button id="objects-compare-groups" class="demo__btn" type="button" disabled>3 · Compare groups</button>
        <button id="objects-reset" class="demo__btn" type="button" disabled>Reset</button>
      </div>
      <div class="demo__group" role="group" aria-label="Choose how to plot the same measurements">
        <span>Plot style</span>
        <button id="objects-plot-type-histogram" class="demo__btn" type="button" aria-pressed="true" disabled>Histogram</button>
        <button id="objects-plot-type-violin" class="demo__btn" type="button" aria-pressed="false" disabled>Violin</button>
        <small class="objects__hint">same values, different view</small>
      </div>
      <p id="objects-stage" class="demo__caption" role="status">Ready · segmented objects are waiting to be measured.</p>
      <div class="objects__table-wrap">
        <table class="objects__table">
          <caption class="sr-only">Object measurements</caption>
          <thead><tr><th scope="col">ID</th><th scope="col">Area <span>µm²</span></th><th scope="col">Eq. diam. <span>µm</span></th><th scope="col">Mean int. <span>0–1</span></th></tr></thead>
          <tbody id="objects-table-body"><tr class="table-empty"><td colspan="4">Run "Build table" to calculate per-object features.</td></tr></tbody>
        </table>
      </div>
      <p class="objects__disclaimer">Synthetic demonstration. "Control" and "Wild type" are illustrative labels, not experimental results.</p>
    </div>
    <div class="objects__visual">
      <div id="objects-chart-stage" class="demo__stage demo__stage--short" data-state="loading">
        <canvas id="objects-canvas" aria-label="Animated plots of object-area measurements and a synthetic comparison of Control and Wild type distributions"></canvas>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Control median</span><strong id="objects-control-mean">–</strong></div>
        <div class="demo__metric"><span>Wild type median</span><strong id="objects-wt-mean">–</strong></div>
        <div class="demo__metric"><span>Median shift</span><strong id="objects-delta">–</strong></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.objects { grid-template-columns: 330px minmax(0, 1fr); }
.objects__actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.objects__hint { font-size: 10px; color: var(--fg3); }
.objects__visual { display: flex; flex-direction: column; gap: var(--s-3); min-width: 0; }
.objects__table-wrap {
  height: 128px;
  overflow: auto;
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
}
.objects__table { border-collapse: collapse; width: 100%; font-size: 11px; }
.objects__table th,
.objects__table td { padding: 3px 8px; text-align: right; border-bottom: 1px solid var(--hairline); white-space: nowrap; }
.objects__table th:first-child,
.objects__table td:first-child { text-align: left; }
.objects__table th {
  position: sticky; top: 0;
  background: var(--bg2);
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: var(--tracked-sm);
  color: var(--fg2);
}
.objects__table th span { text-transform: none; letter-spacing: 0; color: var(--fg3); }
.objects__table td { font-family: var(--font-mono); font-variant-numeric: tabular-nums; color: var(--fg1); }
.objects__table tbody tr.is-entering { animation: objects-row-in var(--dur-slow) var(--ease-std) both; }
.objects__table .table-empty td,
.objects__table .table-more td { font-family: var(--font-sans); text-align: left; color: var(--fg3); white-space: normal; }
@keyframes objects-row-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.objects__disclaimer { margin: 0; font-size: 10px; line-height: 1.3; color: var(--fg3); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
