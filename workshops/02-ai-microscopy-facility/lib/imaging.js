/**
 * Interactive imaging demonstrations for workshop 02: confocal one-pixel
 * measurement, raster scan, point-spread function, synthetic cell counting,
 * object measurements, and polynomial regression.
 *
 * Ported from the original standalone HTML deck. Each init function takes the
 * demo's root element, queries its controls inside that root, and returns a
 * destroy() function. Colours come from CSS custom properties on the canvas
 * (--canvas-bg, --surface, --text, ...) so the components bind them to the
 * CTP design tokens.
 */


const TWO_PI = Math.PI * 2;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const ease = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function cssValue(element, names, fallback) {
  const elementStyles = getComputedStyle(element);
  const rootStyles = getComputedStyle(document.documentElement);
  for (const name of names) {
    const local = elementStyles.getPropertyValue(name).trim();
    if (local) return local;
    const root = rootStyles.getPropertyValue(name).trim();
    if (root) return root;
  }
  return fallback;
}

function palette(canvas) {
  return {
    background: cssValue(canvas, ["--canvas-bg", "--bg-deep", "--background"], "#06111d"),
    surface: cssValue(canvas, ["--surface", "--panel", "--card"], "#0b2030"),
    text: cssValue(canvas, ["--text", "--foreground"], "#ecf8ff"),
    muted: cssValue(canvas, ["--muted-text", "--muted-foreground"], "#91a8b9"),
    line: cssValue(canvas, ["--line", "--border"], "#244052"),
    cyan: cssValue(canvas, ["--cyan", "--accent-cyan", "--viz-series-1"], "#4de3ff"),
    magenta: cssValue(canvas, ["--magenta", "--accent-magenta", "--viz-series-2"], "#ff58d6"),
    green: cssValue(canvas, ["--green", "--accent-green", "--viz-series-3"], "#66f2a1"),
    amber: cssValue(canvas, ["--amber", "--yellow", "--viz-series-4"], "#ffd166"),
    red: cssValue(canvas, ["--red", "--destructive"], "#ff6b78")
  };
}

function canvasFrame(canvas, fallbackWidth = 900, fallbackHeight = 400) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || canvas.clientWidth || fallbackWidth));
  const height = Math.max(1, Math.round(rect.height || canvas.clientHeight || fallbackHeight));
  const pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const physicalWidth = Math.round(width * pixelRatio);
  const physicalHeight = Math.round(height * pixelRatio);

  if (canvas.width !== physicalWidth || canvas.height !== physicalHeight) {
    canvas.width = physicalWidth;
    canvas.height = physicalHeight;
  }

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);
  context.lineCap = "round";
  context.lineJoin = "round";
  return { context, width, height };
}

function observeCanvas(canvas, redraw) {
  if (!("ResizeObserver" in window)) {
    window.addEventListener("resize", redraw, { passive: true });
    return () => window.removeEventListener("resize", redraw);
  }
  let queued = false;
  const observer = new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      redraw();
    });
  });
  observer.observe(canvas);
  return () => observer.disconnect();
}

function rangeFraction(input, fallback = 0.5) {
  if (!input) return fallback;
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const value = Number(input.value);
  if (![minimum, maximum, value].every(Number.isFinite) || maximum === minimum) return fallback;
  return clamp((value - minimum) / (maximum - minimum));
}

function updateRangeOutput(input, text) {
  input.setAttribute("aria-valuetext", text);
  const scope = input.closest("[data-demo]") || document;
  scope
    .querySelectorAll(`[data-output-for="${input.id}"], output[for~="${input.id}"]`)
    .forEach((output) => {
      output.textContent = text;
    });
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function line(context, x1, y1, x2, y2, color, width = 1, alpha = 1) {
  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.restore();
}

function dot(context, x, y, radius, color, glow = 0) {
  context.save();
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = glow;
  context.beginPath();
  context.arc(x, y, radius, 0, TWO_PI);
  context.fill();
  context.restore();
}

function label(context, text, x, y, colors, align = "left", size = 12, weight = 500) {
  context.save();
  context.fillStyle = colors;
  context.font = `${weight} ${size}px Inter, "Helvetica Neue", Helvetica, Arial, sans-serif`;
  context.textAlign = align;
  context.textBaseline = "middle";
  context.fillText(text, x, y);
  context.restore();
}

function pointAlong(points, amount) {
  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const dx = points[index].x - points[index - 1].x;
    const dy = points[index].y - points[index - 1].y;
    const segment = Math.hypot(dx, dy);
    lengths.push(segment);
    total += segment;
  }
  let distance = clamp(amount) * total;
  for (let index = 0; index < lengths.length; index += 1) {
    if (distance <= lengths[index] || index === lengths.length - 1) {
      const local = lengths[index] ? distance / lengths[index] : 0;
      return {
        x: lerp(points[index].x, points[index + 1].x, local),
        y: lerp(points[index].y, points[index + 1].y, local)
      };
    }
    distance -= lengths[index];
  }
  return points[points.length - 1];
}

function paintBackground(context, width, height, colors) {
  const wash = context.createRadialGradient(width * 0.46, height * 0.44, 0, width * 0.46, height * 0.44, width * 0.72);
  wash.addColorStop(0, colors.surface);
  wash.addColorStop(1, colors.background);
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);
}

