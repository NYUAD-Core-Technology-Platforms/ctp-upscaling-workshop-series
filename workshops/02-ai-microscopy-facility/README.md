# Workshop 02, From Ideas to Apps: AI in the Microscopy Facility

Presented by Rachid Rezgui (Light Microscopy, CTP) on 8 October 2026. A case
study in turning core-facility knowledge into operational systems (CoreOps),
scientific simulations and teaching tools, with nine live simulators built
with AI assistance.

Live: https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/02-ai-microscopy-facility/

## Run locally

```bash
pnpm --filter ./workshops/02-ai-microscopy-facility dev
```

## Build / export

```bash
pnpm --filter ./workshops/02-ai-microscopy-facility build         # static site -> dist/
pnpm --filter ./workshops/02-ai-microscopy-facility export        # PDF
pnpm --filter ./workshops/02-ai-microscopy-facility export:pptx   # PowerPoint
```

The simulators need a browser; the PDF and PPTX exports show a still of each.

## Structure

- `slides.md`, the deck (edit this). Speaker notes are the HTML comments at
  the end of each slide and show up in presenter view (`/presenter`).
- `components/`, one Vue component per interactive slide:
  - `GaussianBeamDemo`, `LensObjectiveDemo`, `AlignmentDemo` (optics)
  - `ConfocalPixelDemo`, `RasterScanDemo`, `PsfDemo`, `CellCounterDemo`,
    `ObjectAnalysisDemo`, `RegressionFitDemo` (imaging and analysis)
  - `ScanHeadFrame` (iframe around the 3D scan-head page), `NeuroLoop`
    (hover diagram), `EvidenceFigure` (screenshot with lightbox)
- `lib/optics.js`, `lib/imaging.js`, the simulation and canvas-drawing code,
  one exported `initX(root)` per demo, each returning a `destroy()`.
  `lib/useDemo.js` is the mount/unmount glue the components share.
- `public/img/`, CoreOps screenshots. Personal names, avatars and document
  links are pixelated; do not replace them with unblurred originals, the site
  is public.
- `public/scan-head/`, the standalone three.js scan-head model (`index.html`
  plus a local copy of `three.module.js`, MIT).
- `public/brand/`, NYUAD lockup (mirrored from `ctp-templates/shared/brand/`).
- `style.css`, deck-local tokens and the shared `.demo-*` / `.evidence-*`
  classes the components use.
- `exercises/`, hands-on exercises that pair with the deck.

## Origin

Ported from a standalone single-file HTML deck (custom CSS, canvas and SVG
simulators) into the CTP Slidev theme. The physics and analysis code is the
original code, converted to ES modules that query their controls inside their
own root element so several demos can be mounted at once.

See `ctp-templates/slidev/README.md` (sibling repo) for the theme reference.
