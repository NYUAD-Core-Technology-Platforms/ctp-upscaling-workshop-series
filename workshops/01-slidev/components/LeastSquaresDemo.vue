<!--
  LeastSquaresDemo: an interactive ordinary-least-squares (OLS) linear
  regression. Buttons change the data-generating parameters (true slope,
  noise level, sample size) and the chart re-fits live, so you can see how
  each parameter moves the best-fit line and the goodness of fit (R squared).

  Pure client-side: a small seeded RNG generates the points, the regression
  is computed in JS, and everything is drawn with inline SVG. No external
  charting library, so nothing extra ships in the published deck.
-->
<script setup lang="ts">
import { ref, computed } from 'vue'

// Data-generating parameters the user can play with.
const trueSlope = ref(1.4)
const noise = ref(1.2)
const n = ref(40)
const seed = ref(7)

// True intercept is fixed; the demo focuses on slope, noise, and sample size.
const TRUE_INTERCEPT = 2

// Bounds so the buttons stay sensible.
const SLOPE = { min: -3, max: 3, step: 0.2 }
const NOISE = { min: 0, max: 4, step: 0.2 }
const N = { min: 5, max: 120, step: 5 }

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}
function snap(v: number, p: { min: number; max: number }) {
  return Math.round(clamp(v, p.min, p.max) * 100) / 100
}
// Mutate the refs directly from script scope. Do NOT pass a ref through the
// template (e.g. bump(SLOPE, trueSlope, dir)): in script-setup, template refs
// are auto-unwrapped to plain numbers, so the function would get a number and
// `r.value = ...` would silently no-op. This was the "buttons do nothing" bug.
function stepSlope(dir: number) {
  trueSlope.value = snap(trueSlope.value + dir * SLOPE.step, SLOPE)
}
function stepNoise(dir: number) {
  noise.value = snap(noise.value + dir * NOISE.step, NOISE)
}
function stepN(dir: number) {
  n.value = snap(n.value + dir * N.step, N)
}

