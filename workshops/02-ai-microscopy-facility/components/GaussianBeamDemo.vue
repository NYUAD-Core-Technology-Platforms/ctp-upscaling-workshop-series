<!--
  GaussianBeamDemo: waist, wavelength and propagation window sliders drive an
  animated Gaussian beam envelope (w(z) = w0 sqrt(1 + (z/zR)^2)). Model and
  canvas drawing live in ../lib/optics.js (initGaussianBeam).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initGaussianBeam } from '../lib/optics.js'
const root = useDemo(initGaussianBeam)
</script>

<template>
  <div ref="root" class="demo" data-demo="gaussian-beam">
    <div class="demo__copy">
      <p class="demo__lead">The waist is the radius where intensity falls to 1/e² of the on-axis value. A tighter waist diverges faster.</p>
      <div class="demo__controls">
        <label>Waist radius <output data-output-for="gauss-waist">60 µm</output><input id="gauss-waist" type="range" min="20" max="120" value="60" step="1"></label>
        <label>Wavelength <output data-output-for="gauss-wave">520 nm</output><input id="gauss-wave" type="range" min="450" max="700" value="520" step="5"></label>
        <label>Propagation window <output data-output-for="gauss-z">35 mm</output><input id="gauss-z" type="range" min="10" max="60" value="35" step="1"></label>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Rayleigh range</span><strong id="gauss-zr">–</strong></div>
        <div class="demo__metric"><span>Divergence</span><strong id="gauss-div">–</strong></div>
      </div>
      <p class="demo__equation">w(z) = w₀ √[1 + (z / zᵣ)²]</p>
    </div>
    <div class="demo__stage"><canvas id="gauss-canvas" aria-label="Interactive Gaussian beam propagation simulation"></canvas></div>
  </div>
</template>
