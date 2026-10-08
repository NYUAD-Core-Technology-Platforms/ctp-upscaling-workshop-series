/**
 * Interactive optics demonstrations for workshop 02 (Gaussian beam, singlet vs
 * doublet focus, two-mirror alignment).
 *
 * Ported from the original standalone HTML deck. Each init function takes the
 * demo's root element (a Vue component template), queries its own controls
 * inside that root, and returns a destroy() function that cancels animation
 * frames and observers. No module-level DOM access, so several demos can be
 * mounted at once (Slidev preloads neighbouring slides).
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const palette = {
  backgroundTop: "#2D0349",
  backgroundBottom: "#1F0233",
  panel: "#2D0349",
  grid: "rgba(201, 166, 224, 0.12)",
  axis: "rgba(201, 166, 224, 0.45)",
  text: "#FFFFFF",
  muted: "#C9A6E0",
  cyan: "#54e6d0",
  amber: "#E8B946",
  red: "#ff7285"
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const lerp = (start, end, amount) => start + (end - start) * amount;

const numberFromInput = (input, fallback) => {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
};

const signed = (value, digits = 2) => {
  if (Math.abs(value) < 0.5 * 10 ** -digits) {
    return (0).toFixed(digits);
  }
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}`;
};

function makeLiveRegion(element) {
  if (!element) return;
  if (!element.hasAttribute("aria-live")) {
    element.setAttribute("aria-live", "polite");
  }
  element.setAttribute("aria-atomic", "true");
}

function updateRangeReadout(input, text, accessibleText = text) {
  input.setAttribute("aria-valuetext", accessibleText);

  const selectors = [
    `[data-output-for="${input.id}"]`,
    `output[for~="${input.id}"]`,
    `#${input.id}-value`
  ];

  const scope = input.closest("[data-demo]") || document;
  scope.querySelectorAll(selectors.join(",")).forEach((element) => {
    element.textContent = text;
  });
}

function configureRange(input, minimum, maximum, step) {
  input.type = "range";
  input.min = String(minimum);
  input.max = String(maximum);
  input.step = String(step);
}

function wavelengthColor(wavelength, alpha = 1) {
  const nm = clamp(wavelength, 380, 780);
  let red = 0;
  let green = 0;
  let blue = 0;

  if (nm < 440) {
    red = -(nm - 440) / 60;
    blue = 1;
  } else if (nm < 490) {
    green = (nm - 440) / 50;
    blue = 1;
  } else if (nm < 510) {
    green = 1;
    blue = -(nm - 510) / 20;
  } else if (nm < 580) {
    red = (nm - 510) / 70;
    green = 1;
  } else if (nm < 645) {
    red = 1;
    green = -(nm - 645) / 65;
  } else {
    red = 1;
  }

  let intensity = 1;
  if (nm < 420) intensity = 0.35 + (nm - 380) * (0.65 / 40);
  if (nm > 700) intensity = 0.35 + (780 - nm) * (0.65 / 80);

  const gamma = 0.8;
  const channel = (component) =>
    Math.round(255 * (component > 0 ? (component * intensity) ** gamma : 0));

  return `rgba(${channel(red)}, ${channel(green)}, ${channel(blue)}, ${alpha})`;
}

function prepareCanvas(canvas) {
  const rectangle = canvas.getBoundingClientRect();
  const width = Math.max(1, rectangle.width || canvas.clientWidth || 760);
  const height = Math.max(1, rectangle.height || canvas.clientHeight || 320);
  const density = clamp(window.devicePixelRatio || 1, 1, 2);
  const pixelWidth = Math.round(width * density);
  const pixelHeight = Math.round(height * density);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  const context = canvas.getContext("2d");
  if (!context) return null;
  context.setTransform(density, 0, 0, density, 0, 0);

  return { context, width, height };
}

function drawCanvasBackground(context, width, height) {
  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, palette.backgroundTop);
  background.addColorStop(1, palette.backgroundBottom);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = palette.grid;
  context.lineWidth = 1;
  const spacing = width < 540 ? 40 : 56;
  for (let x = spacing; x < width; x += spacing) {
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, height);
    context.stroke();
  }
  for (let y = spacing; y < height; y += spacing) {
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(width, y + 0.5);
    context.stroke();
  }
  context.restore();
}

function drawLabel(context, text, x, y, options = {}) {
  const {
    color = palette.muted,
    align = "left",
    size = 12,
    weight = 500
  } = options;
  context.save();
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "middle";
  context.font = `${weight} ${size}px Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`;
  context.fillText(text, x, y);
  context.restore();
}

function makeAnimationLoop(element, drawFrame, disposers = []) {
  let frameRequest = 0;
  let visible = true;

  const tick = (time) => {
    frameRequest = 0;
    drawFrame(time, reducedMotionQuery.matches);
    if (!reducedMotionQuery.matches && visible && !document.hidden) {
      frameRequest = window.requestAnimationFrame(tick);
    }
  };

  const requestRender = () => {
    if (!frameRequest && visible && !document.hidden) {
      frameRequest = window.requestAnimationFrame(tick);
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
        if (visible) requestRender();
      },
      { rootMargin: "80px" }
    );
    observer.observe(element);
    disposers.push(() => observer.disconnect());
  }

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(requestRender);
    observer.observe(element);
    disposers.push(() => observer.disconnect());
  } else {
    window.addEventListener("resize", requestRender, { passive: true });
    disposers.push(() => window.removeEventListener("resize", requestRender));
  }

  const onMotionChange = () => {
    if (frameRequest) window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    requestRender();
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", onMotionChange);
    disposers.push(() => reducedMotionQuery.removeEventListener("change", onMotionChange));
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(onMotionChange);
    disposers.push(() => reducedMotionQuery.removeListener(onMotionChange));
  }

  document.addEventListener("visibilitychange", requestRender);
  disposers.push(() => document.removeEventListener("visibilitychange", requestRender));
  disposers.push(() => {
    visible = false;
    if (frameRequest) window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  });
  requestRender();
  return requestRender;
}

export function initGaussianBeam(root) {
  const disposers = [];
  const waistInput = root.querySelector("#gauss-waist");
  const wavelengthInput = root.querySelector("#gauss-wave");
  const distanceInput = root.querySelector("#gauss-z");
  const rayleighOutput = root.querySelector("#gauss-zr");
  const divergenceOutput = root.querySelector("#gauss-div");
  const canvas = root.querySelector("#gauss-canvas");

  if (
    !waistInput ||
    !wavelengthInput ||
    !distanceInput ||
    !rayleighOutput ||
    !divergenceOutput ||
    !(canvas instanceof HTMLCanvasElement)
  ) {
    return;
  }

  makeLiveRegion(rayleighOutput);
  makeLiveRegion(divergenceOutput);
  canvas.setAttribute("role", "img");
  configureRange(waistInput, 20, 120, 1);
  configureRange(wavelengthInput, 450, 700, 1);
  configureRange(distanceInput, 10, 60, 1);

  const model = {
    waistMicrometres: 50,
    wavelengthNanometres: 532,
    distanceMillimetres: 30,
    rayleighMillimetres: 0,
    divergenceMilliradians: 0,
    endRadiusMicrometres: 0
  };

  function updateModel() {
    model.waistMicrometres = numberFromInput(waistInput, 50);
    model.wavelengthNanometres = numberFromInput(wavelengthInput, 532);
    model.distanceMillimetres = numberFromInput(distanceInput, 30);

    const waistMetres = model.waistMicrometres * 1e-6;
    const wavelengthMetres = model.wavelengthNanometres * 1e-9;
    model.rayleighMillimetres =
      (Math.PI * waistMetres ** 2 * 1000) / wavelengthMetres;
    model.divergenceMilliradians =
      (wavelengthMetres / (Math.PI * waistMetres)) * 1000;
    model.endRadiusMicrometres =
      model.waistMicrometres *
      Math.sqrt(
        1 +
          (model.distanceMillimetres / model.rayleighMillimetres) ** 2
      );

    rayleighOutput.textContent = `${model.rayleighMillimetres.toFixed(1)} mm`;
    divergenceOutput.textContent = `${model.divergenceMilliradians.toFixed(2)} mrad`;

    updateRangeReadout(
      waistInput,
      `${model.waistMicrometres.toFixed(0)} µm`,
      `${model.waistMicrometres.toFixed(0)} micrometres`
    );
    updateRangeReadout(
      wavelengthInput,
      `${model.wavelengthNanometres.toFixed(0)} nm`,
      `${model.wavelengthNanometres.toFixed(0)} nanometres`
    );
    updateRangeReadout(
      distanceInput,
      `${model.distanceMillimetres.toFixed(0)} mm`,
      `${model.distanceMillimetres.toFixed(0)} millimetres`
    );

    canvas.setAttribute(
      "aria-label",
      `Animated Gaussian beam. Waist ${model.waistMicrometres.toFixed(0)} micrometres, wavelength ${model.wavelengthNanometres.toFixed(0)} nanometres, Rayleigh range ${model.rayleighMillimetres.toFixed(1)} millimetres, and half-angle divergence ${model.divergenceMilliradians.toFixed(2)} milliradians.`
    );
  }

  function draw(time, reducedMotion) {
    const surface = prepareCanvas(canvas);
    if (!surface) return;
    const { context, width, height } = surface;
    drawCanvasBackground(context, width, height);

    const compact = width < 560;
    const plotLeft = compact ? 28 : 48;
    const plotRight = width - (compact ? 28 : 52);
    const centreX = (plotLeft + plotRight) / 2;
    const centreY = height * 0.52;
    const halfLength = Math.max(40, (plotRight - plotLeft) / 2);
    const usableHalfHeight = Math.max(25, height * 0.3);
    const wavelengthColour = wavelengthColor(model.wavelengthNanometres);
    const waist = model.waistMicrometres;
    const endRadius = model.endRadiusMicrometres;
    const scale = Math.min(
      (usableHalfHeight - 2) / Math.max(endRadius, waist),
      (height / 320) * 0.115
    );

    const beamRadiusAtX = (x) => {
      const z =
        ((x - centreX) / halfLength) * model.distanceMillimetres;
      const radius =
        waist *
        Math.sqrt(1 + (z / model.rayleighMillimetres) ** 2);
      return Math.max(2.5, radius * scale);
    };

    context.save();
    context.setLineDash([6, 7]);
    context.strokeStyle = palette.axis;
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(plotLeft - 8, centreY);
    context.lineTo(plotRight + 8, centreY);
    context.stroke();
    context.restore();

    const envelope = new Path2D();
    const steps = Math.max(48, Math.round((plotRight - plotLeft) / 7));
    for (let index = 0; index <= steps; index += 1) {
      const x = lerp(plotLeft, plotRight, index / steps);
      const y = centreY - beamRadiusAtX(x);
      if (index === 0) envelope.moveTo(x, y);
      else envelope.lineTo(x, y);
    }
    for (let index = steps; index >= 0; index -= 1) {
      const x = lerp(plotLeft, plotRight, index / steps);
      envelope.lineTo(x, centreY + beamRadiusAtX(x));
    }
    envelope.closePath();

    const beamGradient = context.createLinearGradient(
      plotLeft,
      centreY,
      plotRight,
      centreY
    );
    beamGradient.addColorStop(0, wavelengthColor(model.wavelengthNanometres, 0.08));
    beamGradient.addColorStop(0.5, wavelengthColor(model.wavelengthNanometres, 0.42));
    beamGradient.addColorStop(1, wavelengthColor(model.wavelengthNanometres, 0.08));
    context.fillStyle = beamGradient;
    context.fill(envelope);

    context.save();
    context.strokeStyle = wavelengthColor(model.wavelengthNanometres, 0.75);
    context.lineWidth = 1.5;
    context.shadowColor = wavelengthColour;
    context.shadowBlur = 9;
    context.beginPath();
    for (let index = 0; index <= steps; index += 1) {
      const x = lerp(plotLeft, plotRight, index / steps);
      const y = centreY - beamRadiusAtX(x);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.beginPath();
    for (let index = 0; index <= steps; index += 1) {
      const x = lerp(plotLeft, plotRight, index / steps);
      const y = centreY + beamRadiusAtX(x);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.restore();

    const rayleighFraction =
      model.rayleighMillimetres / model.distanceMillimetres;
    if (rayleighFraction < 1) {
      context.save();
      context.strokeStyle = "rgba(255, 207, 112, 0.65)";
      context.setLineDash([3, 5]);
      [-1, 1].forEach((direction) => {
        const x = centreX + direction * rayleighFraction * halfLength;
        context.beginPath();
        context.moveTo(x, centreY - usableHalfHeight);
        context.lineTo(x, centreY + usableHalfHeight);
        context.stroke();
      });
      context.restore();
      if (!compact) {
        drawLabel(
          context,
          "± Rayleigh range",
          centreX + rayleighFraction * halfLength,
          centreY - usableHalfHeight - 12,
          { color: palette.amber, align: "center", size: 11 }
        );
      }
    }

    context.save();
    context.strokeStyle = palette.text;
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(centreX, centreY - Math.max(7, waist * scale + 8));
    context.lineTo(centreX, centreY + Math.max(7, waist * scale + 8));
    context.stroke();
    context.restore();

    const elapsed = reducedMotion ? 0 : time * 0.000075;
    const photonCount = compact ? 14 : 22;
    context.save();
    context.fillStyle = wavelengthColour;
    context.shadowColor = wavelengthColour;
    context.shadowBlur = 10;
    for (let index = 0; index < photonCount; index += 1) {
      const fraction = (elapsed + index / photonCount) % 1;
      const x = lerp(plotLeft, plotRight, fraction);
      const radius = beamRadiusAtX(x);
      const lane = Math.sin(index * 12.9898) * 0.68;
      const drift = Math.sin(fraction * Math.PI * 4 + index) * 0.12;
      const y = centreY + (lane + drift) * radius;
      context.beginPath();
      context.arc(x, y, index % 5 === 0 ? 2.4 : 1.55, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();

    drawLabel(context, `−${model.distanceMillimetres.toFixed(0)} mm`, plotLeft, height - 22, {
      align: "center"
    });
    drawLabel(context, "waist w₀", centreX, height - 22, {
      color: palette.text,
      align: "center",
      weight: 650
    });
    drawLabel(context, `+${model.distanceMillimetres.toFixed(0)} mm`, plotRight, height - 22, {
      align: "center"
    });

    if (!compact) {
      drawLabel(
        context,
        `w(z) = ${model.endRadiusMicrometres.toFixed(0)} µm`,
        plotRight - 4,
        centreY - beamRadiusAtX(plotRight) - 14,
        { color: palette.text, align: "right", weight: 650 }
      );
    }
  }

  updateModel();
  const requestRender = makeAnimationLoop(canvas, draw, disposers);
  [waistInput, wavelengthInput, distanceInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateModel();
      requestRender();
    });
  });
  return () => disposers.forEach((dispose) => dispose());
}

export function initLensObjective(root) {
  const disposers = [];
  const focalInput = root.querySelector("#lens-focal");
  const beamInput = root.querySelector("#lens-input");
  const wavelengthInput = root.querySelector("#lens-wave");
  const waistOutput = root.querySelector("#lens-waist");
  const divergenceOutput = root.querySelector("#lens-div");
  const shiftOutput = root.querySelector("#lens-shift");
  const aberrationCaption = root.querySelector("#lens-aberration");
  const singletButton = root.querySelector("#lens-singlet");
  const doubletButton = root.querySelector("#lens-doublet");
  const canvas = root.querySelector("#lens-canvas");

  if (
    !focalInput ||
    !beamInput ||
    !wavelengthInput ||
    !waistOutput ||
    !divergenceOutput ||
    !shiftOutput ||
    !aberrationCaption ||
    !singletButton ||
    !doubletButton ||
    !(canvas instanceof HTMLCanvasElement)
  ) {
    return;
  }

  makeLiveRegion(waistOutput);
  makeLiveRegion(divergenceOutput);
  makeLiveRegion(shiftOutput);
  makeLiveRegion(aberrationCaption);
  canvas.setAttribute("role", "img");
  configureRange(focalInput, 10, 100, 1);
  configureRange(beamInput, 0.5, 5, 0.1);
  configureRange(wavelengthInput, 450, 700, 5);

  const referenceWavelengthNanometres = 550;
  const chromaticDisplayScale = 8;
  const crownGlassIndex = (wavelengthNanometres) => {
    const wavelengthMicrometres = wavelengthNanometres / 1000;
    return 1.5046 + 0.0042 / wavelengthMicrometres ** 2;
  };
  const referenceGlassIndex = crownGlassIndex(referenceWavelengthNanometres);

  const model = {
    focalMillimetres: 50,
    effectiveFocalMillimetres: 50,
    focalShiftMillimetres: 0,
    inputRadiusMillimetres: 2,
    wavelengthNanometres: referenceWavelengthNanometres,
    refractiveIndex: referenceGlassIndex,
    lensType: "singlet",
    waistMicrometres: 0,
    divergenceMilliradians: 0
  };

  function updateModel() {
    model.focalMillimetres = numberFromInput(focalInput, 50);
    model.inputRadiusMillimetres = numberFromInput(beamInput, 2);
    model.wavelengthNanometres = numberFromInput(
      wavelengthInput,
      referenceWavelengthNanometres
    );
    model.refractiveIndex = crownGlassIndex(model.wavelengthNanometres);

    if (model.lensType === "singlet") {
      model.effectiveFocalMillimetres =
        model.focalMillimetres *
        ((referenceGlassIndex - 1) / (model.refractiveIndex - 1));
    } else {
      // Educational corrected optic: residual secondary spectrum is omitted.
      model.effectiveFocalMillimetres = model.focalMillimetres;
    }
    model.focalShiftMillimetres =
      model.effectiveFocalMillimetres - model.focalMillimetres;

    // Thin-lens approximation for a collimated Gaussian input beam:
    // w0 = lambda f / (pi w_in).
    model.waistMicrometres =
      (model.wavelengthNanometres * 1e-3 * model.effectiveFocalMillimetres) /
      (Math.PI * model.inputRadiusMillimetres);
    model.divergenceMilliradians =
      (model.wavelengthNanometres * 1e-3 * 1000) /
      (Math.PI * model.waistMicrometres);

    waistOutput.textContent = `${model.waistMicrometres.toFixed(2)} µm`;
    divergenceOutput.textContent = `${model.divergenceMilliradians.toFixed(1)} mrad`;
    shiftOutput.textContent = `${signed(model.focalShiftMillimetres)} mm`;
    shiftOutput.dataset.state =
      Math.abs(model.focalShiftMillimetres) < 0.005 ? "corrected" : "shifted";
    singletButton.setAttribute(
      "aria-pressed",
      String(model.lensType === "singlet")
    );
    doubletButton.setAttribute(
      "aria-pressed",
      String(model.lensType === "doublet")
    );

    updateRangeReadout(
      focalInput,
      `${model.focalMillimetres.toFixed(0)} mm`,
      `${model.focalMillimetres.toFixed(0)} millimetres`
    );
    updateRangeReadout(
      beamInput,
      `${model.inputRadiusMillimetres.toFixed(1)} mm`,
      `${model.inputRadiusMillimetres.toFixed(1)} millimetres`
    );
    updateRangeReadout(
      wavelengthInput,
      `${model.wavelengthNanometres.toFixed(0)} nm`,
      `${model.wavelengthNanometres.toFixed(0)} nanometres`
    );

    if (model.lensType === "doublet") {
      aberrationCaption.textContent =
        `Corrected doublet: the focal plane stays at ${model.focalMillimetres.toFixed(2)} mm in this idealized model. The waist still changes with wavelength.`;
    } else if (Math.abs(model.focalShiftMillimetres) < 0.005) {
      aberrationCaption.textContent =
        `${referenceWavelengthNanometres} nm defines the singlet's nominal focal plane.`;
    } else if (model.focalShiftMillimetres < 0) {
      aberrationCaption.textContent =
        `Blue light sees a higher refractive index and focuses ${Math.abs(model.focalShiftMillimetres).toFixed(2)} mm before the ${referenceWavelengthNanometres} nm reference plane.`;
    } else {
      aberrationCaption.textContent =
        `Red light sees a lower refractive index and focuses ${model.focalShiftMillimetres.toFixed(2)} mm beyond the ${referenceWavelengthNanometres} nm reference plane.`;
    }

    canvas.dataset.lensType = model.lensType;
    canvas.dataset.focusShiftMillimetres =
      model.focalShiftMillimetres.toFixed(4);
    canvas.dataset.effectiveFocalMillimetres =
      model.effectiveFocalMillimetres.toFixed(4);

    canvas.setAttribute(
      "aria-label",
      `${model.lensType === "singlet" ? "Singlet" : "Corrected doublet"} focusing model. Nominal focal length ${model.focalMillimetres.toFixed(0)} millimetres at ${referenceWavelengthNanometres} nanometres, current wavelength ${model.wavelengthNanometres.toFixed(0)} nanometres, effective focal length ${model.effectiveFocalMillimetres.toFixed(2)} millimetres, axial focus shift ${signed(model.focalShiftMillimetres)} millimetres, predicted waist ${model.waistMicrometres.toFixed(2)} micrometres, and half-angle divergence ${model.divergenceMilliradians.toFixed(1)} milliradians.`
    );
  }

  function draw(time, reducedMotion) {
    const surface = prepareCanvas(canvas);
    if (!surface) return;
    const { context, width, height } = surface;
    drawCanvasBackground(context, width, height);

    const compact = width < 560;
    const centreY = height * 0.52;
    const left = compact ? 18 : 38;
    const right = width - (compact ? 18 : 38);
    const lensX = lerp(left, right, compact ? 0.38 : 0.4);
    const focalFraction =
      (model.focalMillimetres - 10) / Math.max(1, 100 - 10);
    const nominalFocusDistance = lerp(
      (right - left) * 0.20,
      (right - left) * 0.43,
      focalFraction
    );
    const relativeFocalShift =
      model.focalShiftMillimetres / Math.max(1, model.focalMillimetres);
    const displayFocusDistance =
      model.lensType === "singlet"
        ? nominalFocusDistance * (1 + chromaticDisplayScale * relativeFocalShift)
        : nominalFocusDistance;
    const referenceFocusX = Math.min(right - 34, lensX + nominalFocusDistance);
    const focusX = clamp(lensX + displayFocusDistance, lensX + 34, right - 34);
    const focusDistance = Math.max(1, focusX - lensX);
    canvas.dataset.referenceFocusX = referenceFocusX.toFixed(2);
    canvas.dataset.focusX = focusX.toFixed(2);
    const inputRadius = lerp(
      Math.max(10, height * 0.045),
      Math.max(28, height * 0.22),
      (model.inputRadiusMillimetres - 0.5) / 4.5
    );
    const waistRadius = clamp(
      1.5 + model.waistMicrometres * 0.33,
      2,
      10
    );
    const geometricSlope = (inputRadius - waistRadius) / focusDistance;

    const beamHalfHeight = (x) => {
      if (x <= lensX) return inputRadius;
      if (x <= focusX) {
        const amount = (x - lensX) / (focusX - lensX);
        return lerp(inputRadius, waistRadius, amount);
      }
      return Math.sqrt(
        waistRadius ** 2 + (geometricSlope * (x - focusX)) ** 2
      );
    };

    context.save();
    context.strokeStyle = palette.axis;
    context.setLineDash([6, 7]);
    context.lineWidth = 1.25;
    context.beginPath();
    context.moveTo(left - 8, centreY);
    context.lineTo(right + 8, centreY);
    context.stroke();
    context.restore();

    const steps = Math.max(50, Math.round((right - left) / 7));
    const envelope = new Path2D();
    for (let index = 0; index <= steps; index += 1) {
      const x = lerp(left, right, index / steps);
      const y = centreY - beamHalfHeight(x);
      if (index === 0) envelope.moveTo(x, y);
      else envelope.lineTo(x, y);
    }
    for (let index = steps; index >= 0; index -= 1) {
      const x = lerp(left, right, index / steps);
      envelope.lineTo(x, centreY + beamHalfHeight(x));
    }
    envelope.closePath();

    const colour = wavelengthColor(model.wavelengthNanometres);
    const glow = context.createLinearGradient(left, 0, right, 0);
    glow.addColorStop(0, wavelengthColor(model.wavelengthNanometres, 0.11));
    glow.addColorStop(0.68, wavelengthColor(model.wavelengthNanometres, 0.34));
    glow.addColorStop(1, wavelengthColor(model.wavelengthNanometres, 0.08));
    context.fillStyle = glow;
    context.fill(envelope);

    context.save();
    context.strokeStyle = wavelengthColor(model.wavelengthNanometres, 0.76);
    context.lineWidth = 1.5;
    context.shadowColor = colour;
    context.shadowBlur = 8;
    [-1, 1].forEach((direction) => {
      context.beginPath();
      for (let index = 0; index <= steps; index += 1) {
        const x = lerp(left, right, index / steps);
        const y = centreY + direction * beamHalfHeight(x);
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    });
    context.restore();

    // Singlet or idealized cemented achromatic doublet.
    const lensHalfHeight = Math.min(height * 0.31, inputRadius + 30);
    context.save();
    const lensGradient = context.createLinearGradient(lensX - 14, 0, lensX + 14, 0);
    lensGradient.addColorStop(0, "rgba(92, 208, 255, 0.14)");
    lensGradient.addColorStop(0.5, "rgba(185, 239, 255, 0.62)");
    lensGradient.addColorStop(1, "rgba(92, 208, 255, 0.14)");
    context.fillStyle = lensGradient;
    context.strokeStyle = "rgba(171, 230, 255, 0.88)";
    context.lineWidth = 1.5;
    context.shadowColor = "rgba(78, 202, 255, 0.6)";
    context.shadowBlur = 10;
    const lensPath = new Path2D();
    lensPath.moveTo(lensX, centreY - lensHalfHeight);
    lensPath.bezierCurveTo(
      lensX + 20,
      centreY - lensHalfHeight * 0.55,
      lensX + 20,
      centreY + lensHalfHeight * 0.55,
      lensX,
      centreY + lensHalfHeight
    );
    lensPath.bezierCurveTo(
      lensX - 20,
      centreY + lensHalfHeight * 0.55,
      lensX - 20,
      centreY - lensHalfHeight * 0.55,
      lensX,
      centreY - lensHalfHeight
    );
    lensPath.closePath();
    context.fill(lensPath);
    if (model.lensType === "doublet") {
      context.save();
      context.clip(lensPath);
      context.fillStyle = "rgba(255, 196, 111, 0.22)";
      context.fillRect(
        lensX,
        centreY - lensHalfHeight - 4,
        24,
        lensHalfHeight * 2 + 8
      );
      context.restore();
    }
    context.stroke(lensPath);
    if (model.lensType === "doublet") {
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(255, 214, 151, 0.86)";
      context.beginPath();
      context.moveTo(lensX + 1, centreY - lensHalfHeight + 3);
      context.bezierCurveTo(
        lensX - 5,
        centreY - lensHalfHeight * 0.42,
        lensX - 5,
        centreY + lensHalfHeight * 0.42,
        lensX + 1,
        centreY + lensHalfHeight - 3
      );
      context.stroke();
    }
    context.restore();

    const planeHalfHeight = Math.max(22, waistRadius + 16);
    context.save();
    context.strokeStyle = palette.axis;
    context.setLineDash([6, 5]);
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(referenceFocusX, centreY - planeHalfHeight - 12);
    context.lineTo(referenceFocusX, centreY + planeHalfHeight + 12);
    context.stroke();
    context.restore();

    context.save();
    context.strokeStyle = colour;
    context.setLineDash([3, 5]);
    context.lineWidth = 1.7;
    context.shadowColor = colour;
    context.shadowBlur = 7;
    context.beginPath();
    context.moveTo(focusX, centreY - planeHalfHeight);
    context.lineTo(focusX, centreY + planeHalfHeight);
    context.stroke();
    context.restore();

    if (
      model.lensType === "singlet" &&
      Math.abs(focusX - referenceFocusX) >= 2
    ) {
      const bracketY = Math.max(34, centreY - inputRadius - 34);
      context.save();
      context.strokeStyle = colour;
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(referenceFocusX, bracketY);
      context.lineTo(focusX, bracketY);
      context.moveTo(referenceFocusX, bracketY - 5);
      context.lineTo(referenceFocusX, bracketY + 5);
      context.moveTo(focusX, bracketY - 5);
      context.lineTo(focusX, bracketY + 5);
      context.stroke();
      context.restore();
      drawLabel(
        context,
        `Δz ${signed(model.focalShiftMillimetres)} mm, displacement ×${chromaticDisplayScale}`,
        (referenceFocusX + focusX) / 2,
        bracketY - 11,
        { color: palette.text, align: "center", weight: 650 }
      );
    }

    // Photons follow representative rays, cross at the waist, then diverge.
    const elapsed = reducedMotion ? 0.13 : time * 0.00009;
    const photonCount = compact ? 15 : 24;
    context.save();
    context.fillStyle = colour;
    context.shadowColor = colour;
    context.shadowBlur = 9;
    for (let index = 0; index < photonCount; index += 1) {
      const fraction = (elapsed + index / photonCount) % 1;
      const x = lerp(left, right, fraction);
      const lane = ((index % 7) - 3) / 3.5;
      let rayOffset;
      if (x <= lensX) {
        rayOffset = lane * inputRadius;
      } else if (x <= focusX) {
        const amount = (x - lensX) / (focusX - lensX);
        rayOffset = lane * lerp(inputRadius, 0, amount);
      } else {
        rayOffset = -lane * geometricSlope * (x - focusX);
      }
      context.beginPath();
      context.arc(x, centreY + rayOffset, index % 6 === 0 ? 2.3 : 1.5, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();

    drawLabel(context, "collimated input", left + 4, height - 22, {
      color: palette.text,
      align: "left",
      weight: 650
    });
    drawLabel(
      context,
      model.lensType === "doublet"
        ? compact
          ? "doublet"
          : "corrected doublet"
        : compact
          ? "singlet"
          : "singlet lens",
      lensX,
      height - 22,
      {
        color: palette.text,
        align: "center",
        weight: 650
      }
    );
    drawLabel(context, "focused waist", focusX, height - 22, {
      color: palette.amber,
      align: "center",
      weight: 650
    });
    drawLabel(
      context,
      model.lensType === "doublet"
        ? "shared focal plane"
        : `${referenceWavelengthNanometres} nm reference`,
      referenceFocusX,
      centreY - planeHalfHeight - 22,
      {
        color: model.lensType === "doublet" ? palette.cyan : palette.muted,
        align: "center",
        weight: 650
      }
    );
    if (!compact) {
      drawLabel(
        context,
        `f(${model.wavelengthNanometres.toFixed(0)} nm) = ${model.effectiveFocalMillimetres.toFixed(2)} mm`,
        (lensX + focusX) / 2,
        centreY + Math.max(inputRadius * 0.65, 35),
        { align: "center" }
      );
    }
  }

  updateModel();
  const requestRender = makeAnimationLoop(canvas, draw, disposers);
  [focalInput, beamInput, wavelengthInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateModel();
      requestRender();
    });
  });
  singletButton.addEventListener("click", () => {
    model.lensType = "singlet";
    updateModel();
    requestRender();
  });
  doubletButton.addEventListener("click", () => {
    model.lensType = "doublet";
    updateModel();
    requestRender();
  });
  return () => disposers.forEach((dispose) => dispose());
}

export function initAlignment(root) {
  const disposers = [];
  const scene = root.querySelector("#alignment-scene");
  const mirrorOneInput = root.querySelector("#align-m1");
  const mirrorTwoInput = root.querySelector("#align-m2");
  const nearOutput = root.querySelector("#align-near");
  const farOutput = root.querySelector("#align-far");
  const angleOutput = root.querySelector("#align-angle");
  const statusOutput = root.querySelector("#align-status");
  const explanation = root.querySelector("#align-explanation");
  const misalignButton = root.querySelector("#align-misalign");
  const convergeButton = root.querySelector("#align-converge");
  const divergeButton = root.querySelector("#align-diverge");
  const perfectButton = root.querySelector("#align-perfect");
  const methodSteps = [...root.querySelectorAll("[data-align-step]")];

  if (
    !(scene instanceof SVGElement) ||
    !mirrorOneInput ||
    !mirrorTwoInput ||
    !nearOutput ||
    !farOutput ||
    !angleOutput ||
    !statusOutput ||
    !explanation ||
    !misalignButton ||
    !convergeButton ||
    !divergeButton ||
    !perfectButton
  ) {
    return;
  }

  [nearOutput, farOutput, angleOutput, statusOutput, explanation].forEach(
    makeLiveRegion
  );
  configureRange(mirrorOneInput, -4, 4, 0.05);
  configureRange(mirrorTwoInput, -4, 4, 0.05);

  scene.setAttribute("viewBox", "0 0 760 360");
  scene.setAttribute("role", "img");
  scene.setAttribute(
    "aria-label",
    "Two-mirror laser alignment simulator with a near and a far iris"
  );
  scene.setAttribute("preserveAspectRatio", "xMidYMid meet");

  scene.innerHTML = `
    <defs>
      <filter id="align-beam-glow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="3.2" result="blur"></feGaussianBlur>
        <feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
      </filter>
      <radialGradient id="align-spot-gradient">
        <stop offset="0" stop-color="#ffffff"></stop>
        <stop offset="0.25" stop-color="#70ffe5"></stop>
        <stop offset="1" stop-color="#38d6c0" stop-opacity="0"></stop>
      </radialGradient>
    </defs>

    <rect width="760" height="360" rx="18" fill="var(--optics-bg, #07111e)"></rect>
    <g opacity="0.32" stroke="var(--optics-grid, #35506a)" stroke-width="1">
      <path d="M0 40H760M0 100H760M0 160H760M0 220H760M0 280H760M80 0V360M160 0V360M240 0V360M320 0V360M400 0V360M480 0V360M560 0V360M640 0V360M720 0V360"></path>
    </g>

    <line x1="340" y1="100" x2="740" y2="100" stroke="var(--optics-muted, #7f99af)" stroke-width="2" stroke-dasharray="7 7"></line>
    <text x="535" y="80" text-anchor="middle" fill="var(--optics-muted, #93a9bd)" font-size="13" font-family="system-ui, sans-serif">desired optical axis</text>

    <path d="M40 220H180L340 100" fill="none" stroke="var(--optics-muted, #7f99af)" stroke-width="2" stroke-dasharray="5 6" opacity="0.62"></path>

    <g fill="none" stroke="var(--optics-accent, #54e6d0)" stroke-width="4" stroke-linecap="round" filter="url(#align-beam-glow)">
      <line id="align-beam-1" x1="40" y1="220" x2="180" y2="220"></line>
      <line id="align-beam-2" x1="180" y1="220" x2="340" y2="100"></line>
      <line id="align-beam-3" x1="340" y1="100" x2="750" y2="100"></line>
    </g>

    <g id="align-mirror-one-group">
      <line id="align-mirror-1" x1="140" y1="220" x2="220" y2="220" stroke="var(--optics-text, #e8f2fb)" stroke-width="7" stroke-linecap="round"></line>
      <circle cx="180" cy="220" r="4.5" fill="var(--optics-text, #e8f2fb)"></circle>
      <text x="180" y="270" text-anchor="middle" fill="var(--optics-text, #e8f2fb)" font-size="14" font-family="system-ui, sans-serif">Mirror 1</text>
    </g>
    <g id="align-mirror-two-group">
      <line id="align-mirror-2" x1="300" y1="100" x2="380" y2="100" stroke="var(--optics-text, #e8f2fb)" stroke-width="7" stroke-linecap="round"></line>
      <circle cx="340" cy="100" r="4.5" fill="var(--optics-text, #e8f2fb)"></circle>
      <text x="340" y="49" text-anchor="middle" fill="var(--optics-text, #e8f2fb)" font-size="14" font-family="system-ui, sans-serif">Mirror 2</text>
    </g>

    <g id="align-near-iris-group">
      <line x1="400" y1="70" x2="400" y2="130" stroke="var(--optics-text, #e8f2fb)" stroke-width="3"></line>
      <circle id="align-near-ring" cx="400" cy="100" r="13" fill="var(--optics-panel, #0d1c2c)" stroke="var(--optics-text, #e8f2fb)" stroke-width="3"></circle>
      <circle cx="400" cy="100" r="2.4" fill="var(--optics-text, #e8f2fb)"></circle>
      <line id="align-near-error-line" x1="420" y1="100" x2="420" y2="100" stroke="var(--optics-danger, #ff7285)" stroke-width="2" stroke-dasharray="4 3" opacity="0"></line>
      <circle id="align-near-spot" cx="400" cy="100" r="9" fill="url(#align-spot-gradient)" pointer-events="none"></circle>
      <text x="400" y="154" text-anchor="middle" fill="var(--optics-text, #e8f2fb)" font-size="14" font-family="system-ui, sans-serif">Near iris</text>
      <text x="400" y="173" text-anchor="middle" fill="var(--optics-muted, #93a9bd)" font-size="12" font-family="system-ui, sans-serif">position check</text>
    </g>
    <g id="align-far-iris-group">
      <line x1="700" y1="70" x2="700" y2="130" stroke="var(--optics-text, #e8f2fb)" stroke-width="3"></line>
      <circle id="align-far-ring" cx="700" cy="100" r="13" fill="var(--optics-panel, #0d1c2c)" stroke="var(--optics-text, #e8f2fb)" stroke-width="3"></circle>
      <circle cx="700" cy="100" r="2.4" fill="var(--optics-text, #e8f2fb)"></circle>
      <line id="align-far-error-line" x1="720" y1="100" x2="720" y2="100" stroke="var(--optics-danger, #ff7285)" stroke-width="2" stroke-dasharray="4 3" opacity="0"></line>
      <circle id="align-far-spot" cx="700" cy="100" r="9" fill="url(#align-spot-gradient)" pointer-events="none"></circle>
      <text x="700" y="154" text-anchor="middle" fill="var(--optics-text, #e8f2fb)" font-size="14" font-family="system-ui, sans-serif">Far iris</text>
      <text x="700" y="173" text-anchor="middle" fill="var(--optics-muted, #93a9bd)" font-size="12" font-family="system-ui, sans-serif">angle check</text>
    </g>

    <g>
      <rect x="17" y="196" width="58" height="48" rx="9" fill="var(--optics-panel, #0d1c2c)" stroke="var(--optics-border, #34506a)"></rect>
      <circle cx="67" cy="220" r="4" fill="var(--optics-accent, #54e6d0)"></circle>
      <text x="43" y="225" text-anchor="middle" fill="var(--optics-text, #e8f2fb)" font-size="13" font-weight="650" font-family="system-ui, sans-serif">LASER</text>
    </g>
  `;

  const beamTwo = scene.querySelector("#align-beam-2");
  const beamThree = scene.querySelector("#align-beam-3");
  const mirrorOne = scene.querySelector("#align-mirror-1");
  const mirrorTwo = scene.querySelector("#align-mirror-2");
  const nearRing = scene.querySelector("#align-near-ring");
  const farRing = scene.querySelector("#align-far-ring");
  const nearSpot = scene.querySelector("#align-near-spot");
  const farSpot = scene.querySelector("#align-far-spot");
  const nearErrorLine = scene.querySelector("#align-near-error-line");
  const farErrorLine = scene.querySelector("#align-far-error-line");

  if (
    !beamTwo ||
    !beamThree ||
    !mirrorOne ||
    !mirrorTwo ||
    !nearRing ||
    !farRing ||
    !nearSpot ||
    !farSpot ||
    !nearErrorLine ||
    !farErrorLine
  ) {
    return;
  }

  const pointOne = { x: 180, y: 220 };
  const pointTwo = { x: 340, y: 100 };
  const nearIrisX = 400;
  const farIrisX = 700;
  const targetY = 100;
  const mirrorHalfLength = 46;
  const millimetresPerPixel = 0.1;
  const tolerancePixels = 4;
  let animationToken = 0;
  let animationFrameId = null;
  let animationKind = null;
  let guidedCaption = "";
  let guidedStatus = null;

  const normalise = (vector) => {
    const length = Math.hypot(vector.x, vector.y) || 1;
    return { x: vector.x / length, y: vector.y / length };
  };
  const add = (first, second) => ({
    x: first.x + second.x,
    y: first.y + second.y
  });
  const rotate = (vector, angle) => ({
    x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  });
  const dot = (first, second) =>
    first.x * second.x + first.y * second.y;
  const cross = (first, second) =>
    first.x * second.y - first.y * second.x;
  const reflect = (direction, tangent) => {
    const factor = 2 * dot(direction, tangent);
    return normalise({
      x: factor * tangent.x - direction.x,
      y: factor * tangent.y - direction.y
    });
  };
  const yAtX = (point, direction, x) => {
    if (Math.abs(direction.x) < 1e-8) return Number.NaN;
    return point.y + ((x - point.x) * direction.y) / direction.x;
  };
  const intersect = (origin, direction, mirrorPoint, tangent) => {
    const denominator = cross(direction, tangent);
    if (Math.abs(denominator) < 1e-8) return null;
    const delta = {
      x: mirrorPoint.x - origin.x,
      y: mirrorPoint.y - origin.y
    };
    const alongRay = cross(delta, tangent) / denominator;
    const alongMirror = cross(delta, direction) / denominator;
    return {
      x: origin.x + alongRay * direction.x,
      y: origin.y + alongRay * direction.y,
      alongRay,
      alongMirror
    };
  };

  const inputDirection = { x: 1, y: 0 };
  const nominalMiddleDirection = normalise({
    x: pointTwo.x - pointOne.x,
    y: pointTwo.y - pointOne.y
  });
  const nominalOutputDirection = { x: 1, y: 0 };
  const mirrorOneBase = normalise(add(inputDirection, nominalMiddleDirection));
  const mirrorTwoBase = normalise(
    add(nominalMiddleDirection, nominalOutputDirection)
  );

  function setLine(element, x1, y1, x2, y2) {
    element.setAttribute("x1", x1.toFixed(2));
    element.setAttribute("y1", y1.toFixed(2));
    element.setAttribute("x2", x2.toFixed(2));
    element.setAttribute("y2", y2.toFixed(2));
  }

  function setMirror(element, point, tangent) {
    setLine(
      element,
      point.x - tangent.x * mirrorHalfLength,
      point.y - tangent.y * mirrorHalfLength,
      point.x + tangent.x * mirrorHalfLength,
      point.y + tangent.y * mirrorHalfLength
    );
  }

  function setState(state) {
    statusOutput.dataset.state = state;
    statusOutput.style.color =
      state === "aligned"
        ? palette.cyan
        : state === "angle" || state === "converging"
          ? palette.amber
          : palette.red;
  }

  function hideSpot(spot) {
    spot.setAttribute("opacity", "0");
  }

  function positionSpot(spot, y, inTolerance) {
    if (!Number.isFinite(y) || y < -20 || y > 380) {
      hideSpot(spot);
      return;
    }
    spot.setAttribute("cy", y.toFixed(2));
    spot.setAttribute("opacity", "1");
    spot.setAttribute(
      "fill",
      inTolerance ? "url(#align-spot-gradient)" : palette.red
    );
    spot.setAttribute("fill-opacity", inTolerance ? "1" : "0.72");
  }

  function positionErrorLine(line, y) {
    if (!Number.isFinite(y) || Math.abs(y - targetY) < 1) {
      line.setAttribute("opacity", "0");
      return;
    }
    line.setAttribute("y1", String(targetY));
    line.setAttribute("y2", y.toFixed(2));
    line.setAttribute("opacity", "0.82");
  }

  function setActiveMethod(step, failure = false, controlName = null, targetName = null) {
    methodSteps.forEach((element) => {
      const active = element.dataset.alignStep === step;
      element.classList.toggle("is-active", active);
      element.classList.toggle("is-failure", active && failure);
    });

    mirrorOne.classList.remove(
      "alignment-highlight-control",
      "alignment-failure-control"
    );
    mirrorTwo.classList.remove(
      "alignment-highlight-control",
      "alignment-failure-control"
    );
    nearRing.classList.remove(
      "alignment-highlight-target",
      "alignment-failure-target"
    );
    farRing.classList.remove(
      "alignment-highlight-target",
      "alignment-failure-target"
    );

    const resolvedControl =
      controlName || (step === "near" ? "one" : step === "far" ? "two" : null);
    const resolvedTarget =
      targetName || (step === "near" ? "near" : step === "far" ? "far" : null);
    const control =
      resolvedControl === "one" ? mirrorOne : resolvedControl === "two" ? mirrorTwo : null;
    const target =
      resolvedTarget === "near" ? nearRing : resolvedTarget === "far" ? farRing : null;
    if (control) {
      control.classList.add("alignment-highlight-control");
      if (failure) control.classList.add("alignment-failure-control");
    }
    if (target) {
      target.classList.add("alignment-highlight-target");
      if (failure) target.classList.add("alignment-failure-target");
    }
  }

  function applyGuidedOverrides(defaultExplanation) {
    const nextExplanation = guidedCaption || defaultExplanation;
    if (explanation.textContent !== nextExplanation) {
      explanation.textContent = nextExplanation;
    }
    if (guidedStatus) {
      statusOutput.textContent = guidedStatus.text;
      setState(guidedStatus.state);
    }
  }

  function setMirrorValues(mirrorOneDegrees, mirrorTwoDegrees) {
    mirrorOneInput.value = String(clamp(mirrorOneDegrees, -4, 4));
    mirrorTwoInput.value = String(clamp(mirrorTwoDegrees, -4, 4));
  }

  function cancelGuidedAnimation(clearGuidance = true) {
    animationToken += 1;
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    animationKind = null;
    convergeButton.setAttribute("aria-pressed", "false");
    divergeButton.setAttribute("aria-pressed", "false");
    if (clearGuidance) {
      guidedCaption = "";
      guidedStatus = null;
      setActiveMethod(null);
    }
  }

  function hold(duration, token) {
    if (reducedMotionQuery.matches) {
      return Promise.resolve(token === animationToken);
    }
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(token === animationToken), duration);
    });
  }

  function animateMirrorValues(targetOne, targetTwo, duration, token) {
    const startOne = numberFromInput(mirrorOneInput, 0);
    const startTwo = numberFromInput(mirrorTwoInput, 0);

    if (reducedMotionQuery.matches || duration <= 0) {
      setMirrorValues(targetOne, targetTwo);
      update();
      return Promise.resolve(token === animationToken);
    }

    return new Promise((resolve) => {
      const startTime = performance.now();
      const tick = (now) => {
        if (token !== animationToken) {
          animationFrameId = null;
          resolve(false);
          return;
        }
        const progress = clamp((now - startTime) / duration, 0, 1);
        const eased = 1 - (1 - progress) ** 3;
        setMirrorValues(
          lerp(startOne, targetOne, eased),
          lerp(startTwo, targetTwo, eased)
        );
        update();
        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(tick);
        } else {
          animationFrameId = null;
          resolve(true);
        }
      };
      animationFrameId = window.requestAnimationFrame(tick);
    });
  }

  function update() {
    const mirrorOneDegrees = numberFromInput(mirrorOneInput, 0);
    const mirrorTwoDegrees = numberFromInput(mirrorTwoInput, 0);
    const radians = Math.PI / 180;
    const tangentOne = rotate(mirrorOneBase, mirrorOneDegrees * radians);
    const tangentTwo = rotate(mirrorTwoBase, mirrorTwoDegrees * radians);

    updateRangeReadout(
      mirrorOneInput,
      `${signed(mirrorOneDegrees)}°`,
      `${signed(mirrorOneDegrees)} degrees`
    );
    updateRangeReadout(
      mirrorTwoInput,
      `${signed(mirrorTwoDegrees)}°`,
      `${signed(mirrorTwoDegrees)} degrees`
    );

    setMirror(mirrorOne, pointOne, tangentOne);
    setMirror(mirrorTwo, pointTwo, tangentTwo);

    const middleDirection = reflect(inputDirection, tangentOne);
    const hit = intersect(pointOne, middleDirection, pointTwo, tangentTwo);

    const transition = reducedMotionQuery.matches || animationKind
      ? "none"
      : "all 120ms ease-out";
    [beamTwo, beamThree, mirrorOne, mirrorTwo, nearSpot, farSpot, nearRing, farRing].forEach(
      (element) => {
        element.style.transition = transition;
      }
    );

    if (
      !hit ||
      hit.alongRay <= 0 ||
      Math.abs(hit.alongMirror) > mirrorHalfLength
    ) {
      setLine(
        beamTwo,
        pointOne.x,
        pointOne.y,
        pointOne.x + middleDirection.x * 520,
        pointOne.y + middleDirection.y * 520
      );
      setLine(beamThree, 0, 0, 0, 0);
      hideSpot(nearSpot);
      hideSpot(farSpot);
      nearErrorLine.setAttribute("opacity", "0");
      farErrorLine.setAttribute("opacity", "0");

      nearOutput.textContent = "–";
      farOutput.textContent = "–";
      angleOutput.textContent = "–";
      statusOutput.textContent = "Misses M2";
      setState("miss");
      applyGuidedOverrides(
        "Mirror 1 is steering the beam completely off Mirror 2. Recover the beam on Mirror 2 before refining the near and far iris positions."
      );
      scene.setAttribute(
        "aria-label",
        `Two-mirror alignment simulator. The beam currently misses Mirror 2. Status: ${statusOutput.textContent}.`
      );
      return;
    }

    setLine(beamTwo, pointOne.x, pointOne.y, hit.x, hit.y);
    const outputDirection = reflect(middleDirection, tangentTwo);
    const endX = outputDirection.x >= 0 ? 750 : 0;
    const endY = yAtX(hit, outputDirection, endX);
    setLine(beamThree, hit.x, hit.y, endX, Number.isFinite(endY) ? endY : hit.y);

    const nearY = yAtX(hit, outputDirection, nearIrisX);
    const farY = yAtX(hit, outputDirection, farIrisX);
    const nearPixels = nearY - targetY;
    const farPixels = farY - targetY;
    const nearMillimetres = nearPixels * millimetresPerPixel;
    const farMillimetres = farPixels * millimetresPerPixel;
    const angleDegrees =
      (Math.atan2(outputDirection.y, outputDirection.x) * 180) / Math.PI;
    const nearAligned = Math.abs(nearPixels) < tolerancePixels;
    const farAligned = Math.abs(farPixels) < tolerancePixels;

    nearOutput.textContent = `${signed(nearMillimetres)} mm`;
    farOutput.textContent = `${signed(farMillimetres)} mm`;
    angleOutput.textContent = `${signed(angleDegrees)}°`;
    positionSpot(nearSpot, nearY, nearAligned);
    positionSpot(farSpot, farY, farAligned);
    positionErrorLine(nearErrorLine, nearY);
    positionErrorLine(farErrorLine, farY);

    let defaultExplanation;
    if (nearAligned && farAligned) {
      statusOutput.textContent = "Aligned";
      setState("aligned");
      defaultExplanation =
        "Both irises are centered. The near iris confirms beam position close to Mirror 2; the far iris confirms the propagation angle.";
    } else if (nearAligned && !farAligned) {
      statusOutput.textContent = "Angle error";
      setState("angle");
      defaultExplanation =
        "The near iris is centered, but the far iris is missed. Position is locally correct while angle is wrong; the long distance magnifies a tiny angular error.";
    } else if (!nearAligned && farAligned) {
      statusOutput.textContent = "Crossing axis";
      setState("angle");
      defaultExplanation =
        "The beam happens to cross the axis at the far iris, but it is displaced near Mirror 2. Crossing one point is not true alignment.";
    } else {
      statusOutput.textContent = "Misaligned";
      setState("misaligned");
      defaultExplanation =
        "Iterate between Mirror 1 and Mirror 2 until the near and far irises are centered at the same time.";
    }

    applyGuidedOverrides(defaultExplanation);

    scene.setAttribute(
      "aria-label",
      `Two-mirror alignment simulator. Near iris error ${signed(nearMillimetres)} millimetres, far iris error ${signed(farMillimetres)} millimetres, output angle ${signed(angleDegrees)} degrees. Status: ${statusOutput.textContent}.`
    );
  }

  const convergenceSteps = [
    {
      values: [-0.231, -1.0],
      method: "near",
      control: "one",
      target: "near",
      caption: "Mirror 1 → near iris: correct the beam position close to Mirror 2."
    },
    {
      values: [-0.231, -0.359],
      method: "far",
      control: "two",
      target: "far",
      caption: "Mirror 2 → far iris: correct the propagation angle over the long distance."
    },
    {
      values: [-0.083, -0.359],
      method: "near",
      control: "one",
      target: "near",
      caption: "Repeat on Mirror 1: the far-plane correction slightly disturbed the near iris."
    },
    {
      values: [-0.083, -0.129],
      method: "far",
      control: "two",
      target: "far",
      caption: "Repeat on Mirror 2: the far-iris error is now much smaller."
    },
    {
      values: [-0.03, -0.129],
      method: "near",
      control: "one",
      target: "near",
      caption: "One more near-iris correction: each pass is smaller than the last."
    },
    {
      values: [-0.03, -0.046],
      method: "far",
      control: "two",
      target: "far",
      caption: "One more far-iris correction: both constraints are converging together."
    },
    {
      values: [0, 0],
      method: "repeat",
      caption: "Converged: both spots overlap their target centers at the same time."
    }
  ];

  const divergenceSteps = [
    {
      values: [-0.129, -0.2],
      method: "far",
      control: "one",
      target: "far",
      caption: "Wrong assignment: Mirror 1 centers the far iris, but leaves a near-plane error."
    },
    {
      values: [-0.129, -0.557],
      method: "near",
      control: "two",
      target: "near",
      caption: "Mirror 2 now centers the near iris and pushes the far iris farther away."
    },
    {
      values: [-0.358, -0.557],
      method: "far",
      control: "one",
      target: "far",
      caption: "Correct the far iris again. The required Mirror 1 move is already larger."
    },
    {
      values: [-0.358, -1.552],
      method: "near",
      control: "two",
      target: "near",
      caption: "Correct the near iris again. The far-plane error grows instead of shrinking."
    },
    {
      values: [-0.998, -1.552],
      method: "far",
      control: "one",
      target: "far",
      caption: "The corrections are amplifying one another: the procedure is diverging."
    },
    {
      values: [-0.998, -4],
      method: "near",
      control: "two",
      target: "near",
      caption: "Mirror 2 reaches its travel limit before both irises can be centered."
    }
  ];

  async function playGuidedSequence(kind, startValues, steps) {
    cancelGuidedAnimation();
    const token = animationToken;
    const failure = kind === "diverge";
    animationKind = kind;
    scene.dataset.demoResult = "running";
    convergeButton.setAttribute("aria-pressed", String(!failure));
    divergeButton.setAttribute("aria-pressed", String(failure));
    setMirrorValues(startValues[0], startValues[1]);
    setActiveMethod(null);
    guidedStatus = {
      text: failure ? "Wrong sequence" : "Converging",
      state: failure ? "misaligned" : "converging"
    };
    guidedCaption = failure
      ? "Start with a small error, then deliberately assign each mirror to the wrong iris."
      : "Start with both irises missed. Alternate near and far corrections; do not expect one move to finish the job.";
    update();
    if (!(await hold(520, token))) return;

    for (const step of steps) {
      setActiveMethod(
        step.method,
        failure,
        step.control || null,
        step.target || null
      );
      guidedCaption = step.caption;
      update();
      if (!(await animateMirrorValues(step.values[0], step.values[1], 680, token))) {
        return;
      }
      if (!(await hold(360, token))) return;
    }

    if (token !== animationToken) return;
    animationKind = null;
    convergeButton.setAttribute("aria-pressed", "false");
    divergeButton.setAttribute("aria-pressed", "false");
    if (failure) {
      scene.dataset.demoResult = "diverged";
      guidedStatus = { text: "No convergence", state: "misaligned" };
      guidedCaption =
        "No convergence: the reversed control strategy makes the two points chase each other. The optical system still has a solution; this procedure does not reach it.";
      setActiveMethod("repeat", true);
    } else {
      scene.dataset.demoResult = "converged";
      guidedStatus = null;
      guidedCaption =
        "Converged: Mirror 1 controlled the near plane, Mirror 2 controlled the far plane, and repeated passes centered both irises.";
      setActiveMethod("repeat");
    }
    update();
  }

  function handleManualInput() {
    cancelGuidedAnimation();
    delete scene.dataset.demoResult;
    update();
  }

  mirrorOneInput.addEventListener("input", handleManualInput);
  mirrorTwoInput.addEventListener("input", handleManualInput);
  misalignButton.addEventListener("click", () => {
    cancelGuidedAnimation();
    delete scene.dataset.demoResult;
    mirrorOneInput.value = "1.10";
    mirrorTwoInput.value = "-0.45";
    update();
    mirrorOneInput.focus({ preventScroll: true });
  });
  convergeButton.addEventListener("click", () => {
    playGuidedSequence("converge", [1.5, -1], convergenceSteps);
    convergeButton.focus({ preventScroll: true });
  });
  divergeButton.addEventListener("click", () => {
    playGuidedSequence("diverge", [0.5, -0.2], divergenceSteps);
    divergeButton.focus({ preventScroll: true });
  });
  perfectButton.addEventListener("click", () => {
    cancelGuidedAnimation();
    delete scene.dataset.demoResult;
    mirrorOneInput.value = "0";
    mirrorTwoInput.value = "0";
    update();
    perfectButton.focus({ preventScroll: true });
  });

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", update);
    disposers.push(() => reducedMotionQuery.removeEventListener("change", update));
  }
  disposers.push(() => cancelGuidedAnimation());
  update();
  return () => disposers.forEach((dispose) => dispose());
}