// The ray paths below are a teaching schematic: they preserve the confocal
// sequence, but are not a geometric-optics calculation of a real instrument.
export function initConfocal(root) {
  const canvas = root.querySelector("#confocal-canvas");
  const playButton = root.querySelector("#confocal-play");
  const dwellInput = root.querySelector("#confocal-dwell");
  const pinholeInput = root.querySelector("#confocal-pinhole");
  const stageOutput = root.querySelector("#confocal-stage");
  if (!canvas || !playButton || !dwellInput || !pinholeInput || !stageOutput) return;
  const sequenceItems = Array.from(
    root.querySelectorAll(".micro-sequence li")
  );

  let progress = 0;
  let frameRequest = 0;
  let startTime = 0;
  let lastStage = -1;
  let running = false;

  const particles = [
    { offset: -32, phase: 0.02, color: "cyan" },
    { offset: -20, phase: 0.23, color: "magenta" },
    { offset: -9, phase: 0.44, color: "green" },
    { offset: -3, phase: 0.66, color: "cyan" },
    { offset: 2, phase: 0.82, color: "green" },
    { offset: 8, phase: 0.13, color: "magenta" },
    { offset: 19, phase: 0.35, color: "amber" },
    { offset: 31, phase: 0.58, color: "magenta" }
  ];

  const stageMessages = [
    "Ready: play the sequence that generates one confocal pixel.",
    "1 · Focused excitation: the objective concentrates laser light at the sample.",
    "2 · Fluorescence emission: photons return through the objective.",
    "3 · Spatial filtering: in-focus light passes; defocused light is rejected.",
    "4 · Detection: accepted photons are converted into an electrical signal.",
    "5 · Integration: signal accumulated during the dwell time becomes one pixel."
  ];

  function stageFor(value) {
    if (value <= 0) return 0;
    if (value < 0.2) return 1;
    if (value < 0.44) return 2;
    if (value < 0.7) return 3;
    if (value < 0.92) return 4;
    return 5;
  }

  function setStage(stage) {
    if (stage === lastStage) return;
    lastStage = stage;
    stageOutput.textContent = stageMessages[stage];
    sequenceItems.forEach((item, index) => {
      item.classList.toggle("active", stage > 0 && index === stage - 1);
      item.classList.toggle("complete", stage > 1 && index < stage - 1);
    });
  }

  function draw(value = progress) {
    const { context, width, height } = canvasFrame(canvas, 920, 430);
    const colors = palette(canvas);
    const pinholeFraction = rangeFraction(pinholeInput, 0.35);
    const dwellFraction = rangeFraction(dwellInput, 0.45);
    const aperture = lerp(8, 34, pinholeFraction);
    const stage = stageFor(value);
    setStage(stage);
    paintBackground(context, width, height, colors);

    const axisY = height * 0.25;
    const dichroicX = width * 0.32;
    const objectiveY = height * 0.53;
    const sampleY = height * 0.76;
    const pinholeX = width * 0.65;
    const detectorX = width * 0.86;
    const focus = { x: dichroicX, y: sampleY };
    const compact = width < 600;

    // Quiet structural grid and sample plane.
    context.save();
    context.strokeStyle = colors.line;
    context.globalAlpha = 0.3;
    context.lineWidth = 1;
    for (let x = 24; x < width; x += 44) line(context, x, 16, x, height - 16, colors.line, 1, 0.18);
    for (let y = 22; y < height; y += 44) line(context, 16, y, width - 16, y, colors.line, 1, 0.18);
    context.restore();
    line(context, width * 0.09, sampleY + 11, width * 0.55, sampleY + 11, colors.line, 2, 0.8);
    for (let index = 0; index < 6; index += 1) {
      const x = width * (0.14 + index * 0.068);
      const radius = 7 + (index % 3) * 2;
      context.save();
      context.strokeStyle = colors.magenta;
      context.globalAlpha = 0.2;
      context.beginPath();
      context.arc(x, sampleY + 4 + Math.sin(index) * 3, radius, 0, TWO_PI);
      context.stroke();
      context.restore();
    }

    // Excitation travels to the dichroic and is focused by the objective.
    const excitationAmount = ease(value / 0.2);
    line(context, width * 0.07, axisY, lerp(width * 0.07, dichroicX, excitationAmount), axisY, colors.cyan, 3, 0.9);
    if (excitationAmount > 0.55) {
      const downAmount = ease((excitationAmount - 0.55) / 0.45);
      const beamEndY = lerp(axisY, sampleY, downAmount);
      context.save();
      context.fillStyle = colors.cyan;
      context.globalAlpha = 0.12 + downAmount * 0.15;
      context.beginPath();
      context.moveTo(dichroicX - 4, axisY);
      context.lineTo(dichroicX - lerp(4, 34, downAmount), Math.min(beamEndY, objectiveY));
      context.lineTo(dichroicX, beamEndY);
      context.lineTo(dichroicX + lerp(4, 34, downAmount), Math.min(beamEndY, objectiveY));
      context.closePath();
      context.fill();
      context.restore();
      line(context, dichroicX, axisY, dichroicX, beamEndY, colors.cyan, 2, 0.8);
    }

    // Dichroic, objective, focal volume and sample.
    line(context, dichroicX - 18, axisY + 18, dichroicX + 18, axisY - 18, colors.amber, 5, 0.95);
    context.save();
    context.strokeStyle = colors.text;
    context.globalAlpha = 0.75;
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(dichroicX, objectiveY, 42, 10, 0, 0, TWO_PI);
    context.stroke();
    context.restore();
    if (value > 0.09) {
      const focalPulse = 1 + 0.14 * Math.sin(value * Math.PI * 8);
      dot(context, focus.x, focus.y, 5 * focalPulse, colors.cyan, 18);
      context.save();
      context.strokeStyle = colors.magenta;
      context.globalAlpha = 0.55;
      context.beginPath();
      context.ellipse(focus.x, focus.y, 13, 6, 0, 0, TWO_PI);
      context.stroke();
      context.restore();
    }

    // Pinhole plate: changing the slider changes the central aperture.
    line(context, dichroicX, axisY, pinholeX, axisY, colors.line, 2, 0.65);
    line(context, pinholeX, 34, pinholeX, axisY - aperture / 2, colors.text, 7, 0.75);
    line(context, pinholeX, axisY + aperture / 2, pinholeX, height * 0.48, colors.text, 7, 0.75);
    line(context, pinholeX + 7, axisY, detectorX - 30, axisY, colors.line, 2, 0.65);

    // Fluorescent photons follow the return path. Offset rays that miss the
    // aperture stop there, illustrating optical sectioning rather than noise removal.
    if (value > 0.18) {
      const photonClock = clamp((value - 0.18) / 0.57);
      particles.forEach((particle) => {
        const passed = Math.abs(particle.offset) <= aperture / 2;
        let travel = (photonClock * 1.65 + particle.phase) % 1;
        if (photonClock > 0.88) travel = clamp((photonClock - 0.5) * 1.5 + particle.phase * 0.25);
        const pinholeStop = 0.77;
        const displayedTravel = passed ? travel : Math.min(travel, pinholeStop);
        const path = [
          focus,
          { x: dichroicX, y: objectiveY },
          { x: dichroicX, y: axisY },
          { x: pinholeX, y: axisY + particle.offset },
          { x: detectorX - 24, y: axisY }
        ];
        const position = pointAlong(path, displayedTravel);
        const photonColor = colors[particle.color];
        dot(context, position.x, position.y, 3.2, photonColor, 10);
        if (!passed && travel >= pinholeStop) {
          line(context, pinholeX - 6, axisY + particle.offset - 5, pinholeX + 4, axisY + particle.offset + 5, colors.red, 2, 0.8);
          line(context, pinholeX - 6, axisY + particle.offset + 5, pinholeX + 4, axisY + particle.offset - 5, colors.red, 2, 0.8);
        }
      });
    }

    // Detector and an integration meter. Wider pinholes pass more photons;
    // longer dwell increases accumulated signal, while neither setting creates resolution.
    const accepted = particles.filter((particle) => Math.abs(particle.offset) <= aperture / 2).length;
    const integration = ease((value - 0.68) / 0.25);
    const pixelIntensity = Math.round(accepted * lerp(24, 56, dwellFraction) * integration);
    roundedRect(context, detectorX - 25, axisY - 38, 50, 76, 8);
    context.fillStyle = colors.surface;
    context.fill();
    context.strokeStyle = colors.cyan;
    context.lineWidth = 2;
    context.stroke();
    const meterHeight = 50 * clamp(pixelIntensity / 420);
    const meter = context.createLinearGradient(0, axisY + 25, 0, axisY - 25);
    meter.addColorStop(0, colors.cyan);
    meter.addColorStop(1, colors.amber);
    context.fillStyle = meter;
    context.fillRect(detectorX - 15, axisY + 25 - meterHeight, 30, meterHeight);

    if (stage >= 5) {
      const boxWidth = compact ? 150 : 190;
      const boxX = Math.min(width - boxWidth - 14, detectorX - boxWidth / 2);
      const boxY = Math.min(height - 58, axisY + 56);
      roundedRect(context, boxX, boxY, boxWidth, 42, 8);
      context.fillStyle = colors.surface;
      context.globalAlpha = 0.94;
      context.fill();
      context.globalAlpha = 1;
      context.strokeStyle = colors.green;
      context.lineWidth = 1.5;
      context.stroke();
      label(context, `ONE PIXEL  ${pixelIntensity} a.u.`, boxX + boxWidth / 2, boxY + 21, colors.text, "center", compact ? 11 : 13, 500);
    }

    if (!compact) {
      label(context, "excitation", width * 0.08, axisY - 18, colors.cyan, "left", 11, 500);
      label(context, "dichroic", dichroicX + 24, axisY - 26, colors.muted, "left", 11, 400);
      label(context, "objective", dichroicX + 52, objectiveY, colors.muted, "left", 11, 400);
      label(context, "fluorescent sample", focus.x, sampleY + 34, colors.muted, "center", 11, 400);
      label(context, `${pinholeFraction < 0.34 ? "small" : pinholeFraction > 0.67 ? "large" : "medium"} pinhole`, pinholeX, height * 0.51, colors.muted, "center", 11, 400);
      label(context, "detector", detectorX, axisY - 53, colors.muted, "center", 11, 400);
    }
  }

  function updateControlReadouts() {
    updateRangeOutput(dwellInput, `${Number(dwellInput.value).toFixed(0)} µs`);
    updateRangeOutput(pinholeInput, `${Number(pinholeInput.value).toFixed(1)} AU`);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameRequest);
    playButton.setAttribute("aria-pressed", "false");
  }

  function animate(timestamp) {
    if (!running) return;
    if (!startTime) startTime = timestamp;
    const duration = lerp(3400, 6200, rangeFraction(dwellInput, 0.45));
    progress = clamp((timestamp - startTime) / duration);
    draw(progress);
    if (progress < 1) {
      frameRequest = requestAnimationFrame(animate);
    } else {
      stop();
      playButton.textContent = "Replay pixel";
    }
  }

  playButton.addEventListener("click", () => {
    stop();
    progress = reducedMotion.matches ? 1 : 0;
    startTime = 0;
    lastStage = -1;
    if (reducedMotion.matches) {
      draw(1);
      playButton.textContent = "Replay pixel";
      return;
    }
    running = true;
    playButton.textContent = "Generating…";
    playButton.setAttribute("aria-pressed", "true");
    frameRequest = requestAnimationFrame(animate);
  });

  [dwellInput, pinholeInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateControlReadouts();
      draw(progress);
    });
  });
  const stopObserving = observeCanvas(canvas, () => draw(progress));
  updateControlReadouts();
  draw(0);
  return () => {
    cancelAnimationFrame(frameRequest);
    stopObserving();
  };
}

export function initRaster(root) {
  const canvas = root.querySelector("#raster-canvas");
  const playButton = root.querySelector("#raster-play");
  const resetButton = root.querySelector("#raster-reset");
  const speedInput = root.querySelector("#raster-speed");
  const progressOutput = root.querySelector("#raster-progress");
  if (!canvas || !playButton || !resetButton || !speedInput || !progressOutput) return;

  const columns = 30;
  const rows = 18;
  const totalPixels = columns * rows;
  const field = new Float32Array(totalPixels);
  const sources = [
    { x: 0.2, y: 0.27, sx: 0.10, sy: 0.15, a: 0.9 },
    { x: 0.48, y: 0.63, sx: 0.13, sy: 0.11, a: 1.0 },
    { x: 0.76, y: 0.33, sx: 0.09, sy: 0.12, a: 0.8 },
    { x: 0.83, y: 0.76, sx: 0.12, sy: 0.10, a: 0.7 }
  ];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = (column + 0.5) / columns;
      const y = (row + 0.5) / rows;
      let intensity = 0.035;
      sources.forEach((source) => {
        const dx = (x - source.x) / source.sx;
        const dy = (y - source.y) / source.sy;
        intensity += source.a * Math.exp(-0.5 * (dx * dx + dy * dy));
      });
      intensity += 0.025 * (Math.sin(column * 3.17 + row * 1.73) + 1);
      field[row * columns + column] = clamp(intensity);
    }
  }

  let scanned = 0;
  let running = false;
  let lastTimestamp = 0;
  let frameRequest = 0;

  function signalColor(intensity, colors) {
    if (intensity < 0.45) return `rgba(77, 227, 255, ${0.16 + intensity * 1.25})`;
    if (intensity < 0.78) return `rgba(102, 242, 161, ${0.45 + intensity * 0.55})`;
    return colors.amber;
  }

  function setProgress() {
    const complete = Math.min(totalPixels, Math.floor(scanned));
    const percent = Math.round((complete / totalPixels) * 100);
    progressOutput.textContent = `${percent}% · ${complete} / ${totalPixels} pixels`;
    progressOutput.setAttribute("aria-label", `Raster scan ${percent} percent complete`);
  }

  function draw() {
    const { context, width, height } = canvasFrame(canvas, 920, 390);
    const colors = palette(canvas);
    paintBackground(context, width, height, colors);
    const marginX = width < 520 ? 24 : 48;
    const marginTop = 42;
    const marginBottom = 30;
    const cellWidth = (width - marginX * 2) / columns;
    const cellHeight = (height - marginTop - marginBottom) / rows;
    const gridWidth = cellWidth * columns;
    const gridHeight = cellHeight * rows;
    const complete = Math.min(totalPixels, Math.floor(scanned));

    label(context, "confocal raster · one measured intensity per dwell position", marginX, 20, colors.muted, "left", 11, 400);

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const x = marginX + column * cellWidth;
        const y = marginTop + row * cellHeight;
        context.fillStyle = index < complete ? signalColor(field[index], colors) : colors.background;
        context.globalAlpha = index < complete ? 0.96 : 0.7;
        context.fillRect(x + 0.65, y + 0.65, Math.max(0.5, cellWidth - 1.3), Math.max(0.5, cellHeight - 1.3));
      }
    }
    context.globalAlpha = 1;

    context.strokeStyle = colors.line;
    context.globalAlpha = 0.65;
    context.lineWidth = 1;
    context.strokeRect(marginX, marginTop, gridWidth, gridHeight);
    context.globalAlpha = 1;

    if (complete < totalPixels && scanned > 0) {
      const index = Math.min(totalPixels - 1, Math.floor(scanned));
      const row = Math.floor(index / columns);
      const column = index % columns;
      const x = marginX + (column + 0.5) * cellWidth;
      const y = marginTop + (row + 0.5) * cellHeight;

      // A scanning spot moves continuously, but the display grid records the
      // integrated detector value at each dwell position.
      context.save();
      context.strokeStyle = colors.cyan;
      context.globalAlpha = 0.32;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(marginX, y);
      context.lineTo(marginX + gridWidth, y);
      context.stroke();
      context.restore();
      dot(context, x, y, Math.max(3, Math.min(cellWidth, cellHeight) * 0.42), colors.text, 16);
      context.save();
      context.strokeStyle = colors.cyan;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(x, y, Math.max(7, Math.min(cellWidth, cellHeight) * 0.72), 0, TWO_PI);
      context.stroke();
      context.restore();
    }

    if (complete === totalPixels) {
      roundedRect(context, width - marginX - 124, 12, 124, 27, 7);
      context.fillStyle = colors.surface;
      context.fill();
      context.strokeStyle = colors.green;
      context.stroke();
      label(context, "IMAGE COMPLETE", width - marginX - 62, 26, colors.green, "center", 10, 500);
    }
    setProgress();
  }

  function updateSpeedReadout() {
    const speed = Number(speedInput.value);
    const formatted = Number.isInteger(speed) ? speed.toFixed(1) : String(speed);
    updateRangeOutput(speedInput, `${formatted}×`);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameRequest);
    playButton.setAttribute("aria-pressed", "false");
    playButton.textContent = scanned >= totalPixels ? "Replay scan" : "Resume scan";
  }

  function animate(timestamp) {
    if (!running) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = Math.min(80, timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    const pixelsPerSecond = lerp(35, 330, rangeFraction(speedInput, 0.5));
    scanned = Math.min(totalPixels, scanned + elapsed * pixelsPerSecond);
    draw();
    if (scanned >= totalPixels) {
      stop();
    } else {
      frameRequest = requestAnimationFrame(animate);
    }
  }

  playButton.addEventListener("click", () => {
    if (running) {
      stop();
      return;
    }
    if (scanned >= totalPixels) scanned = 0;
    if (reducedMotion.matches) {
      scanned = totalPixels;
      draw();
      playButton.textContent = "Replay scan";
      return;
    }
    running = true;
    lastTimestamp = 0;
    playButton.textContent = "Pause scan";
    playButton.setAttribute("aria-pressed", "true");
    frameRequest = requestAnimationFrame(animate);
  });

  resetButton.addEventListener("click", () => {
    running = false;
    cancelAnimationFrame(frameRequest);
    scanned = 0;
    lastTimestamp = 0;
    playButton.textContent = "Play scan";
    playButton.setAttribute("aria-pressed", "false");
    draw();
  });
  speedInput.addEventListener("input", () => {
    updateSpeedReadout();
    draw();
  });
  const stopObserving = observeCanvas(canvas, draw);
  updateSpeedReadout();
  draw();
  return () => {
    cancelAnimationFrame(frameRequest);
    stopObserving();
  };
}

