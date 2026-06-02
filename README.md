# CTP Upscaling Workshop Series

A repository holding the **Core Technology Platforms (CTP) at NYU Abu Dhabi** upscaling workshop series. One folder per workshop. Every workshop is a Slidev presentation that uses the shared CTP theme from the sibling [`ctp-templates`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates) repository.

---

## Table of contents

- [What's in this repo](#whats-in-this-repo)
- [Prerequisites — set up your machine](#prerequisites--set-up-your-machine) — one-time, do this first
- [First time you clone this repo](#first-time-you-clone-this-repo) — install dependencies
- [Run a workshop locally](#run-a-workshop-locally)
- [Start a new workshop](#start-a-new-workshop) — one command, all set
- [What you can use in your slides](#what-you-can-use-in-your-slides) — layouts, components, frontmatter
- [Export to PDF or static site](#export-to-pdf-or-static-site)
- [How theme changes propagate](#how-theme-changes-propagate) — the link: mechanism explained
- [Workshops index](#workshops-index)
- [Command reference](#command-reference) — every command, what it does
- [For AI agents](#for-ai-agents) — `AGENTS.md` files and what's in them

---

## What's in this repo

```
.
├── workshops/
│   └── 01-slidev/            # Workshop 01 — "AI-Assisted Presentations with Slidev"
├── scripts/
│   └── new-workshop.mjs      # Scaffolds a new minimal workshop folder
├── pnpm-workspace.yaml
├── package.json
├── CONTRIBUTING.md
└── README.md
```

The look-and-feel (layouts, components, fonts, colors) is **not in this repo** — it lives in the sibling [`ctp-templates`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates) repository, specifically the `slidev/` folder there. Each workshop's `package.json` declares a `link:` dependency on that folder, which means pnpm creates a symlink and the theme is loaded from disk. No publish step required.

---

## Prerequisites — set up your machine

You need three things installed once (skip whichever you already have):

**1. Node.js 18 or newer.** Get it from [nodejs.org](https://nodejs.org/) or use a version manager like `fnm` / `nvm`. Verify with:

```bash
node --version
```

> Prints something like `v20.10.0`. If you see "command not found", Node isn't installed (or isn't on your PATH).

**2. pnpm 9 or newer.** After Node is installed:

```bash
npm install -g pnpm
```

> `npm` is the package manager that ships with Node. `install -g` means "install globally" (available everywhere on your machine, not just in one project). After this, the `pnpm` command works in any terminal. Verify with `pnpm --version`.

**3. git.** Verify with `git --version`. On Windows, [git-scm.com](https://git-scm.com/) provides the installer.

You also need the **sibling `ctp-templates` repo** checked out next to this one. The two repositories must share a parent folder on disk:

```
<some-parent-folder>/                      # e.g. C:\Users\hz3752 on Windows
├── ctp-templates/                          # the shared theme + brand
└── ctp-upscaling-workshop-series/          # this repo
```

If you don't have `ctp-templates` yet:

```bash
cd <the-parent-folder>
```

> Move your terminal into the folder that already contains `ctp-upscaling-workshop-series`. We're going to put `ctp-templates` next to it.

```bash
git clone https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates.git
```

> Downloads the `ctp-templates` repository from GitHub into a folder named `ctp-templates/`. After this completes, `ls` should show both repos side by side.

```bash
cd ctp-templates
pnpm install
cd ..
```

> Move into the new folder, install its dependencies (pnpm reads `package.json` and downloads everything listed there), then go back up.

---

## First time you clone this repo

After cloning **and confirming `ctp-templates` is a sibling** (see Prerequisites), install dependencies:

```bash
cd ctp-upscaling-workshop-series
pnpm install
```

> `cd` moves into the repo. `pnpm install` reads each workshop's `package.json`, sees the line `"slidev-theme-ctp": "link:../../../ctp-templates/slidev"`, and creates a symlink under `node_modules/` pointing back to the theme folder in the sibling repo. It also downloads Slidev itself and every other dependency. First run takes 1–2 minutes; subsequent runs are seconds.

When it finishes, every workshop is wired up and ready to run.

> **Windows note:** pnpm uses symlinks. On Windows, symlinks need either **Developer Mode** turned on (Settings → Privacy & security → For developers → "Developer Mode") or the terminal running as administrator. If you see `EPERM: operation not permitted, symlink` errors, this is why.

---

## Run a workshop locally

```bash
pnpm --filter ./workshops/01-slidev dev
```

> Breaks down as: `pnpm` (the package manager) `--filter ./workshops/01-slidev` (only do this for the package in that folder) `dev` (run the script named "dev" defined in that package's `package.json`). The "dev" script is `slidev --open`, which starts a local web server and opens your browser to it. This is the **authoring mode** — edits to `slides.md` and components hot-reload in the browser as you save. The server stays running until you press `Ctrl-C`.

After a few seconds Slidev prints:

```
  Slidev v0.49.x

  ➜  Local:   http://localhost:3030/
```

Open that URL. For the **presenter view** (speaker notes, next-slide preview, timer): open `http://localhost:3030/presenter` in a second browser tab.

There's a shorter form for workshop 01 specifically:

```bash
pnpm dev:01
```

> Same as `pnpm --filter ./workshops/01-slidev dev`. The shortcut is defined in the root `package.json` under `scripts`. If you add more workshops and want shortcuts for them, add `dev:02`, `dev:03`, etc. entries there.

---

## Start a new workshop

```bash
pnpm new-workshop git-basics
```

> Runs `node scripts/new-workshop.mjs git-basics`. The script picks the next workshop number (looks at existing folder names in `workshops/`, finds the highest, adds one), creates a folder `workshops/NN-git-basics/`, generates a minimal `slides.md`, generates a `package.json` already wired to the sibling theme, and copies the NYUAD logo from `ctp-templates`. Replace `git-basics` with whatever topic name you want — it has to be lowercase letters, digits, and hyphens.

What the script does step by step:

1. Scans `workshops/` to find the highest existing number, then picks the next one (`02`, `03`, …).
2. Creates `workshops/NN-<slug>/` with:
   - `package.json` already pointing at the sibling theme via `link:`.
   - A minimal `slides.md` — cover + outline + one section + end. Replace with your content.
   - `public/brand/nyuad-logo.png` copied from `ctp-templates/shared/brand/` so `<CtpLogo />` resolves.
   - `snippets/`, `components/`, `public/img/`, `exercises/` scaffolded with placeholders.
   - A short `README.md` for the workshop.
3. Prints the next two commands to run.

The script **aborts early** if `ctp-templates` isn't checked out as a sibling — that's a safety net so you don't end up with a workshop that has a broken `link:` pointer.

After scaffolding:

```bash
pnpm install
```

> Re-runs the install step. You need this because there's now a new package (the new workshop) that pnpm hasn't seen yet. It registers the new folder in the workspace and creates its `node_modules/` symlinks.

```bash
pnpm --filter ./workshops/02-git-basics dev
```

> Same dev-server command as before, but pointed at your new workshop. Open `http://localhost:3030` and you'll see the starter slides.

Then open `workshops/02-git-basics/slides.md` in your editor and start writing.

---

## What you can use in your slides

`slides.md` is the entire deck. The top of the file is YAML "frontmatter" — settings for the whole deck:

```yaml
---
theme: ctp                              # always — pulls in the CTP look
title: Your Workshop Title              # shows in the browser tab + footer
author: Your Name                       # shows in the footer
info: |
  One-paragraph description.
  Appears in the presenter view and PDF metadata.
highlighter: shiki                      # how code blocks are syntax-highlighted
lineNumbers: false                      # turn line numbers in code blocks on/off
drawings: { persist: false }            # drawings reset between sessions
transition: fade                        # slide-to-slide animation
mdc: true                               # enable :: slot :: markers
layout: cover                           # the first slide is the cover
---
```

Slides are separated by `---` on a line by itself. Each slide can have its own frontmatter to override the layout:

```md
---
layout: section
---

::number::
PART 01

# Section title here
```

### Available layouts

| Name | Use it for | Slot names |
|------|-----------|------------|
| `cover` | Title slide | `eyebrow`, `meta` |
| `section` | Full-bleed divider between major parts | `number`, `subtitle` |
| `default` | Everyday content slide | — |
| `two-cols-header` | Header + two columns underneath | `left`, `right` |
| `end` | Closing thanks/contact slide | `meta` |

### Available components (use them directly in `.md`)

- `<CtpCallout label="Tip" tone="violet|accent|sand">body</CtpCallout>` — labeled note box.
- `<CtpKbd>K</CtpKbd>` — keyboard key chip.
- `<CtpLogo />` — NYUAD lockup (pass `white` for dark backgrounds).

For the full reference (every layout slot, every component prop, every CSS variable you can override), see [`ctp-templates/slidev/README.md`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates/blob/main/slidev/README.md). Workshop 01's `slides.md` is also a worked example using all of them.

---

## Export to PDF or static site

From the repo root:

```bash
pnpm --filter ./workshops/01-slidev build
```

> Runs the `build` script in workshop 01's `package.json`, which is `slidev build`. Takes your deck and produces a self-contained **static website** in `workshops/01-slidev/dist/`. The `dist/` folder contains HTML, CSS, JS, fonts, and images — everything needed to serve the deck from any web host (Netlify, GitHub Pages, S3, a corporate NGINX). The folder is self-contained: no Slidev or Node.js needed at the host end.

> **Gotcha — `dist/index.html` looks blank if you open it directly.** Slidev's default build assumes the site lives at the root of a domain (`/`), so it writes asset paths as absolute (`/_assets/...`). When you open `index.html` from `file:///` on your computer, the browser can't resolve those paths and renders nothing. Two workarounds:
> - **Preview locally with a web server:** `npx serve workshops/01-slidev/dist`. It prints a URL like `http://localhost:3000` — open that and the deck loads correctly.
> - **Build with relative paths so the file works opened directly:** `pnpm --filter ./workshops/01-slidev build -- --base ./`. The `-- --base ./` passes the `--base ./` flag through to `slidev build`. With relative paths, `dist/index.html` works when double-clicked or when hosted at a non-root URL.
>
> When deploying to GitHub Pages, the `snippets/deploy.yml` workflow already passes the right `--base` for you.

```bash
pnpm --filter ./workshops/01-slidev export
```

> Runs `slidev export`. Produces a single file `workshops/01-slidev/slides-export.pdf` with one slide per page. Use it for email follow-ups or any "give me one file" request.

PDF export needs a headless Chromium browser installed first. One-time setup:

```bash
pnpm --filter ./workshops/01-slidev add -D playwright-chromium
```

> `add -D` installs a package as a devDependency. `playwright-chromium` is a stripped-down Chromium browser that Slidev drives behind the scenes to render each slide and capture it as a PDF page. After this finishes (it's a ~150 MB download), `pnpm export:01` works without further setup.

Three modes summary:

| Command | Output | Use when |
|---------|--------|----------|
| `... dev` | A live web server at `http://localhost:3030` | Authoring. Hot-reloads on save. |
| `... build` | A folder `dist/` you upload to a web host | Publishing the deck as a website. |
| `... export` | A single PDF | Emailing or attaching one file. |

There are also shorthand aliases in the root `package.json` for workshop 01: `pnpm dev:01`, `pnpm build:01`, `pnpm export:01`. Same commands, less typing.

---

## How theme changes propagate

Each workshop's `package.json` lists the theme as:

```json
"slidev-theme-ctp": "link:../../../ctp-templates/slidev"
```

`link:` is a pnpm protocol that creates a **symlink** from `node_modules/slidev-theme-ctp` to the actual folder `ctp-templates/slidev/`. The consequences:

- Edit anything inside `ctp-templates/slidev/` (a layout, a component, `tokens.css`), save it, and **every workshop dev server picks it up on the next reload**. No reinstall step.
- The link is local-only — pnpm doesn't copy files, it points at them.

This is what you want during active design: one brand, propagated everywhere.

### Freezing a workshop you've delivered

If you've already given workshop 01 and don't want a future theme change to alter what attendees saw:

- **The PDF / static build you shipped is already frozen.** `slidev export` captures the theme state at the moment you built it. Re-running it would pick up theme changes; the previously generated file does not.
- **Tag the commit.** Run `git tag ws01-delivered-2026-05-12` in both repos. To rebuild later: `git checkout ws01-delivered-2026-05-12 && pnpm install && pnpm --filter ./workshops/01-slidev build`.
- **Pin the theme version** (heavier). Once the theme is published to a registry, replace `link:...` with `"slidev-theme-ctp": "0.1.0"` (or whatever version you shipped on). Different workshops can then track different theme versions independently.

---

## Workshops index

| # | Title | Status |
|---|-------|--------|
| 01 | AI-Assisted Presentations with Slidev: From Prompt to Polished Deck | Draft |

When you add a new workshop, add it to this table.

---

## Command reference

Every command this repo uses, in one place. Run them from the repo root unless noted otherwise.

| Command | What it does |
|---------|--------------|
| `pnpm install` | Reads every `package.json` in the workspace, downloads dependencies, creates `node_modules/` and the `link:` symlink to `ctp-templates/slidev`. Run after cloning, after pulling new changes, after adding a workshop. |
| `pnpm new-workshop <slug>` | Scaffolds `workshops/NN-<slug>/` with a minimal Slidev deck. Picks the next number automatically. After running it, run `pnpm install` to register the new package. |
| `pnpm --filter ./workshops/NN-<name> dev` | Starts the Slidev dev server for that workshop at `http://localhost:3030`. Stays running; Ctrl-C to stop. |
| `pnpm --filter ./workshops/NN-<name> build` | Generates a static website in `workshops/NN-<name>/dist/`. Upload that folder to any web host. |
| `pnpm --filter ./workshops/NN-<name> export` | Generates a PDF at `workshops/NN-<name>/slides-export.pdf` (one slide per page). |
| `pnpm --filter ./workshops/NN-<name> add -D <package>` | Installs a Node package as a devDependency of that workshop only (used for `playwright-chromium` to enable PDF export). |
| `pnpm dev:01` | Shortcut for `pnpm --filter ./workshops/01-slidev dev`. Defined in the root `package.json`. |
| `pnpm build:01` | Shortcut for `pnpm --filter ./workshops/01-slidev build`. |
| `pnpm export:01` | Shortcut for `pnpm --filter ./workshops/01-slidev export`. |
| `git tag <tag-name>` | Marks the current commit with a label. Useful for snapshotting a delivered workshop. |

### The flag explanations

- `--filter ./workshops/NN-<name>` — pnpm only runs the command inside that one folder. Without this flag, pnpm would try to run the command in every workspace package at once.
- `-D` (or `--save-dev`) — install the package as a devDependency rather than a regular dependency. devDependencies aren't installed when someone consumes your package via npm, but they are installed locally — fine for tools used only during development/build.
- `-g` (or `--global`) — install the package globally (available everywhere on your machine, not just in one project). Used during one-time pnpm install (`npm install -g pnpm`).

---

## For AI agents

If you're an AI coding agent (Claude Code, Cursor, etc.) or you're working in this repo with one, read these first:

- [`AGENTS.md`](AGENTS.md) — repo-level rules: cross-repo wiring, the `link:` protocol, hard rules, gotchas (`--base ./`, npm vs pnpm, Windows symlinks), commands, coordination with `ctp-templates`.
- [`workshops/AGENTS.md`](workshops/AGENTS.md) — slide-authoring conventions: frontmatter, layouts, snippets (and the `<<<` import gotcha for `.md` files), speaker notes, dark-background contrast, test checklist.
- In the sibling repo: [`ctp-templates/AGENTS.md`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates/blob/main/AGENTS.md) — theme-level rules, Slidev internals gotchas (`@slidev/types`, nested `<h1>` demotion, scoped CSS slot content), design-system enforcement.

These three files cover everything an agent needs to know to work productively across both repos. Update them when you discover a new gotcha — that's how the institutional memory grows.

---

## License

Internal CTP / NYUAD materials. Ask the maintainers before redistributing.
