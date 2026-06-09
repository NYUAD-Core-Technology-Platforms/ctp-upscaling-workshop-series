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

Anything else you need that's specific to one deck goes in that deck's `components/` folder.

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

## Build / preview gotchas

### `dist/index.html` looks blank when opened directly

Slidev's static build uses absolute asset paths. Opening `dist/index.html` from `file:///` 404s every asset and renders nothing. Fixes:

- `npx serve workshops/NN-name/dist` and open the URL it prints.
- Or rebuild with `pnpm --filter ./workshops/NN-name build -- --base ./` for a `dist/` that works opened directly.

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