// Resolution readouts use common FWHM approximations. They are useful for
// comparing wavelength and NA, but a measured microscope PSF also depends on
// refractive-index mismatch, aberrations, sampling and the confocal pinhole.
export function initPsf(root) {
  const canvas = root.querySelector("#psf-canvas");
  const naInput = root.querySelector("#psf-na");
  const wavelengthInput = root.querySelector("#psf-wave");
  const xyOutput = root.querySelector("#psf-xy");
  const zOutput = root.querySelector("#psf-z");
  if (!canvas || !naInput || !wavelengthInput || !xyOutput || !zOutput) return;

  function measurements() {
    const naRaw = Number(naInput.value);
    const wavelengthRaw = Number(wavelengthInput.value);
    const na = clamp(naRaw > 2 ? naRaw / 10 : naRaw, 0.15, 1.7);
    const wavelengthNm = wavelengthRaw > 10 ? wavelengthRaw : wavelengthRaw * 1000;
    const wavelengthUm = clamp(wavelengthNm, 300, 900) / 1000;
    const refractiveIndex = 1.33;
    const lateral = (0.51 * wavelengthUm) / na;
    const axial = (1.77 * refractiveIndex * wavelengthUm) / (na * na);
    return { na, wavelengthNm, lateral, axial };
  }

  function gaussian(context, x, y, radiusX, radiusY, color, opacity = 0.92) {
    context.save();
    context.translate(x, y);
    context.scale(1, radiusY / Math.max(0.1, radiusX));
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radiusX);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.24, color);
    gradient.addColorStop(0.58, color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.globalAlpha = opacity;
    context.beginPath();
    context.arc(0, 0, radiusX, 0, TWO_PI);
    context.fill();
    context.restore();
  }

  function panel(context, box, title, subtitle, colors) {
    roundedRect(context, box.x, box.y, box.width, box.height, 10);
    context.fillStyle = colors.surface;
    context.globalAlpha = 0.56;
    context.fill();
    context.globalAlpha = 1;
    context.strokeStyle = colors.line;
    context.lineWidth = 1;
    context.stroke();
    label(context, title, box.x + 13, box.y + 17, colors.text, "left", 12, 500);
    label(context, subtitle, box.x + 13, box.y + 35, colors.muted, "left", 10, 400);
  }

  function draw() {
    const { context, width, height } = canvasFrame(canvas, 920, 390);
    const colors = palette(canvas);
    const values = measurements();
    updateRangeOutput(naInput, values.na.toFixed(2));
    updateRangeOutput(wavelengthInput, `${Math.round(values.wavelengthNm)} nm`);
    xyOutput.textContent = `≈ ${values.lateral.toFixed(2)} µm`;
    zOutput.textContent = `≈ ${values.axial.toFixed(2)} µm`;
    paintBackground(context, width, height, colors);

    const margin = width < 520 ? 10 : 16;
    const gap = width < 520 ? 8 : 12;
    const stacked = width < 610;
    let boxes;
    if (stacked) {
      const panelHeight = (height - margin * 2 - gap * 2) / 3;
      boxes = [0, 1, 2].map((index) => ({
        x: margin,
        y: margin + index * (panelHeight + gap),
        width: width - margin * 2,
        height: panelHeight
      }));
    } else {
      const panelWidth = (width - margin * 2 - gap * 2) / 3;
      boxes = [0, 1, 2].map((index) => ({
        x: margin + index * (panelWidth + gap),
        y: margin,
        width: panelWidth,
        height: height - margin * 2
      }));
    }

    panel(context, boxes[0], "Point object", "ideal emitters", colors);
    panel(context, boxes[1], "XY image", `lateral FWHM ${values.lateral.toFixed(2)} µm`, colors);
    panel(context, boxes[2], "XZ section", `axial FWHM ${values.axial.toFixed(2)} µm`, colors);

    const pointLayout = [
      { x: 0.28, y: 0.38 },
      { x: 0.65, y: 0.45 },
      { x: 0.43, y: 0.72 },
      { x: 0.73, y: 0.76 }
    ];
    const lateralScale = clamp((values.lateral - 0.15) / 0.95);
    const axialScale = clamp((values.axial - 0.45) / 5.2);

    boxes.forEach((box, panelIndex) => {
      const contentTop = box.y + Math.min(48, box.height * 0.37);
      const contentHeight = Math.max(20, box.height - (contentTop - box.y) - 10);
      pointLayout.forEach((point, pointIndex) => {
        const x = box.x + point.x * box.width;
        const y = contentTop + point.y * contentHeight;
        if (panelIndex === 0) {
          dot(context, x, y, 2.2, pointIndex % 2 ? colors.magenta : colors.cyan, 7);
        } else if (panelIndex === 1) {
          const radius = Math.min(box.width, box.height) * lerp(0.055, 0.145, lateralScale);
          gaussian(context, x, y, radius, radius, pointIndex % 2 ? colors.magenta : colors.cyan, 0.76);
          dot(context, x, y, 1.8, colors.text, 3);
        } else {
          const radiusX = Math.min(box.width, box.height) * lerp(0.045, 0.11, lateralScale);
          const radiusY = Math.min(box.width, box.height) * lerp(0.1, 0.27, axialScale);
          gaussian(context, x, y, radiusX, Math.max(radiusX * 1.45, radiusY), pointIndex % 2 ? colors.magenta : colors.cyan, 0.72);
          dot(context, x, y, 1.7, colors.text, 3);
        }
      });
    });

    if (!stacked) {
      label(context, "⊗  PSF", boxes[0].x + boxes[0].width + gap / 2, height / 2, colors.amber, "center", 11, 500);
      label(context, "axial blur is broader", boxes[2].x + boxes[2].width / 2, boxes[2].y + boxes[2].height - 12, colors.muted, "center", 10, 400);
    }
  }

  [naInput, wavelengthInput].forEach((input) => input.addEventListener("input", draw));
  const stopObserving = observeCanvas(canvas, draw);
  draw();
  return () => {
    stopObserving();
  };
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSampler(random) {
  let spare = null;
  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }
    const u = Math.max(Number.EPSILON, random());
    const v = Math.max(Number.EPSILON, random());
    const radius = Math.sqrt(-2 * Math.log(u));
    const angle = TWO_PI * v;
    spare = radius * Math.sin(angle);
    return radius * Math.cos(angle);
  };
}

