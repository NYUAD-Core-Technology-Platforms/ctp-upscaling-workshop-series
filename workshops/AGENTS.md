# AGENTS.md, workshops/

Slide-authoring conventions for individual workshops. This extends the rules in the repo-root `AGENTS.md`.

---

## Folder layout per workshop

```
workshops/NN-name/
├── slides.md             # the deck, single source of truth for content
├── package.json          # name: ctp-wsNN-name, depends on slidev-theme-ctp via link:
├── README.md
├── components/           # workshop-specific Vue components (rare; usually empty)
├── public/
│   ├── brand/            # NYUAD logo (mirrored from ctp-templates/shared/brand/)
│   └── img/              # workshop-specific images
├── snippets/             # long code samples that the deck imports with <<<
├── exercises/
│   └── README.md         # hands-on exercises that pair with the deck
└── style.css             # optional, per-deck CSS overrides
```

The scaffold script (`scripts/new-workshop.mjs`) creates all of these for you. Don't reinvent the layout.

---

## Naming

- Workshop folder: `NN-kebab-name`, two-digit zero-padded (`01`, `02`, …).
- Package name in `package.json`: `ctp-wsNN-kebab-name`.
- These must agree, the scaffold script handles it; if you rename manually, update both.

---

## Slide-authoring conventions

### One idea per slide

If a slide is teaching two things, split it. The remedy is almost always more slides, not denser ones. Audience attention is the constraint; whitespace and pacing matter.

### Frontmatter at the top of `slides.md`

```yaml
---
theme: ctp                              # always, pulls in the CTP theme
title: Your Workshop Title              # shows in footer + browser tab
author: Your Name                       # shows in footer
info: |
  One-paragraph description.
  Appears in the presenter view and PDF metadata.
highlighter: shiki
lineNumbers: false
drawings: { persist: false }
transition: fade
mdc: true                               # enables :: slot :: markers
layout: cover                           # first slide is the cover
---
```

The first `---`-delimited block at the top is the deck-wide config. Every subsequent `---` on its own line starts a new slide.

### Speaker notes

Anything inside an HTML comment **at the bottom of a slide** becomes speaker notes, shown in the presenter view, hidden from the audience.

```md
# Slide title

Body content.

<!--
Notes for the presenter. Mention the thing about Q3. Don't forget to breathe.
-->
```

Use these liberally. Your future self (or the next person presenting the deck) will thank you.

### Code samples, keep them in `snippets/`

Long code samples (anything over ~10 lines) live in `snippets/` as their own file. The deck imports them with Slidev's `<<<` syntax:

```md
<<< @/snippets/example.ts
```

> The `<<<` directive must be on its own line, not inside a code fence.

This keeps the snippet file lintable and reusable, and keeps `slides.md` readable.

**Gotcha:** `<<<` works for `.ts`, `.js`, `.vue`, `.yml`, `.py`, etc., anything that's a code file. **It does NOT work cleanly for `.md` files**, Slidev inlines the raw markdown content rather than wrapping it in a code fence, which lets the imported `---` and `::slot::` markers tangle the host slide. For `.md` examples, paste them inline as a literal fenced code block instead:

````md
```md
---
theme: ctp
---

# A slide
```
````

### Images

- Workshop-specific images: `workshops/NN-name/public/img/`. Reference as `/img/foo.png` in slides.
- Brand assets (logo): `public/brand/nyuad-logo.png` is auto-copied by the scaffold script; use `<CtpLogo />` rather than referencing the file directly.
- Don't store images in `slides.md` as base64, they bloat the file.

### Layouts

Pick layouts by name in slide frontmatter. See `ctp-templates/slidev/README.md` for the full reference. Defaults:

- `cover`, title slide
- `section`, full-bleed divider with deep-violet background
- `default`, everyday content with footer
- `two-cols-header`, header + two columns
- `end`, closing thanks/contact

When using `layout: section` or `layout: end`, the **markdown `# Title` produces the heading**, the layout doesn't wrap your title in a heading element. (If you find a layout that does wrap, that's a bug, fix in the theme repo, not here.)

### Components available in every slide

These are auto-imported by Slidev from the theme. Use directly in `.md`:

- `<CtpCallout label="Tip" tone="violet|accent|sand">body</CtpCallout>`, labeled note box.
- `<CtpKbd>K</CtpKbd>`, keyboard key chip.
- `<CtpLogo />`, NYUAD lockup. Pass `white` for dark backgrounds.
- `<AutoFit>…</AutoFit>`, scales a slide body down so it can't overflow the canvas (safety net; see "Fit every slide" below).

Anything else you need that's specific to one deck goes in that deck's `components/` folder.

### Interactive demo components (client-side, no data file)

Some components are pure interaction: they compute and draw live in the browser with no external data. First example: `01-slidev/components/LeastSquaresDemo.vue`, an ordinary-least-squares regression where buttons change the data-generating parameters (true slope, noise sigma, sample size) and the fitted line plus R squared update live.

