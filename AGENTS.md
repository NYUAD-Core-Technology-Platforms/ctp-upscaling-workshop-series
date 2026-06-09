# AGENTS.md

Guidance for AI coding agents working in this repo. Read this first when you start a task here — it captures conventions, file boundaries, gotchas, and cross-repo wiring that aren't obvious from the file tree alone.

Repo URL: `github.com/NYUAD-Core-Technology-Platforms/ctp-upscaling-workshop-series`.

---

## What this repo is

The home of the **CTP Upscaling Workshop Series** at NYU Abu Dhabi. Each workshop is a Slidev deck under `workshops/NN-name/`. The deck content lives here; the visual identity does not — it lives in the **sibling repo** [`ctp-templates`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates) as the `slidev-theme-ctp` package.

This is a **pnpm workspace**. Each workshop is its own package with its own `package.json`. The root `pnpm-workspace.yaml` declares `workshops/*` as workspace packages. There is no top-level `template/` folder — that was moved out in the May 2026 split.

---

## Cross-repo wiring (the most important thing to understand)

Each workshop's `package.json` depends on the Slidev theme via:

```json
"slidev-theme-ctp": "file:../../../ctp-templates/slidev"
```

`link:` is a pnpm protocol that creates a **symlink** rather than copying files. The two repos must be checked out as **siblings** under the same parent folder on disk. The expected layout:

```
<parent>/
├── ctp-templates/                      # theme + brand source
└── ctp-upscaling-workshop-series/      # this repo
```

**Consequences:**

- Edit anything in `ctp-templates/slidev/` (layouts, components, CSS tokens) — every workshop dev server picks it up on the next reload. No reinstall.
- If `ctp-templates` is missing or in the wrong place, `pnpm install` will fail or leave broken symlinks.
- When you make a breaking change in the theme (rename a layout, remove a component slot), every workshop here breaks too. Coordinate.

The scaffold script (`scripts/new-workshop.mjs`) **aborts early** if it can't find `ctp-templates` as a sibling. Don't remove that check.

---

## File layout

```
.
├── AGENTS.md                # this file
├── README.md                # human-facing entry point
├── CONTRIBUTING.md          # editorial conventions
├── package.json             # pnpm workspace root + shortcut scripts
├── pnpm-workspace.yaml      # lists "workshops/*"
├── scripts/
│   └── new-workshop.mjs     # scaffold script — creates a new workshop folder
└── workshops/
    ├── AGENTS.md            # slide-authoring conventions (read this if editing a deck)
    └── NN-name/             # one folder per workshop
        ├── slides.md
        ├── package.json
        ├── README.md
        ├── components/
        ├── public/
        ├── snippets/
        └── exercises/
```

`workshops/NN-name/` is the convention. `NN` is two-digit zero-padded (`01`, `02`, …). `name` is kebab-case, lowercase.

---

## Hard rules

These are non-negotiable unless you have a strong reason and the user has agreed:

