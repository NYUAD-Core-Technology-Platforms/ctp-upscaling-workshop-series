<!--
  AlignmentDemo: two-mirror laser alignment through a near and a far iris.
  Sliders trim each mirror; the guided animations show the correct sequence
  (Mirror 1 for the near iris, Mirror 2 for the far iris, iterate) and the
  wrong one. The SVG scene is built by ../lib/optics.js (initAlignment).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initAlignment } from '../lib/optics.js'
const root = useDemo(initAlignment)
</script>

<template>
  <div ref="root" class="demo demo--reverse align" data-demo="alignment">
    <div class="align__left">
      <div class="demo__stage align__stage">
        <svg id="alignment-scene" viewBox="0 0 760 360" role="img" aria-label="Two-mirror laser alignment simulation"></svg>
      </div>
      <div class="demo__actions align__actions">
        <button id="align-misalign" class="demo__btn" type="button">Introduce misalignment</button>
        <button id="align-converge" class="demo__btn demo__btn--primary" type="button">Animate convergence</button>
        <button id="align-diverge" class="demo__btn" type="button">Animate wrong sequence</button>
        <button id="align-perfect" class="demo__btn" type="button">Perfect alignment</button>
      </div>
    </div>
    <div class="demo__copy">
      <div class="demo__controls">
        <label>Mirror 1 trim <output data-output-for="align-m1">0.00°</output><input id="align-m1" type="range" min="-4" max="4" value="0" step="0.05"></label>
        <label>Mirror 2 trim <output data-output-for="align-m2">0.00°</output><input id="align-m2" type="range" min="-4" max="4" value="0" step="0.05"></label>
      </div>
      <ol class="align__method" aria-label="Correct two-iris alignment sequence">
        <li data-align-step="near"><b>1</b><span><strong>Mirror 1</strong>Near iris</span></li>
        <li data-align-step="far"><b>2</b><span><strong>Mirror 2</strong>Far iris</span></li>
        <li data-align-step="repeat"><b>3</b><span><strong>Repeat</strong>Until both agree</span></li>
      </ol>
      <div class="demo__metrics demo__metrics--wrap">
        <div class="demo__metric"><span>Near iris error</span><strong id="align-near">0.00 mm</strong></div>
        <div class="demo__metric"><span>Far iris error</span><strong id="align-far">0.00 mm</strong></div>
        <div class="demo__metric"><span>Output angle</span><strong id="align-angle">0.00°</strong></div>
        <div class="demo__metric"><span>Alignment</span><strong id="align-status">Aligned</strong></div>
      </div>
      <p id="align-explanation" class="demo__caption" aria-live="polite">Both irises are centered. The beam has the correct position and angle.</p>
    </div>
  </div>
</template>

<style scoped>
.align { grid-template-columns: minmax(0, 1fr) 320px; }
.align__left { display: flex; flex-direction: column; gap: var(--s-2); min-width: 0; order: 1; }
.align__stage { height: 300px; }
.align__left .demo__stage { order: 0; }
.align__actions { order: 1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
.align .demo__copy { gap: var(--s-2); }
.align .demo__controls { padding: 8px 12px; gap: 4px; }
.align .demo__metric { padding: 4px 8px; }
.align .demo__metric strong { font-size: 13px; }
.align .demo__btn { padding: 6px 6px; font-size: 11px; }
.align .demo__caption { min-height: 0; font-size: 11.5px; }
.align__method {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.align__method li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  padding: 5px 7px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
  background: var(--bg1);
  transition: border-color var(--dur-std) var(--ease-std), background var(--dur-std) var(--ease-std);
}
.align__method li b {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: var(--r-pill);
  background: var(--violet-050);
  color: var(--nyu-violet);
  font-family: var(--font-mono);
  font-size: 10px;
}
.align__method li span { display: block; font-size: 9.5px; line-height: 1.2; color: var(--fg2); }
.align__method li strong { display: block; font-size: 10.5px; color: var(--fg1); }
.align__method li.is-active { border-color: var(--gold); background: rgba(201, 154, 30, 0.08); }
.align__method li.is-failure { border-color: var(--danger); background: rgba(176, 0, 32, 0.06); }

/* Classes the simulation toggles on SVG elements while a guided run plays. */
.align__stage :deep(.alignment-highlight-control) { stroke: #E8B946; stroke-width: 10; filter: url(#align-beam-glow); }
.align__stage :deep(.alignment-highlight-target) { stroke: #E8B946; stroke-width: 5; filter: url(#align-beam-glow); }
.align__stage :deep(.alignment-failure-control),
.align__stage :deep(.alignment-failure-target) { stroke: #ff7285; }
</style>
