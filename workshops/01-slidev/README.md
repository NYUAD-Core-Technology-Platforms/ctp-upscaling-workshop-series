# Workshop 01 — How to use Slidev

The first session in the CTP Upscaling Workshop Series. This deck **is itself made with Slidev** using the CTP theme — so the workshop and a worked example of the tool it teaches are the same artifact. Open `slides.md` to see how it's authored.

---

## Run it locally

This assumes you've already followed the **Prerequisites** and **First time you clone this repo** sections of the top-level [`README.md`](../../README.md). If not, do those first — you need `ctp-templates` checked out as a sibling and `pnpm install` to have been run from the repo root.

From the workshop-series repo root:

```bash
pnpm dev:01
```

> Shortcut alias defined in the root `package.json`. Same as running `pnpm --filter ./workshops/01-slidev dev`. It starts Slidev's local web server and opens your browser at `http://localhost:3030`. Stays running; press `Ctrl-C` to stop. While running, edits to `slides.md` hot-reload in the browser within a second.

The long form, if you don't want the shortcut:

```bash
pnpm --filter ./workshops/01-slidev dev
```

> Same thing. `--filter ./workshops/01-slidev` tells pnpm "run this command inside that one folder, not the whole workspace". `dev` is the script defined in `workshops/01-slidev/package.json` under the `scripts` block (it's `slidev --open`).

For the **presenter view** (speaker notes, next-slide preview, timer): open `http://localhost:3030/presenter` in a second tab.

---

## What's in this folder

```
workshops/01-slidev/
├── slides.md             # The deck — open this to edit
├── package.json          # depends on slidev-theme-ctp via link:
├── README.md             # this file
├── components/           # workshop-specific Vue components (empty for now)
├── public/
│   ├── brand/            # NYUAD logo (mirrored from ctp-templates/shared/brand/)
│   └── img/              # workshop-specific images
├── snippets/             # code samples that the deck imports with <<<
│   ├── hello.md
│   ├── two-cols.md
│   ├── component.vue
│   └── deploy.yml
└── exercises/
    └── README.md         # Three hands-on exercises that pair with the slides
```

---

## Outline (60 min total)

| Part | Topic | ~ time |
|------|-------|--------|
| 01 | Why Slidev? | 5 min |
| 02 | Install & run locally | 10 min |
| 03 | Authoring in Markdown | 20 min + exercise |
| 04 | Theming with the CTP template | 10 min + exercise |
| 05 | Export & publish | 10 min + exercise |
| 06 | Wrap up & Q&A | 5 min |

Pair the workshop with `exercises/README.md` — three short hands-on exercises that attendees do on their own laptops.

---

## Build & export

These are run from the repo root.

```bash
pnpm build:01
```

> Shortcut for `pnpm --filter ./workshops/01-slidev build`. Runs `slidev build` inside this workshop's folder. The output is a self-contained website in `workshops/01-slidev/dist/` — HTML, CSS, JS, fonts, images, all ready to upload to any web host. **Use this when you want to publish the deck as a website** (GitHub Pages, Netlify, etc.).
>
> **Gotcha:** `dist/index.html` will appear **blank** if you open it directly by double-clicking. Slidev's build defaults to absolute asset paths (`/_assets/...`), which only resolve when the deck is served from the root of a web server. To preview locally, run `npx serve workshops/01-slidev/dist` and open the URL it prints. To produce a `dist/` that works when opened directly from the filesystem, add `-- --base ./` to the build command: `pnpm --filter ./workshops/01-slidev build -- --base ./`.

```bash
pnpm export:01
```

> Shortcut for `pnpm --filter ./workshops/01-slidev export`. Runs `slidev export`, which renders the deck to a single PDF file: `workshops/01-slidev/slides-export.pdf`. One slide per page. **Use this when you want one file to email or attach.**

PDF export needs a headless Chromium browser installed in the workshop. One-time setup:

```bash
pnpm --filter ./workshops/01-slidev add -D playwright-chromium
```

> `add` installs a package. `-D` (or `--save-dev`) installs it as a *devDependency* — recorded in `package.json` under `devDependencies`, meaning it's needed during development/build but not by end users of the deck. `playwright-chromium` is a stripped-down Chromium browser (~150 MB) that Slidev drives behind the scenes to render slides for PDF capture.

After that one-time setup, `pnpm export:01` works without further configuration.

---

## Three modes at a glance

| Command | Output | Use it when |
|---------|--------|-------------|
| `pnpm dev:01` | A live web server at `http://localhost:3030` | Authoring. Hot-reloads. |
| `pnpm build:01` | A folder `dist/` you upload to a web host | Publishing as a website. |
| `pnpm export:01` | A single PDF file | Sharing one file. |

---

## Deploying to GitHub Pages

A ready-to-use GitHub Actions workflow is in `snippets/deploy.yml`. To wire it up:

1. Copy `snippets/deploy.yml` to `.github/workflows/deploy.yml` at the **repo root**.
2. In the repo's GitHub settings: **Settings → Pages → Source: GitHub Actions**.
3. Commit and push to `main`. The Action builds the deck and publishes it.

After the first deploy, the workshop lives at:
`https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/01/`

---

## Customizing this deck only (without touching the theme)

If you want to override a color or font for **just this workshop** (e.g. a guest co-presenter wants a different accent for their session), drop a `style.css` file next to `slides.md`. Slidev auto-loads it. For example:

```css
/* workshops/01-slidev/style.css */
:root {
  --ctp-color-accent: #4DB6AC;          /* override accent for this deck only */
}
```

Reload the browser. The override applies to this deck only — every other workshop and the theme itself are untouched.

If the change should apply to **every** workshop, edit `ctp-templates/slidev/styles/tokens.css` instead, and also update `ctp-templates/shared/brand/colors_and_type.css` (the canonical source).

---

## Author notes

- **Speaker notes** are inside HTML comments at the bottom of each slide — open the presenter view at `/presenter` to see them while presenting.
- **Long code samples** live in `snippets/` so they stay lintable. The deck pulls them in with `<<< @/snippets/file.ext`. This works for `.ts`, `.js`, `.vue`, `.yml` files; for `.md` snippets, inline as a literal code block instead (Slidev's `<<<` doesn't wrap markdown imports cleanly).
- **All visual styling** comes from `slidev-theme-ctp` in the sibling `ctp-templates` repo. Don't add visual rules to this workshop unless they're truly deck-specific.

For the full theme reference (every layout, every component, every CSS variable you can override), see `ctp-templates/slidev/README.md`.