// Mulberry32: tiny deterministic RNG so a fixed seed gives reproducible data.
// Changing one parameter then isolates that parameter's effect on the fit.
function makeRng(s: number) {
  let a = s >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// Box-Muller standard normal from two uniforms.
function gauss(rng: () => number) {
  const u = Math.max(rng(), 1e-9)
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const X_MIN = 0
const X_MAX = 10

// Generate the synthetic sample: y = slope*x + intercept + Gaussian noise.
const points = computed(() => {
  const rng = makeRng(seed.value)
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < n.value; i++) {
    const x = X_MIN + (X_MAX - X_MIN) * rng()
    const y = trueSlope.value * x + TRUE_INTERCEPT + noise.value * gauss(rng)
    out.push({ x, y })
  }
  return out
})

// Ordinary least squares: closed-form slope and intercept, plus R squared.
const fit = computed(() => {
  const pts = points.value
  const m = pts.length
  let sx = 0, sy = 0, sxx = 0, sxy = 0
  for (const p of pts) {
    sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y
  }
  const denom = m * sxx - sx * sx
  const slope = denom === 0 ? 0 : (m * sxy - sx * sy) / denom
  const intercept = (sy - slope * sx) / m
  const meanY = sy / m
  let ssTot = 0, ssRes = 0
  for (const p of pts) {
    const pred = slope * p.x + intercept
    ssTot += (p.y - meanY) ** 2
    ssRes += (p.y - pred) ** 2
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot
  return { slope, intercept, r2 }
})

// --- SVG geometry ---
const W = 560
const H = 300
const PAD = { l: 44, r: 16, t: 16, b: 34 }
const plotW = W - PAD.l - PAD.r
const plotH = H - PAD.t - PAD.b

// Y range adapts to the data so the line is always framed nicely.
const yRange = computed(() => {
  const ys = points.value.map((p) => p.y)
  let lo = Math.min(...ys, 0)
  let hi = Math.max(...ys, 1)
  const pad = (hi - lo) * 0.08 || 1
  return { lo: lo - pad, hi: hi + pad }
})

function sx(x: number) {
  return PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * plotW
}
function sy(y: number) {
  const { lo, hi } = yRange.value
  return PAD.t + (1 - (y - lo) / (hi - lo)) * plotH
}

const screenPoints = computed(() =>
  points.value.map((p) => ({ cx: sx(p.x), cy: sy(p.y) })),
)
// Endpoints of the fitted line across the x-domain.
const fitLine = computed(() => {
  const { slope, intercept } = fit.value
  return {
    x1: sx(X_MIN), y1: sy(slope * X_MIN + intercept),
    x2: sx(X_MAX), y2: sy(slope * X_MAX + intercept),
  }
})
const ticksX = [0, 2, 4, 6, 8, 10]

function resample() {
  seed.value = (seed.value * 1664525 + 1013904223) >>> 0
}
function reset() {
  trueSlope.value = 1.4
  noise.value = 1.2
  n.value = 40
  seed.value = 7
}
</script>

<template>
  <div class="lsq">
    <!-- Chart -->
    <svg class="lsq__chart" :viewBox="`0 0 ${W} ${H}`" role="img"
         aria-label="Scatter plot with least-squares fitted line">
      <!-- axes -->
      <line :x1="PAD.l" :y1="PAD.t" :x2="PAD.l" :y2="H - PAD.b" class="lsq__axis" />
      <line :x1="PAD.l" :y1="H - PAD.b" :x2="W - PAD.r" :y2="H - PAD.b" class="lsq__axis" />
      <!-- x ticks -->
      <g v-for="t in ticksX" :key="t">
        <line :x1="sx(t)" :y1="H - PAD.b" :x2="sx(t)" :y2="H - PAD.b + 4" class="lsq__axis" />
        <text :x="sx(t)" :y="H - PAD.b + 16" class="lsq__tick" text-anchor="middle">{{ t }}</text>
      </g>
      <!-- residuals: faint verticals from each point to the fitted line -->
      <line v-for="(p, i) in points" :key="'r' + i"
            :x1="sx(p.x)" :y1="sy(p.y)"
            :x2="sx(p.x)" :y2="sy(fit.slope * p.x + fit.intercept)"
            class="lsq__resid" />
      <!-- data points -->
      <circle v-for="(p, i) in screenPoints" :key="'p' + i"
              :cx="p.cx" :cy="p.cy" r="3.5" class="lsq__pt" />
      <!-- fitted line -->
      <line :x1="fitLine.x1" :y1="fitLine.y1" :x2="fitLine.x2" :y2="fitLine.y2"
            class="lsq__fit" />
    </svg>

    <!-- Controls + readout -->
    <div class="lsq__panel">
      <div class="lsq__ctl">
        <span class="lsq__label">True slope</span>
        <div class="lsq__stepper">
          <button class="lsq__btn" @click.stop="stepSlope(-1)">−</button>
          <span class="lsq__val">{{ trueSlope.toFixed(1) }}</span>
          <button class="lsq__btn" @click.stop="stepSlope(1)">+</button>
        </div>
      </div>

      <div class="lsq__ctl">
        <span class="lsq__label">Noise σ</span>
        <div class="lsq__stepper">
          <button class="lsq__btn" @click.stop="stepNoise(-1)">−</button>
          <span class="lsq__val">{{ noise.toFixed(1) }}</span>
          <button class="lsq__btn" @click.stop="stepNoise(1)">+</button>
        </div>
      </div>

      <div class="lsq__ctl">
        <span class="lsq__label">Sample size n</span>
        <div class="lsq__stepper">
          <button class="lsq__btn" @click.stop="stepN(-1)">−</button>
          <span class="lsq__val">{{ n }}</span>
          <button class="lsq__btn" @click.stop="stepN(1)">+</button>
        </div>
      </div>

      <div class="lsq__actions">
        <button class="lsq__btn lsq__btn--wide" @click.stop="resample">↻ Resample</button>
        <button class="lsq__btn lsq__btn--ghost" @click.stop="reset">Reset</button>
      </div>

      <div class="lsq__readout">
        <div class="lsq__stat">
          <span class="lsq__statk">Fitted line</span>
          <span class="lsq__statv">ŷ = {{ fit.slope.toFixed(2) }}·x + {{ fit.intercept.toFixed(2) }}</span>
        </div>
        <div class="lsq__stat">
          <span class="lsq__statk">True line</span>
          <span class="lsq__statv">y = {{ trueSlope.toFixed(1) }}·x + {{ TRUE_INTERCEPT }}</span>
        </div>
        <div class="lsq__stat">
          <span class="lsq__statk">R²</span>
          <span class="lsq__statv">{{ fit.r2.toFixed(3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lsq {
  display: grid;
  grid-template-columns: 1fr 230px;
  gap: var(--s-5);
  align-items: start;
}
.lsq__chart {
  width: 100%;
  height: 300px; /* fixed box; SVG viewBox fits inside via preserveAspectRatio */
  border: 1px solid var(--hairline);
  border-radius: var(--r-3);
  background: var(--bg2);
}
.lsq__axis {
  stroke: var(--border);
  stroke-width: 1;
}
.lsq__tick {
  fill: var(--fg2);
  font-size: 11px;
}
.lsq__resid {
  stroke: var(--ctp-color-accent, var(--gold));
  stroke-width: 1;
  opacity: 0.45;
}
.lsq__pt {
  fill: var(--fg2);
  opacity: 0.85;
}
.lsq__fit {
  stroke: var(--ctp-color-violet);
  stroke-width: 2.5;
  stroke-linecap: round;
}
.lsq__panel {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
}
.lsq__ctl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--s-2);
}
.lsq__label {
  font-size: var(--t-small);
  color: var(--fg1);
  font-weight: 600;
}
.lsq__stepper {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
.lsq__val {
  min-width: 34px;
  text-align: center;
  font-size: var(--t-small);
  font-variant-numeric: tabular-nums;
  color: var(--fg1);
}
.lsq__btn {
  font: inherit;
  font-size: var(--t-small);
  font-weight: 700;
  line-height: 1;
  color: var(--fg-inv);
  background: var(--ctp-color-violet);
  border: none;
  border-radius: var(--r-2);
  padding: var(--s-1) var(--s-3);
  cursor: pointer;
}
.lsq__btn:hover {
  background: var(--ctp-color-violet-dark, var(--violet-700));
}
.lsq__actions {
  display: flex;
  gap: var(--s-2);
  border-top: 1px solid var(--hairline);
  padding-top: var(--s-3);
}
.lsq__btn--wide {
  flex: 1;
}
.lsq__btn--ghost {
  background: transparent;
  color: var(--ctp-color-violet);
  border: 1px solid var(--border);
}
.lsq__btn--ghost:hover {
  background: var(--bg3);
}
.lsq__readout {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  border-top: 1px solid var(--hairline);
  padding-top: var(--s-3);
}
.lsq__stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.lsq__statk {
  font-size: var(--t-caption);
  color: var(--fg2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.lsq__statv {
  font-size: var(--t-small);
  color: var(--fg1);
  font-variant-numeric: tabular-nums;
}
</style>
