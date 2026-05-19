# Contributing

A short guide for adding to the workshop series.

## Editorial conventions

- **One slide, one idea.** If a slide is doing two things, split it.
- **Code samples should be runnable.** Put long examples in `snippets/` and import them with Slidev's `<<< @/snippets/file.ts` syntax so they stay copy-pasteable and lintable.
- **Speaker notes go in HTML comments** at the bottom of a slide, after the content:
  ```md
  ---

  # My slide

  Body content.

  <!--
  Speaker notes here. The audience won't see this; the presenter will.
  -->
  ```
- **Images** live in the deck's `public/img/` folder and are referenced as `/img/file.png`. Shared brand assets live in `/shared/brand/`.
- **Don't hard-code colors** — use the CSS variables defined in the theme's `styles/tokens.css` (over in `ctp-templates/slidev/styles/tokens.css` — `--ctp-color-accent`, etc.). That's how re-skinning works.

## Repo conventions

- Workshops are numbered `NN-kebab-name`, two-digit prefix, zero-padded.
- Commit messages: short imperative present-tense, e.g. `add export-to-pdf section to ws01`.
- One PR per workshop change; template changes that affect multiple workshops should call that out in the PR description.

## Local development

```bash
pnpm install                                       # once
pnpm --filter ./workshops/01-slidev dev            # run a deck
pnpm --filter ./workshops/01-slidev build          # static build
pnpm --filter ./workshops/01-slidev export         # PDF export
```

## When to touch the theme vs. this repo

The Slidev theme lives in the **sibling `ctp-templates` repo** — not here. Decide where a change belongs:

- Brand changes (colors, fonts, logo): edit `ctp-templates/slidev/styles/tokens.css`, `ctp-templates/slidev/components/`, or the brand assets under `ctp-templates/shared/brand/`.
- New layout used by multiple workshops: add it to `ctp-templates/slidev/layouts/`.
- Workshop-specific tweaks: keep them in `workshops/NN-.../components/` or a local `style.css` in the workshop folder. Do **not** push workshop-specific things into the theme.

Theme changes in `ctp-templates` propagate to every workshop via the `link:` dependency — no install step required.