1. **Never edit anything in `ctp-templates` from this repo.** That's a separate repo with its own history. If a theme change is needed, make it there and commit it there.
2. **Don't duplicate brand assets.** Logos, colors, and fonts come from `ctp-templates/shared/brand/` and `ctp-templates/slidev/styles/tokens.css`. The scaffold script copies the logo into each workshop's `public/brand/` — that's the only place brand assets are mirrored, and the mirror is intentional (Slidev needs them in the deck's `public/` to serve at `/brand/*`).
3. **Don't add workshop-specific styling to the theme.** Per-deck overrides go in `workshops/NN-name/style.css` (a local file Slidev auto-loads). Theme-level changes go in `ctp-templates`.
4. **Don't commit `node_modules/`, `dist/`, `slides-export.pdf`, or any build artifacts.** The `.gitignore` already covers these — if you find yourself adding one, ask why.
5. **Don't break the `workshops/NN-name/` naming convention.** The scaffold script and shortcut aliases (`dev:01`, etc.) depend on it.
6. **Workshop folders use `file:` to the theme, never `workspace:*` or `link:`.** The theme isn't in this repo's workspace anymore (so `workspace:*` won't resolve), and `link:` is a pnpm-only protocol that npm rejects with `EUNSUPPORTEDPROTOCOL`. `file:` symlinks correctly under both tools. If you see `workspace:*` or `link:` in a workshop's `package.json`, it's stale; replace with `file:../../../ctp-templates/slidev`.
7. **No em dashes (`—`, U+2014) in any generated content.** Slides, READMEs, code comments, commit messages, scaffolded `package.json` descriptions — all of it. Use a period, comma, semicolon, parentheses, or a regular hyphen (`-`) instead. Em dashes are one of the strongest LLM-generated-text tells; their presence makes institutional copy read as AI output. Quoting source material that contains them is fine; producing new text with them is not.

---

## Commands you'll use

| Command | What it does |
|---------|--------------|
| `pnpm install` | Reads every workshop's `package.json`, downloads dependencies, creates the `link:` symlink to `../ctp-templates/slidev`. Run after cloning, after pulling new changes, after adding a workshop. |
| `pnpm new-workshop <slug>` | Runs `scripts/new-workshop.mjs <slug>`. Picks the next workshop number and creates `workshops/NN-<slug>/`. Aborts if `ctp-templates` isn't a sibling. |
| `pnpm --filter ./workshops/NN-name dev` | Starts Slidev dev server at `http://localhost:3030` for that workshop. Hot-reloads. |
| `pnpm --filter ./workshops/NN-name build` | Produces a static site in `workshops/NN-name/dist/`. |
| `pnpm --filter ./workshops/NN-name build -- --base ./` | Same, but with relative asset paths — needed if the user wants to open `dist/index.html` directly (see "Gotchas" below). |
| `pnpm --filter ./workshops/NN-name export` | Produces a PDF `workshops/NN-name/slides-export.pdf`. Needs `playwright-chromium` installed once: `pnpm --filter ./workshops/NN-name add -D playwright-chromium`. |
| `pnpm dev:01` / `build:01` / `export:01` | Shortcuts for the above, defined in the root `package.json`. Only exists for workshop 01 right now. |

`--filter ./workshops/NN-name` means "run this command in that one package only". Without it, pnpm would try to run the command in every workspace package at once (almost never what you want).

`--` separates pnpm's flags from flags passed through to the underlying script. `pnpm ... build -- --base ./` passes `--base ./` to `slidev build`.

---

## Gotchas (these have bitten us — don't repeat them)

### Build outputs look blank when opened directly

`pnpm build` produces `dist/index.html` with **absolute** asset paths (`/_assets/foo.js`). When opened via `file:///` or hosted at a non-root URL, every asset 404s and the page renders blank. Fixes:

- **Preview locally:** `npx serve workshops/NN-name/dist` — prints a URL, open that.
- **Build with relative paths:** add `-- --base ./` to the build command.
- **Build for a specific path:** add `-- --base /subdir/` (e.g. `--base /ctp-upscaling-workshop-series/01/` for GitHub Pages).

### npm doesn't understand `workspace:*` or `link:` to a sibling repo

If a user runs `npm install` instead of `pnpm install`, they'll see `EUNSUPPORTEDPROTOCOL` errors. Direct them to use `pnpm`. The repo is set up around pnpm; mixing in npm leaves a broken `package-lock.json` next to the right `pnpm-lock.yaml`.

### Windows symlink permission errors

pnpm's `link:` and workspace symlinks require Developer Mode (Settings → Privacy & Security → For Developers) or running the terminal as administrator. Errors look like `EPERM: operation not permitted, symlink`. Tell users about this — there's no workaround in our config.

### Slidev `<<< @/path` imports break for `.md` files

The snippet-import syntax works for `.ts`, `.js`, `.vue`, `.yml` (wraps them in a fenced code block) but inlines the raw content of `.md` files, leaking their `---` and `::slot::` markers into the host slide and breaking the MDC/Shiki pipeline. **For markdown examples, inline them as literal code blocks instead.** This is documented in `workshops/AGENTS.md` too.

### Stale `pnpm-lock.yaml` after structural changes

When the workspace structure changes (theme moved out, packages added/removed), the lockfile can have stale entries like `link:../../template` that no longer match reality. Symptom: `pnpm install` complains or installs partially. Fix: delete `pnpm-lock.yaml` and re-run `pnpm install`. The lockfile regenerates.

### `pnpm-lock.yaml` may show `workspace:*` from old commits

If you grep the repo and find `workspace:*` in the lockfile but the current workshop `package.json` files all say `link:...`, the lockfile is stale. Don't "fix" the `package.json` to match the lockfile — the `package.json` is correct, the lockfile needs regenerating.

### Theme-level gotchas live in the theme repo's AGENTS.md

If a Slidev / theme-internals question comes up (nested h1, dark-mode token rebinding, `@slidev/types` in setup files), see `ctp-templates/AGENTS.md`. Don't duplicate that content here — link to it.

---

## Coordinating with `ctp-templates`

When a change touches both repos (e.g. adding a new layout that workshop 01 will use):

1. Make the theme change in `ctp-templates`. Commit there.
2. Use the new layout / component / token in the workshop here. Commit here.
3. Mention both commits in PR descriptions so reviewers can follow the chain.

The theme is at v0.x with no stable API yet. Breaking changes happen — when you make one, grep both repos for usages before merging.

---

## When you're done with a task

- Run `pnpm install` if you added/removed packages or workshops.
- Run `pnpm --filter ./workshops/01-slidev dev` and click through the deck — does it still render? Did anything regress visually?
- If you touched the scaffold script, smoke-test it: `pnpm new-workshop smoke-test`, verify the generated `package.json` has the right `link:` path, clean up with `rm -rf workshops/NN-smoke-test`.
- Update `README.md` if you changed user-facing behavior (commands, structure, gotchas).
- Update this `AGENTS.md` if you discovered a new gotcha or rule worth remembering.
- Don't commit on the user's behalf unless they explicitly asked.

---

## Reference docs

- [`README.md`](README.md) — human-facing entry point. Walkthroughs, command reference, deploy.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — editorial conventions, "where does this change belong" decisions.
- [`workshops/AGENTS.md`](workshops/AGENTS.md) — slide-authoring conventions, frontmatter, layouts, snippets.
- [`scripts/new-workshop.mjs`](scripts/new-workshop.mjs) — read this if you need to change how workshops are scaffolded.
- **In the sibling repo:**
  - [`ctp-templates/AGENTS.md`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates/blob/main/AGENTS.md) — theme-level rules, design system, Slidev gotchas.
  - [`ctp-templates/shared/brand/DESIGN_SYSTEM.md`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates/blob/main/shared/brand/DESIGN_SYSTEM.md) — palette, type, voice, do/avoid.