Conventions that keep these consistent and dependency-free:

- **No charting library.** Draw with inline `<svg>` and reactive `computed` geometry (map data coords to pixels with small `sx()` / `sy()` helpers). This ships nothing extra in the static build, same spirit as the data components.
- **Use theme tokens for everything visual:** `--ctp-color-violet` for the primary line, `--ctp-color-accent` for secondary marks, `--fg1/--fg2/--border/--hairline` for axes and text, the `--s-*` / `--r-*` / `--t-*` scales for spacing, radius, and type. No hard-coded hex.
- **Buttons follow the `EquipmentList` pattern:** `@click.stop` handlers (so clicks don't advance the slide), violet fill, `--r-2` radius.
- **Seeded RNG for reproducibility.** Use a small deterministic generator (Mulberry32) keyed off a `seed` ref so changing one parameter isolates that parameter's effect on the result; a "Resample" button bumps the seed for a fresh draw. Keep the math (the fit, the statistic) in plain JS computed properties so it is easy to read and verify.

---

## Fit every slide to the canvas (no overlap), MANDATORY

A Slidev slide is a **fixed canvas (about 980 x 552 px, 16:9)**. Content does NOT reflow to a second page, anything taller than the canvas overlaps the footer or is clipped. Every slide must fit. This has bitten this deck repeatedly; treat it as a hard requirement, not a nicety.

### Budget per slide

After the title (~90px) and footer (~40px), the body has **roughly 400px of height** (about 10-12 lines of text, or a ~330px-tall figure plus a line or two). Design to that. The fix for "too much" is almost always **another slide**, not smaller text.

### Rules

1. **One idea per slide** (restated here because it is the root cause of overflow). Split before you shrink.
2. **Any custom component must cap its own height.** Give charts/SVGs a fixed pixel height (e.g. `height: 300px`), not `height: auto` inside a flexible column, where they scale to the column width and blow past the canvas. Long lists must **paginate** (see `EquipmentList.vue`: fixed rows + Prev/Next) rather than render all rows.
3. **Keep intros to 1-2 lines** when a slide also holds a component, callout, or code block. Move the rich explanation into speaker notes (`<!-- ... -->`).
4. **Two stacked blocks max** below a heading (e.g. a component + a callout often overflows; pick one, push the other to notes).
5. When content is genuinely variable or borderline, wrap the body in **`<AutoFit>…</AutoFit>`** (theme component) as a safety net, it scales the body down to fit. Don't use it to justify cramming; a 0.6x slide is unreadable from the back of the room.

### Verify before declaring done

Overflow is invisible in the Markdown, you must look at the rendered slide. For any slide with a component, code block, long list, or more than a few lines of body:

- Run `pnpm --filter ./workshops/NN-name dev`, open the slide, and confirm nothing touches or crosses the footer, at the deck's normal zoom.
- If editing in an environment without a live browser, build and screenshot: `pnpm --filter ./workshops/NN-name export --format png --output /tmp/ws` (or `slidev export`), then open the PNG for that slide and check it visually.
- Re-check after content changes (a longer equipment list, a new bullet) can push a previously-fine slide over.

Do not consider a slide finished until you have seen it render within the canvas.

---

## Per-deck CSS overrides

If a guest speaker wants their session to read slightly differently, add a `workshops/NN-name/style.css`. Slidev auto-loads it. Override CSS variables, not full rules:

```css
:root {
  --ctp-color-accent: #4DB6AC;
}
```

Don't redefine layouts or components here, those edits belong in the theme. Per-deck CSS is for **single-variable swaps**.

---

## Exercises

`exercises/README.md` is where hands-on exercises that pair with the deck live. The scaffold script creates a placeholder. Format:

```md
## Exercise 1, title (~5 min)

1. Step one.
2. Step two.

**Stretch:** optional extension.
```

Three short exercises (~5–10 min each) is the sweet spot for an hour-long workshop.

---

## Dark backgrounds, color contrast

The theme's `section` and `end` layouts use a deep-violet background. The theme rebinds `--fg1`, `--fg2`, `--hairline` etc. locally so all child elements inherit light colors automatically. **Don't put dark-text content on these layouts**, if a paragraph or list shows up near-black on violet, the markdown is fine; the bug is in the theme's token-binding for that layout. Report it.

When designing a new layout with a dark background (in the theme repo), follow the same pattern: rebind tokens on the layout container rather than hard-coding `color` on individual elements. See `ctp-templates/AGENTS.md` for the specifics.

---

## Pulling live data into a slide (build-time bake)

When a slide needs real data from an external system (e.g. the **Booked** reservation system for CTP lab equipment), fetch it at **build time** and bake it into a committed JSON file. Never fetch from the browser at runtime: that leaks API credentials into the published static site and hits CORS.

Pattern, first used in `01-slidev`:

```
workshops/NN-name/
├── scripts/fetch-<thing>.mjs   # Node script: calls the API, writes the JSON
├── <thing>.json                # generated data, COMMITTED (names are not secret)
├── components/<Thing>List.vue  # imports the JSON, renders it (no network at runtime)
└── .env.example                # documents the required env vars
```

Wire-up:

- Add an npm script: `"data": "node scripts/fetch-<thing>.mjs"`.
- The component imports the JSON directly (`import data from '../<thing>.json'`), Vite parses it. Pure display, so the built site carries no secret.
- Credentials come from env vars loaded from `.env` (already gitignored at repo root). Commit only `.env.example`.

**Booked specifics** (the equipment example): it's a Booked Scheduler instance. Auth is a pre-issued ID + key sent as headers `X-Booked-UserId` and `X-Booked-SessionToken` on `GET {BOOKED_API_URL}/Resources/`; the response is `{ resources: [{ name, ... }] }`. (Alternative: POST username/password to `/Authentication/Authenticate` for a session token.)

**VPN gotcha:** Booked (`corelabs.abudhabi.nyu.edu`) is behind the **NYU VPN**, so GitHub-*hosted* runners cannot reach it. Two ways to refresh the data:

1. Run `npm run data` locally while on the VPN, then commit the refreshed JSON.
2. Run it on a **self-hosted runner on the NYU network**. This repo does exactly that: `.github/workflows/refresh-equipment.yml` runs `npm run data` on `runs-on: [MEG Workstation]` (a Windows runner, `shell: pwsh`), reading `BOOKED_API_ID` / `BOOKED_API_KEY` from org-level secrets, and commits `equipment.json` if the list changed. The commit to `main` then triggers `deploy-pages.yml` to republish. (The same runner powers the lab's `neurowaves-lab-documentation/.github/workflows/sync-gcal.yml`.)

Either way the fetch script must **fail soft** (leave the existing JSON untouched) so a build never breaks when the API is unreachable or the token expired. Keep a sensible sample in the committed JSON as the fallback.

**Booked API specifics (confirmed working):** the Web Services root is the host plus `/Services` (this Booked version uses clean URLs, no `index.php`, it tells you so if you get it wrong). Auth is **API-key**: send headers `X-Booked-ApiId` and `X-Booked-ApiKey` on every request (NOT `X-Booked-UserId`/`SessionToken`, those are for the username/password session flow and 401 here). The Id/Key are the lab's `BOOKED_API_ID` / `BOOKED_API_KEY`, found in Booked under Profile > API Access. The full equipment catalog is `GET /Services/Resources/` -> `{ resources: [{ name, ... }] }`. The lab also exposes an **ICS feed** (`/export/ical-subscribe.php?...&icskey=...`) used by `sync-gcal.py`, but that only surfaces resources that currently have bookings, so it's a fallback, not the catalog.

---

## Build / preview gotchas

### `dist/index.html` looks blank when opened directly

Slidev's static build uses absolute asset paths. Opening `dist/index.html` from `file:///` 404s every asset and renders nothing. Fixes:

- `npx serve workshops/NN-name/dist` and open the URL it prints.
- Or rebuild with `pnpm --filter ./workshops/NN-name build -- --base ./` for a `dist/` that works opened directly.

### Don't put block tags in a component's comments

In a custom Vue component, never write the literal `<script>`, `</script>`, `<template>`, or `<style>` inside a comment or string. Slidev counts those tags to locate the script block and inject its `$slidev` context; a stray one in a comment causes a double injection and the dev server crashes with `Identifier '$slidev' has already been declared`. Write "script-setup" (no angle brackets) in prose. Also avoid passing a top-level ref through a template handler, template refs auto-unwrap to plain values, so the handler mutates a number and nothing happens; mutate the ref from a script-scope function and use `@click.stop` on interactive buttons.

### Stop the dev server before exporting

`pnpm export` and `pnpm build` start headless Slidev runs; running them while `pnpm dev` is holding port 3030 can fail or interfere. Stop the dev server first (Ctrl-C), then export/build.

---

## Test checklist before committing a deck change

- Run `pnpm --filter ./workshops/NN-name dev` and click through every slide.
- Open `/presenter` in a second tab and confirm speaker notes show up where you expect.
- Toggle dark mode (`d` key) and confirm nothing breaks.
- If you added `<<<` snippet imports, make sure each renders as a code block (not as inlined content tangling the slide).
- If you touched a `section` or `end` layout slide, check contrast, title should be visible on the violet background.

---

## When in doubt

- Theme behavior (layouts, components, colors): see `ctp-templates/AGENTS.md` and `ctp-templates/slidev/README.md`.
- Design rules (no emoji, no colored left-border accents, gold reserved): see `ctp-templates/shared/brand/DESIGN_SYSTEM.md`.
- Build / export / publish: see the root [`README.md`](../README.md) and [`AGENTS.md`](../AGENTS.md).
- A specific gotcha you hit: check this file first, then the root AGENTS.md, then `ctp-templates/AGENTS.md`.

If something bites you that's not documented anywhere, **add it to the right AGENTS.md**, that's how future agents (and future-you) avoid hitting it again.