function createCellDemoModel() {
  const imageWidth = 260;
  const imageHeight = 160;
  const intensity = new Float32Array(imageWidth * imageHeight);
  const random = mulberry32(14821);
  const cells = [];

  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      cells.push({
        x: 23 + column * 43 + (random() - 0.5) * 13,
        y: 22 + row * 39 + (random() - 0.5) * 11,
        radiusX: 5.5 + random() * 5.4,
        radiusY: 5.5 + random() * 5.8,
        amplitude: 0.48 + random() * 0.48
      });
    }
  }

  const debris = Array.from({ length: 18 }, () => ({
    x: random() * imageWidth,
    y: random() * imageHeight,
    radius: 0.7 + random() * 1.2,
    amplitude: 0.35 + random() * 0.55
  }));

  for (let y = 0; y < imageHeight; y += 1) {
    for (let x = 0; x < imageWidth; x += 1) {
      let signal = 0.018 + 0.018 * (x / imageWidth) + random() * 0.045;
      cells.forEach((cell) => {
        const dx = (x - cell.x) / cell.radiusX;
        const dy = (y - cell.y) / cell.radiusY;
        const body = Math.exp(-0.5 * (dx * dx + dy * dy));
        const nucleus = Math.exp(-1.7 * (dx * dx + dy * dy));
        signal += cell.amplitude * (0.58 * body + 0.42 * nucleus);
      });
      debris.forEach((particle) => {
        const dx = (x - particle.x) / particle.radius;
        const dy = (y - particle.y) / particle.radius;
        signal += particle.amplitude * Math.exp(-0.5 * (dx * dx + dy * dy));
      });
      intensity[y * imageWidth + x] = clamp(signal);
    }
  }
  return { imageWidth, imageHeight, intensity };
}

function analyseCellObjects(model, threshold, minimumArea) {
  const { imageWidth, imageHeight, intensity } = model;
  const labels = new Int32Array(imageWidth * imageHeight);
  labels.fill(-1);
  const components = [];
  const queue = new Int32Array(imageWidth * imageHeight);
  let labelIndex = 0;

  for (let seed = 0; seed < intensity.length; seed += 1) {
    if (intensity[seed] < threshold || labels[seed] !== -1) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = seed;
    labels[seed] = labelIndex;
    let area = 0;
    let sumX = 0;
    let sumY = 0;
    let sumIntensity = 0;
    let minX = imageWidth;
    let maxX = 0;
    let minY = imageHeight;
    let maxY = 0;

    while (head < tail) {
      const index = queue[head++];
      const x = index % imageWidth;
      const y = Math.floor(index / imageWidth);
      area += 1;
      sumX += x;
      sumY += y;
      sumIntensity += intensity[index];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= imageWidth || ny < 0 || ny >= imageHeight) continue;
          const neighbour = ny * imageWidth + nx;
          if (labels[neighbour] === -1 && intensity[neighbour] >= threshold) {
            labels[neighbour] = labelIndex;
            queue[tail++] = neighbour;
          }
        }
      }
    }

    components.push({
      label: labelIndex,
      area,
      x: sumX / area,
      y: sumY / area,
      meanIntensity: sumIntensity / area,
      minX,
      maxX,
      minY,
      maxY
    });
    labelIndex += 1;
  }

  const accepted = components
    .filter((component) => component.area >= minimumArea)
    .sort((a, b) => a.y - b.y || a.x - b.x);
  return { labels, components, accepted };
}

// This is intentionally a small educational threshold + connected-component
// pipeline. Real assays need calibration, validation and often watershed or
// model-based separation for touching, heterogeneous cells.
export function initCellCounter(root) {
  const canvas = root.querySelector("#cell-canvas");
  const runButton = root.querySelector("#cell-run");
  const resetButton = root.querySelector("#cell-reset");
  const thresholdInput = root.querySelector("#cell-threshold");
  const sizeInput = root.querySelector("#cell-size");
  const countOutput = root.querySelector("#cell-count");
  const stageOutput = root.querySelector("#cell-stage");
  if (!canvas || !runButton || !resetButton || !thresholdInput || !sizeInput || !countOutput || !stageOutput) return;

  const model = createCellDemoModel();
  const { imageWidth, imageHeight, intensity } = model;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = imageWidth;
  sourceCanvas.height = imageHeight;
  const sourceContext = sourceCanvas.getContext("2d");
  function renderSource() {
    const pixels = sourceContext.createImageData(imageWidth, imageHeight);
    for (let index = 0; index < intensity.length; index += 1) {
      const value = intensity[index];
      const offset = index * 4;
      pixels.data[offset] = Math.round(2 + value * 48);
      pixels.data[offset + 1] = Math.round(9 + value * 224);
      pixels.data[offset + 2] = Math.round(17 + value * 238);
      pixels.data[offset + 3] = 255;
    }
    sourceContext.putImageData(pixels, 0, 0);
  }
  renderSource();

  let segmentation = null;
  let progress = 0;
  let running = false;
  let startTime = 0;
  let frameRequest = 0;
  let idleMessage = "Synthetic fluorescence image ready for analysis.";

  function analyse() {
    const threshold = lerp(0.12, 0.79, rangeFraction(thresholdInput, 0.42));
    const minimumArea = Math.round(lerp(5, 125, rangeFraction(sizeInput, 0.28)));
    const { labels, components, accepted } = analyseCellObjects(model, threshold, minimumArea);
    const acceptedLabels = new Set(accepted.map((component) => component.label));
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = imageWidth;
    maskCanvas.height = imageHeight;
    const maskContext = maskCanvas.getContext("2d");
    const maskPixels = maskContext.createImageData(imageWidth, imageHeight);
    for (let index = 0; index < labels.length; index += 1) {
      if (!acceptedLabels.has(labels[index])) continue;
      const offset = index * 4;
      maskPixels.data[offset] = 77;
      maskPixels.data[offset + 1] = 227;
      maskPixels.data[offset + 2] = 255;
      maskPixels.data[offset + 3] = 175;
    }
    maskContext.putImageData(maskPixels, 0, 0);
    return { threshold, minimumArea, components, accepted, maskCanvas };
  }

  function imageBox(width, height) {
    const top = 38;
    const availableWidth = width - 24;
    const availableHeight = height - top - 16;
    const scale = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
    return {
      x: (width - imageWidth * scale) / 2,
      y: top + (availableHeight - imageHeight * scale) / 2,
      width: imageWidth * scale,
      height: imageHeight * scale,
      scale
    };
  }

  function updateStage(value) {
    if (value <= 0 || !segmentation) {
      countOutput.textContent = "–";
      stageOutput.textContent = idleMessage;
      return;
    }
    if (value < 0.3) {
      countOutput.textContent = "–";
      stageOutput.textContent = "1 · Thresholding fluorescence above the selected intensity.";
      return;
    }
    if (value < 0.55) {
      countOutput.textContent = "–";
      stageOutput.textContent = "2 · Labelling connected regions and rejecting small debris.";
      return;
    }
    if (!segmentation.accepted.length) {
      countOutput.textContent = "0";
      stageOutput.textContent = "No connected objects passed the current threshold and size filters.";
      return;
    }
    const reveal = clamp((value - 0.55) / 0.45);
    const inspected = value >= 1
      ? segmentation.accepted.length
      : Math.min(segmentation.accepted.length, Math.floor(reveal * segmentation.accepted.length));
    countOutput.textContent = String(inspected);
    stageOutput.textContent = value < 1
      ? `3 · Inspecting candidate ${Math.min(inspected + 1, segmentation.accepted.length)} of ${segmentation.accepted.length}.`
      : `Complete · ${segmentation.accepted.length} connected objects counted in this demo.`;
  }

  function draw(value = progress) {
    const { context, width, height } = canvasFrame(canvas, 920, 440);
    const colors = palette(canvas);
    paintBackground(context, width, height, colors);
    const box = imageBox(width, height);
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, box.x, box.y, box.width, box.height);

    label(context, "SYNTHETIC FLUORESCENCE · EDUCATIONAL DEMO", box.x, 19, colors.muted, "left", 10, 500);
    if (segmentation && value > 0) {
      context.save();
      roundedRect(context, box.x, box.y, box.width, box.height, 2);
      context.clip();
      if (value < 0.3) {
        const wipe = ease(value / 0.3);
        context.globalAlpha = 0.62;
        context.drawImage(
          segmentation.maskCanvas,
          0,
          0,
          imageWidth * wipe,
          imageHeight,
          box.x,
          box.y,
          box.width * wipe,
          box.height
        );
        line(context, box.x + box.width * wipe, box.y, box.x + box.width * wipe, box.y + box.height, colors.amber, 2, 0.9);
      } else {
        context.globalAlpha = value < 0.55 ? lerp(0.25, 0.55, (value - 0.3) / 0.25) : 0.25;
        context.drawImage(segmentation.maskCanvas, box.x, box.y, box.width, box.height);
      }
      context.restore();

      if (value >= 0.55) {
        const reveal = clamp((value - 0.55) / 0.45);
        const visible = Math.min(segmentation.accepted.length, Math.ceil(reveal * segmentation.accepted.length));
        segmentation.accepted.slice(0, visible).forEach((component, index) => {
          const x = box.x + component.minX * box.scale;
          const y = box.y + component.minY * box.scale;
          const componentWidth = (component.maxX - component.minX + 1) * box.scale;
          const componentHeight = (component.maxY - component.minY + 1) * box.scale;
          const isCurrent = index === visible - 1 && reveal < 1;
          context.save();
          context.strokeStyle = isCurrent ? colors.amber : colors.cyan;
          context.lineWidth = isCurrent ? 2.4 : 1.35;
          context.globalAlpha = isCurrent ? 1 : 0.83;
          context.strokeRect(x - 3, y - 3, componentWidth + 6, componentHeight + 6);
          context.restore();
          const centroidX = box.x + component.x * box.scale;
          const centroidY = box.y + component.y * box.scale;
          dot(context, centroidX, centroidY, isCurrent ? 3 : 2, isCurrent ? colors.amber : colors.text, isCurrent ? 10 : 3);
          if (box.scale > 1.7) {
            label(context, String(index + 1), x - 5, y - 8, isCurrent ? colors.amber : colors.text, "right", 9, 500);
          }
        });

        if (reveal < 1) {
          const scanY = box.y + box.height * reveal;
          line(context, box.x, scanY, box.x + box.width, scanY, colors.amber, 1.5, 0.75);
        }
      }
    }

    context.save();
    context.strokeStyle = colors.line;
    context.lineWidth = 1;
    roundedRect(context, box.x, box.y, box.width, box.height, 2);
    context.stroke();
    context.restore();
    updateStage(value);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameRequest);
    runButton.setAttribute("aria-pressed", "false");
  }

  function animate(timestamp) {
    if (!running) return;
    if (!startTime) startTime = timestamp;
    progress = clamp((timestamp - startTime) / 3600);
    draw(progress);
    if (progress < 1) {
      frameRequest = requestAnimationFrame(animate);
    } else {
      stop();
      runButton.textContent = "Run again";
    }
  }

  function parametersChanged() {
    stop();
    progress = 0;
    segmentation = null;
    runButton.textContent = "Run analysis";
    idleMessage = "Parameters updated. Run the analysis again.";
    updateRangeOutput(thresholdInput, `${Math.round(Number(thresholdInput.value))}%`);
    updateRangeOutput(sizeInput, `${Math.round(Number(sizeInput.value))} px`);
    draw(0);
  }

  runButton.addEventListener("click", () => {
    stop();
    segmentation = analyse();
    progress = reducedMotion.matches ? 1 : 0;
    startTime = 0;
    if (reducedMotion.matches) {
      draw(1);
      runButton.textContent = "Run again";
      return;
    }
    running = true;
    runButton.textContent = "Analysing…";
    runButton.setAttribute("aria-pressed", "true");
    frameRequest = requestAnimationFrame(animate);
  });

  resetButton.addEventListener("click", () => {
    stop();
    segmentation = null;
    progress = 0;
    startTime = 0;
    idleMessage = "Synthetic fluorescence image ready for analysis.";
    runButton.textContent = "Run analysis";
    draw(0);
  });
  thresholdInput.addEventListener("input", parametersChanged);
  sizeInput.addEventListener("input", parametersChanged);
  const stopObserving = observeCanvas(canvas, () => draw(progress));
  updateRangeOutput(thresholdInput, `${Math.round(Number(thresholdInput.value))}%`);
  updateRangeOutput(sizeInput, `${Math.round(Number(sizeInput.value))} px`);
  draw(0);
  return () => {
    cancelAnimationFrame(frameRequest);
    stopObserving();
  };
}

