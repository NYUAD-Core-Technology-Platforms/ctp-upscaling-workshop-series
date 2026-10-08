<!--
  PsfDemo: numerical aperture and emission wavelength set the lateral and axial
  extent of the point-spread function; the stage shows ideal emitters, the XY
  image and an XZ section. Drawing: ../lib/imaging.js (initPsf).
-->
<script setup>
import { useDemo } from '../lib/useDemo.js'
import { initPsf } from '../lib/imaging.js'
const root = useDemo(initPsf)
</script>

<template>
  <div ref="root" class="demo" data-demo="psf">
    <div class="demo__copy">
      <p class="demo__lead">Each ideal point is recorded as a 3D blur. Overlapping PSFs add together and can merge nearby structures.</p>
      <div class="demo__controls">
        <label>Numerical aperture <output data-output-for="psf-na">1.20</output><input id="psf-na" type="range" min="0.5" max="1.4" value="1.2" step="0.05"></label>
        <label>Emission wavelength <output data-output-for="psf-wave">520 nm</output><input id="psf-wave" type="range" min="450" max="700" value="520" step="5"></label>
      </div>
      <div class="demo__metrics">
        <div class="demo__metric"><span>Approx. lateral</span><strong id="psf-xy">–</strong></div>
        <div class="demo__metric"><span>Approx. axial</span><strong id="psf-z">–</strong></div>
      </div>
      <p class="demo__equation">Measured image = object ⊗ PSF + noise</p>
    </div>
    <div class="demo__stage"><canvas id="psf-canvas" aria-label="Interactive point-spread function and image formation simulation"></canvas></div>
  </div>
</template>
