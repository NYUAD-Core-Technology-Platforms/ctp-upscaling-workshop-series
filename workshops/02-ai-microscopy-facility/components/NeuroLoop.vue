<!--
  NeuroLoop: the NeuroSeg -> NeuroSim -> NeuroTrain -> NeuroSeg learning loop
  with human review in the middle. Hover or focus a node to read its role,
  inputs and outputs. Pure HTML/CSS inside a fixed 884 x 370 stage so it never
  overflows the slide canvas.
-->
<script setup>
const nodes = [
  {
    key: 'seg',
    label: 'Segment + review',
    name: 'NeuroSeg',
    hint: 'Accept a real-data mask and morphology',
    body: 'Segments real IMS volumes at Level 0, then supports calibrated 2D/3D review, editing, physical measurements and accepted reconstruction export.',
    input: 'IMS volume + model checkpoint',
    output: 'reviewed mask + SWC',
  },
  {
    key: 'sim',
    label: 'Simulate',
    name: 'NeuroSim',
    hint: 'Generate calibrated images with exact masks',
    body: 'Uses SWC morphology and reference IMS calibration to generate controlled synthetic 3D fluorescence with aligned dendrite and spine ground-truth masks.',
    input: 'SWC + reference IMS',
    output: 'synthetic image + exact masks',
  },
  {
    key: 'train',
    label: 'Train + predict',
    name: 'NeuroTrain',
    hint: 'Select a model checkpoint for inference',
    body: 'Trains and compares calibrated partial-label 3D models, applies checkpoints to new volumes, and exports reviewed predictions for further training.',
    input: 'labelled or partially labelled volumes',
    output: 'selected model checkpoint',
  },
]
</script>

<template>
  <div class="loop" role="img" aria-label="A triangular learning loop. NeuroSeg passes reviewed masks and SWC morphology to NeuroSim. NeuroSim passes synthetic images and exact masks to NeuroTrain. NeuroTrain passes a selected model checkpoint back to NeuroSeg. Human review decides what enters each new cycle.">
    <svg class="loop__lines" viewBox="0 0 884 370" aria-hidden="true">
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--nyu-violet)" />
        </marker>
      </defs>
      <line x1="372" y1="112" x2="170" y2="248" class="loop__edge" marker-end="url(#loop-arrow)" />
      <line x1="222" y1="310" x2="660" y2="310" class="loop__edge" marker-end="url(#loop-arrow)" />
      <line x1="714" y1="248" x2="512" y2="112" class="loop__edge" marker-end="url(#loop-arrow)" />
    </svg>

    <div v-for="n in nodes" :key="n.key" :class="`loop__node loop__node--${n.key}`" tabindex="0" role="group" :aria-describedby="`loop-tip-${n.key}`">
      <span class="loop__node-label">{{ n.label }}</span>
      <strong class="loop__node-name">{{ n.name }}</strong>
      <small class="loop__node-hint">{{ n.hint }}</small>
      <div :id="`loop-tip-${n.key}`" class="loop__tip" role="tooltip">
        <p>{{ n.body }}</p>
        <span><b>Input</b> {{ n.input }}</span>
        <span><b>Output</b> {{ n.output }}</span>
      </div>
    </div>

    <div class="loop__edge-label loop__edge-label--seg-sim"><b>Reviewed mask + SWC</b><span>NeuroSeg to NeuroSim</span></div>
    <div class="loop__edge-label loop__edge-label--sim-train"><b>Synthetic image + exact masks</b><span>NeuroSim to NeuroTrain</span></div>
    <div class="loop__edge-label loop__edge-label--train-seg"><b>Selected model checkpoint</b><span>NeuroTrain to NeuroSeg</span></div>

    <div class="loop__core">
      <strong>Human review</strong>
      <span>decides what enters the next cycle</span>
    </div>
  </div>
</template>

<style scoped>
.loop {
  position: relative;
  width: 884px;
  height: 370px;
  margin: 0 auto;
}
.loop__lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.loop__edge { stroke: var(--nyu-violet); stroke-width: 1.5; stroke-dasharray: 6 5; }

.loop__node {
  position: absolute;
  z-index: 2;
  width: 180px;
  height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 10px 14px;
  border: 1px solid var(--hairline);
  border-radius: var(--r-2);
  background: var(--bg1);
  text-align: center;
  cursor: help;
  transition: border-color var(--dur-fast) var(--ease-std);
}
.loop__node:hover,
.loop__node:focus-visible { border-color: var(--nyu-violet); outline: none; }
.loop__node--seg { top: 0; left: 352px; }
.loop__node--sim { top: 254px; left: 40px; }
.loop__node--train { top: 254px; left: 664px; }
.loop__node-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracked);
  color: var(--nyu-violet);
}
.loop__node--sim .loop__node-label { color: var(--gold); }
.loop__node-name { font-family: var(--font-serif); font-size: 22px; font-weight: 700; line-height: 1; color: var(--fg1); }
.loop__node-hint { font-size: 11px; line-height: 1.3; color: var(--fg2); }

.loop__tip {
  position: absolute;
  z-index: 20;
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 270px;
  padding: 10px 12px;
  text-align: left;
  border: 1px solid var(--nyu-violet);
  border-radius: var(--r-2);
  background: var(--bg1);
  box-shadow: var(--sh-3);
}
.loop__node:hover .loop__tip,
.loop__node:focus-visible .loop__tip,
.loop__node:focus-within .loop__tip { display: flex; }
.loop__node--seg .loop__tip { top: 0; left: calc(100% + 12px); }
.loop__node--sim .loop__tip { bottom: calc(100% - 20px); left: calc(100% + 12px); }
.loop__node--train .loop__tip { bottom: calc(100% - 20px); right: calc(100% + 12px); }
.loop__tip p { margin: 0; font-size: 11px; line-height: 1.4; color: var(--fg1); }
.loop__tip > span { font-size: 10.5px; line-height: 1.3; color: var(--fg2); }
.loop__tip b { font-weight: 700; color: var(--nyu-violet); margin-right: 4px; text-transform: uppercase; font-size: 9.5px; letter-spacing: var(--tracked-sm); }

.loop__edge-label {
  position: absolute;
  z-index: 3;
  width: 190px;
  display: grid;
  gap: 1px;
  padding: 4px 6px;
  background: var(--bg1);
  text-align: center;
  line-height: 1.2;
}
.loop__edge-label b { font-size: 11px; font-weight: 700; color: var(--fg1); }
.loop__edge-label span { font-size: 9.5px; color: var(--fg3); }
.loop__edge-label--seg-sim { top: 150px; left: 40px; }
.loop__edge-label--sim-train { top: 322px; left: 347px; }
.loop__edge-label--train-seg { top: 150px; left: 654px; }

.loop__core {
  position: absolute;
  z-index: 3;
  top: 178px;
  left: 352px;
  width: 180px;
  display: grid;
  gap: 2px;
  padding: 9px 12px;
  border: 1px solid var(--gold);
  border-radius: var(--r-2);
  background: var(--sand);
  text-align: center;
}
.loop__core strong { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: var(--tracked); color: var(--ink-700); }
.loop__core span { font-size: 10.5px; line-height: 1.3; color: var(--fg2); }
</style>