function median(values) {
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2
    ? ordered[middle]
    : (ordered[middle - 1] + ordered[middle]) / 2;
}

function quantile(values, fraction) {
  const ordered = [...values].sort((a, b) => a - b);
  if (!ordered.length) return 0;
  const position = clamp(fraction) * (ordered.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return lerp(ordered[lower], ordered[upper], position - lower);
}

function histogram(values, minimum, maximum, binCount) {
  const counts = new Array(binCount).fill(0);
  const width = (maximum - minimum) / binCount;
  values.forEach((value) => {
    const bin = Math.floor((value - minimum) / width);
    if (bin >= 0 && bin < binCount) counts[bin] += 1;
    else if (value === maximum) counts[binCount - 1] += 1;
  });
  return { counts, width, minimum, maximum };
}

export function initObjectMeasurements(root) {
  const canvas = root.querySelector("#objects-canvas");
  const chartStage = root.querySelector("#objects-chart-stage");
  const buildButton = root.querySelector("#objects-build-table");
  const histogramButton = root.querySelector("#objects-plot-histogram");
  const compareButton = root.querySelector("#objects-compare-groups");
  const resetButton = root.querySelector("#objects-reset");
  const histogramTypeButton = root.querySelector("#objects-plot-type-histogram");
  const violinTypeButton = root.querySelector("#objects-plot-type-violin");
  const tableBody = root.querySelector("#objects-table-body");
  const stageOutput = root.querySelector("#objects-stage");
  const controlOutput = root.querySelector("#objects-control-mean");
  const wildTypeOutput = root.querySelector("#objects-wt-mean");
  const differenceOutput = root.querySelector("#objects-delta");
  if (!canvas || !chartStage || !buildButton || !histogramButton || !compareButton || !resetButton || !histogramTypeButton || !violinTypeButton || !tableBody || !stageOutput || !controlOutput || !wildTypeOutput || !differenceOutput) return;

  // Use the same seeded fluorescence field and default segmentation settings
  // as the previous slide, but calculate it independently so direct links work.
  const cellModel = createCellDemoModel();
  const defaultSegmentation = analyseCellObjects(cellModel, 0.455, 42);
  const pixelArea = 0.8 * 0.8;
  const measurements = defaultSegmentation.accepted.map((component, index) => {
    const area = component.area * pixelArea;
    return {
      id: index + 1,
      area,
      diameter: 2 * Math.sqrt(area / Math.PI),
      intensity: component.meanIntensity
    };
  });

  function syntheticCohort(seed, centre, logDeviation, count = 60) {
    const randomNormal = normalSampler(mulberry32(seed));
    return Array.from({ length: count }, () => centre * Math.exp(logDeviation * randomNormal()));
  }

  const controlValues = syntheticCohort(1729, 78, 0.18);
  const wildTypeValues = syntheticCohort(2718, 98, 0.26);
  const controlMedian = median(controlValues);
  const wildTypeMedian = median(wildTypeValues);
  const medianShift = ((wildTypeMedian / controlMedian) - 1) * 100;

  let mode = "ready";
  let progress = 0;
  let frameRequest = 0;
  let startTime = 0;
  let tableBuilt = false;
  let plotType = "histogram";

  function setMetricOutputs(showComparison) {
    controlOutput.textContent = showComparison ? `${controlMedian.toFixed(1)} µm²` : "–";
    wildTypeOutput.textContent = showComparison ? `${wildTypeMedian.toFixed(1)} µm²` : "–";
    differenceOutput.textContent = showComparison ? `${medianShift >= 0 ? "+" : ""}${medianShift.toFixed(0)}%` : "–";
  }

  function renderTable() {
    tableBody.replaceChildren();
    const visibleRows = measurements.slice(0, 6);
    visibleRows.forEach((measurement, index) => {
      const row = document.createElement("tr");
      if (!reducedMotion.matches) {
        row.classList.add("is-entering");
        row.style.animationDelay = `${index * 65}ms`;
      }
      [
        String(measurement.id).padStart(2, "0"),
        measurement.area.toFixed(1),
        measurement.diameter.toFixed(2),
        measurement.intensity.toFixed(3)
      ].forEach((textValue) => {
        const cell = document.createElement("td");
        cell.textContent = textValue;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
    if (measurements.length > visibleRows.length) {
      const row = document.createElement("tr");
      row.className = reducedMotion.matches ? "table-more" : "table-more is-entering";
      row.style.animationDelay = `${visibleRows.length * 65}ms`;
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = `+ ${measurements.length - visibleRows.length} more objects`;
      row.appendChild(cell);
      tableBody.appendChild(row);
    }
  }

  function renderEmptyTable() {
    tableBody.replaceChildren();
    const row = document.createElement("tr");
    row.className = "table-empty";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "Run “Build table” to calculate per-object features.";
    row.appendChild(cell);
    tableBody.appendChild(row);
  }

  function drawObjectFlow(context, width, height, colors, amount) {
    label(context, "SEGMENTED MASK  →  OBJECT IDS  →  MEASUREMENT ROWS", width / 2, 28, colors.text, "center", 11, 650);
    const reveal = ease(amount);
    const leftX = width * 0.2;
    const rightX = width * 0.69;
    const centreY = height * 0.52;
    const radius = Math.min(width, height) * 0.036;
    const dotLayout = [
      [-1.35, -1.2], [-0.1, -1.3], [1.2, -1.05],
      [-1.1, 0], [0.2, -0.1], [1.3, 0.08],
      [-1.2, 1.18], [0, 1.25], [1.2, 1.08]
    ];
    dotLayout.forEach(([dx, dy], index) => {
      const visible = clamp(reveal * dotLayout.length - index);
      if (visible <= 0) return;
      dot(context, leftX + dx * radius * 2.25, centreY + dy * radius * 2.25, radius * (0.72 + (index % 3) * 0.12), colors.cyan, 7 * visible);
      label(context, String(index + 1), leftX + dx * radius * 2.25, centreY + dy * radius * 2.25, colors.background, "center", 8, 750);
    });
    line(context, width * 0.37, centreY, width * 0.48, centreY, colors.amber, 2, Math.max(0.2, reveal));
    label(context, "measure", width * 0.425, centreY - 14, colors.amber, "center", 9, 600);
    const rowWidth = width * 0.42;
    for (let index = 0; index < 7; index += 1) {
      const visible = clamp(reveal * 8 - index);
      if (visible <= 0) continue;
      const y = height * 0.3 + index * Math.min(28, height * 0.075);
      context.save();
      context.globalAlpha = 0.18 + visible * 0.55;
      context.fillStyle = index % 2 ? colors.surface : colors.line;
      roundedRect(context, rightX - rowWidth / 2, y, rowWidth, 18, 4);
      context.fill();
      context.restore();
      label(context, String(index + 1).padStart(2, "0"), rightX - rowWidth / 2 + 10, y + 9, colors.text, "left", 8, 650);
      line(context, rightX - rowWidth * 0.12, y + 9, rightX + rowWidth * 0.38, y + 9, colors.muted, 1, 0.7);
    }
    label(context, measurements.length ? `${measurements.length} OBJECTS · 0.80 µm/px CALIBRATION` : "OBJECTS", width / 2, height - 22, colors.muted, "center", 9, 550);
  }

  function drawHistogramAxes(context, box, colors, xMinimum, xMaximum, yMaximum, yLabel) {
    for (let tick = 0; tick <= 4; tick += 1) {
      const y = lerp(box.bottom, box.top, tick / 4);
      line(context, box.left, y, box.right, y, colors.line, 1, tick ? 0.45 : 0.82);
      label(context, String(Math.round((yMaximum * tick) / 4)), box.left - 9, y, colors.muted, "right", 9, 500);
    }
    for (let tick = 0; tick <= 4; tick += 1) {
      const x = lerp(box.left, box.right, tick / 4);
      const value = lerp(xMinimum, xMaximum, tick / 4);
      label(context, String(Math.round(value)), x, box.bottom + 16, colors.muted, "center", 9, 500);
    }
    line(context, box.left, box.top, box.left, box.bottom, colors.muted, 1, 0.7);
    line(context, box.left, box.bottom, box.right, box.bottom, colors.muted, 1, 0.7);
    label(context, "Area (µm²)", (box.left + box.right) / 2, box.bottom + 36, colors.text, "center", 10, 600);
    context.save();
    context.translate(15, (box.top + box.bottom) / 2);
    context.rotate(-Math.PI / 2);
    label(context, yLabel, 0, 0, colors.text, "center", 9, 600);
    context.restore();
  }

  function drawSingleHistogram(context, width, height, colors, amount) {
    const areas = measurements.map((measurement) => measurement.area);
    const data = histogram(areas, 25, 125, 10);
    const maximumCount = Math.max(...data.counts, 1);
    const yMaximum = Math.max(4, Math.ceil(maximumCount / 2) * 2);
    const box = { left: 52, right: width - 22, top: 52, bottom: height - 56 };
    drawHistogramAxes(context, box, colors, data.minimum, data.maximum, yMaximum, "Objects");
    const slot = (box.right - box.left) / data.counts.length;
    const reveal = ease(amount);
    data.counts.forEach((count, index) => {
      const barHeight = ((box.bottom - box.top) * count * reveal) / yMaximum;
      context.save();
      context.fillStyle = colors.cyan;
      context.globalAlpha = 0.78;
      roundedRect(context, box.left + index * slot + 2, box.bottom - barHeight, Math.max(2, slot - 4), barHeight, 3);
      context.fill();
      context.restore();
    });
    const areaMedian = median(areas);
    const meanX = lerp(box.left, box.right, (areaMedian - data.minimum) / (data.maximum - data.minimum));
    context.save();
    context.setLineDash([5, 5]);
    line(context, meanX, box.top, meanX, box.bottom, colors.amber, 1.5, reveal);
    context.restore();
    label(context, `median ${areaMedian.toFixed(1)} µm²`, meanX + 6, box.top + 12, colors.amber, "left", 9, 650);
    label(context, `AREA DISTRIBUTION · ${measurements.length} OBJECTS`, box.left, 25, colors.text, "left", 11, 650);
  }

  function drawComparison(context, width, height, colors, amount) {
    const minimum = 40;
    const maximum = 190;
    const binCount = 10;
    const controlHistogram = histogram(controlValues, minimum, maximum, binCount);
    const wildTypeHistogram = histogram(wildTypeValues, minimum, maximum, binCount);
    const controlPercent = controlHistogram.counts.map((count) => (100 * count) / controlValues.length);
    const wildTypePercent = wildTypeHistogram.counts.map((count) => (100 * count) / wildTypeValues.length);
    const maximumPercent = Math.max(...controlPercent, ...wildTypePercent, 1);
    const yMaximum = Math.max(20, Math.ceil(maximumPercent / 10) * 10);
    const box = { left: 52, right: width - 22, top: 58, bottom: height - 56 };
    drawHistogramAxes(context, box, colors, minimum, maximum, yMaximum, "Frequency (%)");
    const slot = (box.right - box.left) / binCount;
    const reveal = ease(amount);
    for (let index = 0; index < binCount; index += 1) {
      const groupWidth = Math.max(2, (slot - 5) / 2);
      const controlHeight = ((box.bottom - box.top) * controlPercent[index] * reveal) / yMaximum;
      const wildTypeHeight = ((box.bottom - box.top) * wildTypePercent[index] * reveal) / yMaximum;
      context.save();
      context.globalAlpha = 0.78;
      context.fillStyle = colors.cyan;
      roundedRect(context, box.left + index * slot + 2, box.bottom - controlHeight, groupWidth, controlHeight, 2);
      context.fill();
      context.fillStyle = colors.magenta;
      roundedRect(context, box.left + index * slot + 2 + groupWidth, box.bottom - wildTypeHeight, groupWidth, wildTypeHeight, 2);
      context.fill();
      context.restore();
    }

    [
      { value: controlMedian, color: colors.cyan },
      { value: wildTypeMedian, color: colors.magenta }
    ].forEach((series) => {
      const x = lerp(box.left, box.right, (series.value - minimum) / (maximum - minimum));
      context.save();
      context.setLineDash([5, 5]);
      line(context, x, box.top, x, box.bottom, series.color, 1.35, reveal);
      context.restore();
    });
    label(context, "SYNTHETIC COHORTS · COMMON BINS", box.left, 25, colors.text, "left", 11, 650);
    dot(context, width - 178, 26, 4, colors.cyan);
    label(context, "Control", width - 167, 26, colors.text, "left", 9, 600);
    dot(context, width - 93, 26, 4, colors.magenta);
    label(context, "Wild type", width - 82, 26, colors.text, "left", 9, 600);
  }

  function densityCurve(values, minimum, maximum, sampleCount = 72, bandwidth = 8) {
    const denominator = Math.max(1, values.length) * bandwidth * Math.sqrt(2 * Math.PI);
    return Array.from({ length: sampleCount }, (_, index) => {
      const value = lerp(minimum, maximum, index / (sampleCount - 1));
      const density = values.reduce((sum, observation) => {
        const z = (value - observation) / bandwidth;
        return sum + Math.exp(-0.5 * z * z);
      }, 0) / denominator;
      return { value, density };
    });
  }

  function densityAt(values, value, bandwidth) {
    const denominator = Math.max(1, values.length) * bandwidth * Math.sqrt(2 * Math.PI);
    return values.reduce((sum, observation) => {
      const z = (value - observation) / bandwidth;
      return sum + Math.exp(-0.5 * z * z);
    }, 0) / denominator;
  }

  function densityBandwidth(values) {
    const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / Math.max(1, values.length - 1);
    const standardDeviation = Math.sqrt(variance);
    const interquartileRange = quantile(values, 0.75) - quantile(values, 0.25);
    const robustSpread = Math.min(standardDeviation || Infinity, interquartileRange > 0 ? interquartileRange / 1.34 : Infinity);
    const spread = Number.isFinite(robustSpread) ? robustSpread : (standardDeviation || 1);
    return Math.max(2.5, 0.9 * spread * (Math.max(2, values.length) ** -0.2));
  }

  function drawViolinAxes(context, box, colors, minimum, maximum, categories) {
    for (let tick = 0; tick <= 4; tick += 1) {
      const x = lerp(box.left, box.right, tick / 4);
      const value = lerp(minimum, maximum, tick / 4);
      line(context, x, box.top, x, box.bottom, colors.line, 1, tick ? 0.45 : 0.82);
      label(context, String(Math.round(value)), x, box.bottom + 16, colors.muted, "center", 9, 500);
    }
    line(context, box.left, box.bottom, box.right, box.bottom, colors.muted, 1, 0.7);
    label(context, "Area (µm²)", (box.left + box.right) / 2, box.bottom + 36, colors.text, "center", 10, 600);
    categories.forEach((category) => {
      line(context, box.left, category.y, box.right, category.y, colors.line, 1, 0.38);
      label(context, category.label, box.left + 8, category.y - category.halfHeight - 12, category.color || colors.text, "left", 9, 650);
    });
  }

  function drawViolinSeries(context, options) {
    const {
      values,
      curve,
      scaleMaximum,
      centreY,
      maximumHalfHeight,
      box,
      minimum,
      maximum,
      bandwidth,
      color,
      medianColor,
      amount,
      seed
    } = options;
    const reveal = ease(amount);
    const horizontalPosition = (value) => lerp(box.left, box.right, clamp((value - minimum) / (maximum - minimum)));
    const halfHeightAt = (density) => maximumHalfHeight * (density / Math.max(scaleMaximum, 1e-8)) * reveal;

    context.save();
    context.beginPath();
    curve.forEach((point, index) => {
      const x = horizontalPosition(point.value);
      const y = centreY - halfHeightAt(point.density);
      if (!index) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    [...curve].reverse().forEach((point) => {
      context.lineTo(horizontalPosition(point.value), centreY + halfHeightAt(point.density));
    });
    context.closePath();
    context.globalAlpha = 0.24;
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 0.88;
    context.strokeStyle = color;
    context.lineWidth = 1.5;
    context.stroke();
    context.restore();

    values.forEach((value, index) => {
      const random = Math.sin((index + 1) * (12.9898 + seed * 0.271)) * 43758.5453;
      const jitter = ((random - Math.floor(random)) * 2) - 1;
      const localDensity = densityAt(values, value, bandwidth);
      const availableHalfHeight = maximumHalfHeight * (localDensity / Math.max(scaleMaximum, 1e-8)) * 0.72 * reveal;
      context.save();
      context.globalAlpha = 0.14 + reveal * 0.38;
      context.fillStyle = color;
      context.beginPath();
      context.arc(horizontalPosition(value), centreY + jitter * availableHalfHeight, 1.75, 0, TWO_PI);
      context.fill();
      context.restore();
    });

    const statisticsReveal = clamp(amount * 1.65 - 0.5);
    const lowerQuartileX = horizontalPosition(quantile(values, 0.25));
    const upperQuartileX = horizontalPosition(quantile(values, 0.75));
    const medianX = horizontalPosition(median(values));
    line(context, lowerQuartileX, centreY, upperQuartileX, centreY, medianColor, 5, statisticsReveal);
    line(context, medianX, centreY - 10, medianX, centreY + 10, medianColor, 2.4, statisticsReveal);
    dot(context, medianX, centreY, 2.5, medianColor);
  }

  function drawSingleViolin(context, width, height, colors, amount) {
    const values = measurements.map((measurement) => measurement.area);
    const minimum = 25;
    const maximum = 125;
    const bandwidth = densityBandwidth(values);
    const curve = densityCurve(values, minimum, maximum, 72, bandwidth);
    const scaleMaximum = Math.max(...curve.map((point) => point.density), 1e-8);
    const box = { left: 52, right: width - 22, top: 52, bottom: height - 56 };
    const centreY = (box.top + box.bottom) / 2;
    const halfHeight = Math.min(72, (box.bottom - box.top) * 0.32);
    drawViolinAxes(context, box, colors, minimum, maximum, [{ label: `Segmented objects · n=${measurements.length}`, y: centreY, halfHeight, color: colors.cyan }]);
    drawViolinSeries(context, {
      values,
      curve,
      scaleMaximum,
      centreY,
      maximumHalfHeight: halfHeight,
      box,
      minimum,
      maximum,
      bandwidth,
      color: colors.cyan,
      medianColor: colors.amber,
      amount,
      seed: 19
    });
    label(context, `VIOLIN PLOT · SAME ${measurements.length} OBJECTS`, box.left, 25, colors.text, "left", 11, 650);
    label(context, "width = estimated density · dots = objects", box.right, 25, colors.muted, "right", 8.5, 550);
  }

  function drawComparisonViolins(context, width, height, colors, amount) {
    const minimum = 40;
    const maximum = 190;
    const bandwidth = densityBandwidth([...controlValues, ...wildTypeValues]);
    const controlCurve = densityCurve(controlValues, minimum, maximum, 80, bandwidth);
    const wildTypeCurve = densityCurve(wildTypeValues, minimum, maximum, 80, bandwidth);
    const scaleMaximum = Math.max(
      ...controlCurve.map((point) => point.density),
      ...wildTypeCurve.map((point) => point.density),
      1e-8
    );
    const box = { left: 52, right: width - 22, top: 52, bottom: height - 56 };
    const controlY = lerp(box.top, box.bottom, 0.3);
    const wildTypeY = lerp(box.top, box.bottom, 0.72);
    const halfHeight = Math.min(44, (box.bottom - box.top) * 0.17);
    drawViolinAxes(context, box, colors, minimum, maximum, [
      { label: `Control · n=${controlValues.length}`, y: controlY, halfHeight, color: colors.cyan },
      { label: `Wild type · n=${wildTypeValues.length}`, y: wildTypeY, halfHeight, color: colors.magenta }
    ]);
    drawViolinSeries(context, {
      values: controlValues,
      curve: controlCurve,
      scaleMaximum,
      centreY: controlY,
      maximumHalfHeight: halfHeight,
      box,
      minimum,
      maximum,
      bandwidth,
      color: colors.cyan,
      medianColor: colors.amber,
      amount,
      seed: 31
    });
    drawViolinSeries(context, {
      values: wildTypeValues,
      curve: wildTypeCurve,
      scaleMaximum,
      centreY: wildTypeY,
      maximumHalfHeight: halfHeight,
      box,
      minimum,
      maximum,
      bandwidth,
      color: colors.magenta,
      medianColor: colors.amber,
      amount,
      seed: 47
    });
    label(context, "SYNTHETIC COHORTS · SAME VALUES, VIOLIN VIEW", box.left, 25, colors.text, "left", 11, 650);
    label(context, "thick line = IQR · tick = median", box.right, 25, colors.muted, "right", 8.5, 550);
  }

  function draw() {
    const { context, width, height } = canvasFrame(canvas, 690, 350);
    const colors = palette(canvas);
    paintBackground(context, width, height, colors);
    if (mode === "plot") {
      if (plotType === "violin") drawSingleViolin(context, width, height, colors, progress);
      else drawSingleHistogram(context, width, height, colors, progress);
    } else if (mode === "compare") {
      if (plotType === "violin") drawComparisonViolins(context, width, height, colors, progress);
      else drawComparison(context, width, height, colors, progress);
    }
    else drawObjectFlow(context, width, height, colors, mode === "table" ? progress : 0.18);
  }

  function stopAnimation() {
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    startTime = 0;
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    progress = clamp((timestamp - startTime) / 950);
    draw();
    if (progress < 1) frameRequest = requestAnimationFrame(animate);
    else {
      frameRequest = 0;
      startTime = 0;
    }
  }

  function transition(nextMode) {
    stopAnimation();
    mode = nextMode;
    progress = reducedMotion.matches ? 1 : 0;
    draw();
    if (!reducedMotion.matches) frameRequest = requestAnimationFrame(animate);
  }

  function plotStatus(currentMode = mode) {
    if (currentMode === "plot") {
      return plotType === "violin"
        ? `Same ${measurements.length} area values · violin width shows estimated density while dots retain every object.`
        : `Same ${measurements.length} area values · histogram bins show how many objects fall in each area range.`;
    }
    if (currentMode === "compare") {
      return plotType === "violin"
        ? "Same two synthetic cohorts · shared-scale violins compare density while dots retain all observations."
        : "Same two synthetic cohorts · common-bin histograms compare frequency across the area range.";
    }
    return `${plotType === "violin" ? "Violin" : "Histogram"} selected · use “2 · Plot” to redraw the same object measurements.`;
  }

  function updatePlotType(nextPlotType, redraw = true) {
    plotType = nextPlotType;
    histogramTypeButton.setAttribute("aria-pressed", String(plotType === "histogram"));
    violinTypeButton.setAttribute("aria-pressed", String(plotType === "violin"));
    canvas.setAttribute(
      "aria-label",
      plotType === "violin"
        ? "Animated violin plots of the same object-area measurements and synthetic comparison cohorts"
        : "Animated histograms of the same object-area measurements and synthetic comparison cohorts"
    );
    stageOutput.textContent = plotStatus();
    if (redraw && (mode === "plot" || mode === "compare")) transition(mode);
  }

  buildButton.addEventListener("click", () => {
    renderTable();
    tableBuilt = true;
    stageOutput.textContent = `${measurements.length} connected objects measured · calibrated pixels converted into physical features.`;
    setMetricOutputs(false);
    transition("table");
  });

  histogramButton.addEventListener("click", () => {
    if (!tableBuilt) {
      renderTable();
      tableBuilt = true;
    }
    stageOutput.textContent = plotStatus("plot");
    setMetricOutputs(false);
    transition("plot");
  });

  compareButton.addEventListener("click", () => {
    if (!tableBuilt) {
      renderTable();
      tableBuilt = true;
    }
    stageOutput.textContent = plotStatus("compare");
    setMetricOutputs(true);
    transition("compare");
  });

  histogramTypeButton.addEventListener("click", () => updatePlotType("histogram"));
  violinTypeButton.addEventListener("click", () => updatePlotType("violin"));

  resetButton.addEventListener("click", () => {
    stopAnimation();
    mode = "ready";
    progress = 0;
    tableBuilt = false;
    updatePlotType("histogram", false);
    stageOutput.textContent = `Ready · ${measurements.length} segmented objects are waiting to be measured.`;
    setMetricOutputs(false);
    renderEmptyTable();
    draw();
  });

  const stopObserving = observeCanvas(canvas, draw);
  stageOutput.textContent = `Ready · ${measurements.length} segmented objects are waiting to be measured.`;
  draw();
  chartStage.dataset.state = "ready";
  buildButton.textContent = "1 · Build table";
  [buildButton, histogramButton, compareButton, resetButton, histogramTypeButton, violinTypeButton].forEach((button) => { button.disabled = false; });
  return () => {
    cancelAnimationFrame(frameRequest);
    stopObserving();
  };
}

function solveLinearSystem(matrix, vector) {
  const size = vector.length;
  const augmented = matrix.map((row, index) => [...row, vector[index]]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column];
    if (Math.abs(divisor) < 1e-12) return null;
    for (let entry = column; entry <= size; entry += 1) augmented[column][entry] /= divisor;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let entry = column; entry <= size; entry += 1) {
        augmented[row][entry] -= factor * augmented[column][entry];
      }
    }
  }
  return augmented.map((row) => row[size]);
}

function evaluatePolynomial(coefficients, x) {
  return coefficients.reduceRight((total, coefficient) => total * x + coefficient, 0);
}

function weightedPolynomialFit(data, degree) {
  const parameterCount = degree + 1;
  const matrix = Array.from({ length: parameterCount }, () => new Array(parameterCount).fill(0));
  const vector = new Array(parameterCount).fill(0);
  data.forEach(({ x, y, sigma }) => {
    const weight = 1 / (sigma * sigma);
    for (let row = 0; row < parameterCount; row += 1) {
      vector[row] += weight * y * (x ** row);
      for (let column = 0; column < parameterCount; column += 1) {
        matrix[row][column] += weight * (x ** (row + column));
      }
    }
  });
  const coefficients = solveLinearSystem(matrix, vector);
  if (!coefficients) return null;
  const predictions = data.map((point) => evaluatePolynomial(coefficients, point.x));
  const averageY = data.reduce((sum, point) => sum + point.y, 0) / data.length;
  const residuals = data.map((point, index) => point.y - predictions[index]);
  const residualSumSquares = residuals.reduce((sum, residual) => sum + residual * residual, 0);
  const totalSumSquares = data.reduce((sum, point) => sum + ((point.y - averageY) ** 2), 0);
  const chiSquare = residuals.reduce((sum, residual, index) => sum + ((residual / data[index].sigma) ** 2), 0);
  return {
    degree,
    coefficients,
    predictions,
    residuals,
    standardizedResiduals: residuals.map((residual, index) => residual / data[index].sigma),
    rSquared: 1 - residualSumSquares / totalSumSquares,
    reducedChiSquare: chiSquare / Math.max(1, data.length - parameterCount)
  };
}

function polynomialEquation(coefficients) {
  const superscripts = ["", "", "²", "³"];
  const terms = [];
  for (let power = coefficients.length - 1; power >= 0; power -= 1) {
    const coefficient = coefficients[power];
    const magnitude = Math.abs(coefficient).toFixed(3);
    const variable = power === 0 ? "" : `x${superscripts[power]}`;
    if (!terms.length) terms.push(`${coefficient < 0 ? "−" : ""}${magnitude}${variable}`);
    else terms.push(`${coefficient < 0 ? "−" : "+"} ${magnitude}${variable}`);
  }
  return `ŷ = ${terms.join(" ")}`;
}

export function initRegressionFitting(root) {
  const canvas = root.querySelector("#fit-canvas");
  const chartStage = root.querySelector("#fit-chart-stage");
  const modelButtons = Array.from(root.querySelectorAll(".fit-models [data-degree]"));
  const fitButton = root.querySelector("#fit-run");
  const newDataButton = root.querySelector("#fit-new-data");
  const equationOutput = root.querySelector("#fit-equation");
  const rSquaredOutput = root.querySelector("#fit-r2");
  const chiSquareOutput = root.querySelector("#fit-chi2");
  const stageOutput = root.querySelector("#fit-stage");
  const checkOutput = root.querySelector("#fit-check");
  if (!canvas || !chartStage || !modelButtons.length || !fitButton || !newDataButton || !equationOutput || !rSquaredOutput || !chiSquareOutput || !stageOutput || !checkOutput) return;

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sigmaValues = [0.7, 0.8, 0.7, 1.0, 0.9, 1.1, 0.9, 1.2, 1.0, 1.3, 1.2];
  const baseYValues = [1.992, 2.343, 5.855, 7.569, 12.676, 14.546, 20.413, 23.536, 32.039, 37.264, 45.293];
  let dataIndex = 0;
  let data = xValues.map((x, index) => ({ x, y: baseYValues[index], sigma: sigmaValues[index] }));
  let selectedDegree = 1;
  let fitResult = null;
  let progress = 0;
  let frameRequest = 0;
  let startTime = 0;
  let metricsShown = false;

  function createNoisyData(index) {
    if (index === 0) return xValues.map((x, pointIndex) => ({ x, y: baseYValues[pointIndex], sigma: sigmaValues[pointIndex] }));
    const randomNormal = normalSampler(mulberry32(8100 + index * 97));
    return xValues.map((x, pointIndex) => ({
      x,
      sigma: sigmaValues[pointIndex],
      y: 1.771 + 1.165 * x + 0.315 * x * x + randomNormal() * sigmaValues[pointIndex]
    }));
  }

  function clearOutputs() {
    equationOutput.textContent = "Choose a model, then fit";
    rSquaredOutput.textContent = "–";
    chiSquareOutput.textContent = "–";
    checkOutput.textContent = "Check three things together: the curve, the error bars, and the residuals.";
    metricsShown = false;
  }

  function showOutputs() {
    if (!fitResult || metricsShown) return;
    equationOutput.textContent = polynomialEquation(fitResult.coefficients);
    rSquaredOutput.textContent = fitResult.rSquared.toFixed(4);
    chiSquareOutput.textContent = fitResult.reducedChiSquare.toFixed(2);
    if (fitResult.degree === 1) {
      checkOutput.textContent = "Systematic curved residuals reveal underfitting, even though R² looks high.";
    } else if (fitResult.degree === 2) {
      checkOutput.textContent = "Residuals scatter around zero and reduced χ² is near one: the curvature is captured.";
    } else {
      checkOutput.textContent = "The extra cubic term adds almost no explanatory value; prefer the simpler adequate model.";
    }
    metricsShown = true;
  }

  function plotGeometry(width, height) {
    const mainBottom = Math.max(170, height * 0.62);
    return {
      main: { left: 56, right: width - 20, top: 42, bottom: mainBottom },
      residual: { left: 56, right: width - 20, top: mainBottom + 58, bottom: height - 34 }
    };
  }

  function drawRegression() {
    const { context, width, height } = canvasFrame(canvas, 760, 390);
    const colors = palette(canvas);
    paintBackground(context, width, height, colors);
    const geometry = plotGeometry(width, height);
    const main = geometry.main;
    const residual = geometry.residual;
    const xMinimum = 0;
    const xMaximum = 10;
    const yRawMinimum = Math.min(...data.map((point) => point.y - point.sigma));
    const yRawMaximum = Math.max(...data.map((point) => point.y + point.sigma));
    const yRange = Math.max(1, yRawMaximum - yRawMinimum);
    const yMinimum = Math.min(0, yRawMinimum - yRange * 0.08);
    const yMaximum = yRawMaximum + yRange * 0.08;
    const mapX = (value) => lerp(main.left, main.right, (value - xMinimum) / (xMaximum - xMinimum));
    const mapY = (value) => lerp(main.bottom, main.top, (value - yMinimum) / (yMaximum - yMinimum));

    label(context, "SYNTHETIC RESPONSE · VERTICAL BARS = ±1σ", main.left, 21, colors.text, "left", 10, 650);
    for (let tick = 0; tick <= 5; tick += 1) {
      const value = lerp(yMinimum, yMaximum, tick / 5);
      const y = mapY(value);
      line(context, main.left, y, main.right, y, colors.line, 1, tick ? 0.42 : 0.72);
      label(context, value.toFixed(0), main.left - 9, y, colors.muted, "right", 9, 500);
    }
    line(context, main.left, main.top, main.left, main.bottom, colors.muted, 1, 0.72);
    line(context, main.left, main.bottom, main.right, main.bottom, colors.muted, 1, 0.72);
    data.forEach((point) => {
      const x = mapX(point.x);
      const upper = mapY(point.y + point.sigma);
      const lower = mapY(point.y - point.sigma);
      line(context, x, upper, x, lower, colors.muted, 1.25, 0.88);
      line(context, x - 4, upper, x + 4, upper, colors.muted, 1.25, 0.88);
      line(context, x - 4, lower, x + 4, lower, colors.muted, 1.25, 0.88);
      dot(context, x, mapY(point.y), 3.5, colors.cyan, 5);
    });

    if (fitResult) {
      const reveal = ease(progress);
      const samples = 180;
      const visibleSamples = Math.max(2, Math.floor(samples * reveal));
      context.save();
      roundedRect(context, main.left, main.top, main.right - main.left, main.bottom - main.top, 1);
      context.clip();
      context.strokeStyle = colors.magenta;
      context.shadowColor = colors.magenta;
      context.shadowBlur = 8;
      context.lineWidth = 2.3;
      context.beginPath();
      for (let index = 0; index < visibleSamples; index += 1) {
        const xValue = xMinimum + (xMaximum - xMinimum) * (index / (samples - 1));
        const x = mapX(xValue);
        const y = mapY(evaluatePolynomial(fitResult.coefficients, xValue));
        if (!index) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.restore();
    }

    label(context, "STANDARDIZED RESIDUALS  (y − ŷ) / σ", residual.left, residual.top - 23, colors.text, "left", 9, 650);
    const residualValues = fitResult ? fitResult.standardizedResiduals : [];
    const residualLimit = fitResult
      ? Math.max(3, Math.ceil(Math.max(...residualValues.map((value) => Math.abs(value))) + 0.4))
      : 3;
    const mapResidualY = (value) => lerp(residual.bottom, residual.top, (value + residualLimit) / (2 * residualLimit));
    [-2, 0, 2].forEach((value) => {
      const y = mapResidualY(value);
      context.save();
      context.setLineDash(value ? [4, 5] : []);
      line(context, residual.left, y, residual.right, y, value ? colors.muted : colors.amber, value ? 1 : 1.3, value ? 0.42 : 0.72);
      context.restore();
      label(context, String(value), residual.left - 9, y, colors.muted, "right", 8, 500);
    });
    line(context, residual.left, residual.top, residual.left, residual.bottom, colors.muted, 1, 0.55);
    line(context, residual.left, residual.bottom, residual.right, residual.bottom, colors.muted, 1, 0.55);
    for (let tick = 0; tick <= 5; tick += 1) {
      const value = lerp(xMinimum, xMaximum, tick / 5);
      const x = mapX(value);
      label(context, String(Math.round(value)), x, residual.bottom + 14, colors.muted, "center", 8, 500);
    }
    label(context, "x", (residual.left + residual.right) / 2, residual.bottom + 29, colors.text, "center", 9, 600);
    if (!fitResult) {
      label(context, "Fit a model to reveal its residual pattern", (residual.left + residual.right) / 2, (residual.top + residual.bottom) / 2, colors.muted, "center", 9, 500);
    } else {
      const revealResiduals = clamp((progress - 0.45) / 0.55);
      residualValues.forEach((value, index) => {
        const visible = clamp(revealResiduals * residualValues.length - index + 1);
        if (visible <= 0) return;
        context.save();
        context.globalAlpha = visible;
        dot(context, mapX(data[index].x), mapResidualY(value), 3.2, Math.abs(value) > 2 ? colors.red : colors.green, 3);
        context.restore();
      });
    }
  }

  function stopAnimation() {
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    startTime = 0;
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    progress = clamp((timestamp - startTime) / 1250);
    if (progress > 0.78) showOutputs();
    drawRegression();
    if (progress < 1) frameRequest = requestAnimationFrame(animate);
    else {
      showOutputs();
      stageOutput.textContent = `Complete · weighted ${selectedDegree === 1 ? "linear" : selectedDegree === 2 ? "quadratic" : "cubic"} fit over the measured x-range.`;
      fitButton.textContent = "Refit selected model";
      fitButton.setAttribute("aria-pressed", "false");
      frameRequest = 0;
      startTime = 0;
    }
  }

  function selectDegree(degree) {
    stopAnimation();
    selectedDegree = degree;
    fitResult = null;
    progress = 0;
    modelButtons.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.degree) === selectedDegree)));
    fitButton.textContent = "Fit selected model";
    fitButton.setAttribute("aria-pressed", "false");
    stageOutput.textContent = `${selectedDegree === 1 ? "Linear" : selectedDegree === 2 ? "Quadratic" : "Cubic"} model selected · click fit to estimate its coefficients.`;
    clearOutputs();
    drawRegression();
  }

  modelButtons.forEach((button) => {
    button.addEventListener("click", () => selectDegree(Number(button.dataset.degree)));
  });

  fitButton.addEventListener("click", () => {
    stopAnimation();
    fitResult = weightedPolynomialFit(data, selectedDegree);
    if (!fitResult) {
      stageOutput.textContent = "The selected model could not be solved for this dataset.";
      return;
    }
    clearOutputs();
    progress = reducedMotion.matches ? 1 : 0;
    stageOutput.textContent = "Fitting coefficients with weights of 1/σ², then calculating residuals…";
    fitButton.textContent = "Fitting…";
    fitButton.setAttribute("aria-pressed", "true");
    drawRegression();
    if (reducedMotion.matches) {
      showOutputs();
      stageOutput.textContent = `Complete · weighted ${selectedDegree === 1 ? "linear" : selectedDegree === 2 ? "quadratic" : "cubic"} fit over the measured x-range.`;
      fitButton.textContent = "Refit selected model";
      fitButton.setAttribute("aria-pressed", "false");
    } else {
      frameRequest = requestAnimationFrame(animate);
    }
  });

  newDataButton.addEventListener("click", () => {
    stopAnimation();
    dataIndex += 1;
    data = createNoisyData(dataIndex);
    fitResult = null;
    progress = 0;
    fitButton.textContent = "Fit selected model";
    fitButton.setAttribute("aria-pressed", "false");
    stageOutput.textContent = `Synthetic replicate ${dataIndex + 1} loaded · the uncertainty model is unchanged.`;
    clearOutputs();
    drawRegression();
  });

  const stopObserving = observeCanvas(canvas, drawRegression);
  drawRegression();
  chartStage.dataset.state = "ready";
  fitButton.textContent = "Fit selected model";
  [...modelButtons, fitButton, newDataButton].forEach((button) => { button.disabled = false; });
  return () => {
    cancelAnimationFrame(frameRequest);
    stopObserving();
  };
}
