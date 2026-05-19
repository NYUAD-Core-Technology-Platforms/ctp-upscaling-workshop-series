---
# Workshop 01 — How to use Slidev
# This deck is itself made with Slidev, using the CTP theme. So the slides
# you're watching are the lesson AND the demo.
theme: ctp
title: How to use Slidev
info: |
  CTP Upscaling Workshop 01 — How to use Slidev.

  Markdown-driven presentations: install, author, theme, and publish a
  deck end to end using the CTP slidev theme.
author: CTP at NYUAD
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
layout: cover
---

# How to use Slidev

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop 01</span>

::meta::
Core Technology Platforms · NYU Abu Dhabi
12 May 2026

<!--
Welcome people in. Mention the deck they're watching is itself a Slidev deck — so
everything you see is achievable with the tools we'll teach in the next hour.
-->


---
layout: default
---

# What you'll leave with

By the end of this hour you will be able to:

1. Spin up a Slidev deck on your laptop from zero.
2. Write slides in Markdown — including code, images, columns, and components.
3. Apply the **CTP theme** so your deck matches the rest of the series.
4. Export the result to PDF, a static site, or GitHub Pages.

<CtpCallout label="Format" tone="accent">
Roughly 45 min of slides + 15 min of hands-on. Three short exercises in <code>exercises/README.md</code> — feel free to do them as we go.
</CtpCallout>

<!--
Read the goals out loud — anchors expectations. Mention that the exercises are
self-paced; if you finish early, jump ahead.
-->

---
layout: section
---

::number::
PART 01

# Why Slidev?

::subtitle::
Markdown decks that feel like a real product.

---

# What is Slidev?

A presentation tool by Anthony Fu where:

- **Slides are Markdown.** One `slides.md` file holds your whole deck.
- **Components are Vue.** Drop in interactive widgets, animations, charts.
- **Everything is the web.** Built on Vite, runs in any browser, exports to PDF or static HTML.
- **It's open source.** [sli.dev](https://sli.dev) · [github.com/slidevjs/slidev](https://github.com/slidevjs/slidev)

```md
# A slide

Just a markdown heading and some content.

- Bullet
- Another bullet
```

---
layout: two-cols-header
---

# Why pick it over PowerPoint, Keynote, Reveal.js?

::left::

### Strengths
- **Diffable.** It's a text file — git tracks every change.
- **Code looks great.** Real syntax highlighting, line focus, editable blocks.
- **Reusable.** Themes and components compose across decks.
- **Programmable.** Anything Vue can do, your slide can do.

::right::

### Trade-offs
- **You're writing Markdown.** Not a drag-and-drop tool.
- **Some learning curve** if you've never touched Node.
- **Designers can't open it without setup.** PDF export bridges that gap.

<CtpCallout label="When to reach for it" tone="accent">
Code-heavy talks, technical workshops, anything you'll iterate on in version control. Reach for Keynote if your deck is mostly photographs.
</CtpCallout>

---
layout: section
---

::number::
PART 02

# Install &amp; run locally

::subtitle::
Five minutes from zero to a live, hot-reloading deck.

---

# Prerequisites

You need:

- **Node.js** 18 or newer — check with `node --version`.
- **A package manager** — `npm` ships with Node. We use `pnpm` in this repo, but `npm` and `yarn` work too.
- **A terminal and an editor.** VS Code with the Slidev extension is nice but optional.

<CtpCallout label="Don't have Node?">
Install via <a href="https://nodejs.org">nodejs.org</a> or your OS package manager (<code>brew install node</code>, <code>apt install nodejs</code>, etc.). On macOS / Linux, <a href="https://github.com/Schniz/fnm">fnm</a> is a great version manager.
</CtpCallout>

---

# Start a new deck in 30 seconds

```bash
# Scaffolds a fresh deck in ./my-deck
npm init slidev@latest

# Pick a name, accept defaults
cd my-deck
npm install
npm run dev
```

You'll see something like:

```text
  Slidev v0.49.0
  > Local:    http://localhost:3030/
  > Network:  use --host to expose

  Shortcuts: press h to show all
```

Open the URL. You're presenting.

<!--
Live demo idea: do this in a terminal on the projector. Watch their faces when
they see hot reload — saving slides.md updates the browser instantly.
-->

---

# What you just got

```text
my-deck/
├── slides.md          ← your entire deck
├── components/        ← optional Vue components
├── public/            ← static assets (images, fonts)
├── package.json
└── netlify.toml       ← deploy config (you can ignore)
```

The dev server has **hot reload** — saving `slides.md` updates the browser without losing your slide position.

---
layout: two-cols-header
---

# Tour of the Slidev runtime

::left::

### Audience view (port 3030)
The main slide URL. This is what the projector sees.

### Presenter view
Open `http://localhost:3030/presenter` for:
- Speaker notes
- Next-slide preview
- Timer
- Drawing tools

::right::

### Useful shortcuts

<div class="text-sm">

<CtpKbd>f</CtpKbd> &nbsp; full screen<br>
<CtpKbd>o</CtpKbd> &nbsp; slide overview / navigator<br>
<CtpKbd>d</CtpKbd> &nbsp; toggle dark mode<br>
<CtpKbd>g</CtpKbd> &nbsp; jump to slide number<br>
<CtpKbd>Space</CtpKbd> &nbsp; next click / slide<br>
<CtpKbd>←</CtpKbd> <CtpKbd>→</CtpKbd> &nbsp; previous / next slide<br>
<CtpKbd>?</CtpKbd> &nbsp; show all shortcuts<br>

</div>

---
layout: section
---

::number::
PART 03

# Authoring in Markdown

::subtitle::
Frontmatter, layouts, code, images, components, animations.

---

# A slide is a Markdown block

Slides are separated by `---` on its own line. Optional **frontmatter** (a YAML block) at the top of each slide configures it.

```md
---
# global deck config — top of slides.md
title: My Deck
theme: ctp
author: Hadi
---

# Slide 1

Markdown body for slide 1.

---
layout: section
---

# Slide 2 is a section divider
```

The very first `---` block is the global deck config; later `---` blocks separate slides.

---

# Hands-on minimum: a one-slide deck

```md
---
# slides.md — your very first slide
theme: ctp
title: My First Deck
---

# Hello, Slidev!

Welcome to my first deck.

---

## Second slide

- Markdown for content
- Vue for components
- Vite under the hood
```

That's a complete Slidev source. Save it as `slides.md`, run `npm run dev`, and you have a two-slide deck.

<CtpCallout label="Trick" tone="accent">
The <code>&lt;&lt;&lt; @/path</code> syntax above is Slidev's way of importing a code block from a file. Great for keeping long code samples lintable in their own file instead of escaped inside Markdown.
</CtpCallout>

---

# Layouts: change the shape of a slide

Layouts are slide templates. Pick one with `layout:` in the slide frontmatter.

```md
---
layout: cover
---

# Title slide

---
layout: two-cols
---

Left column content.

::right::

Right column content.

---
layout: image-right
image: /img/microscope.jpg
---

# Heading with an image on the right
```

Slidev ships with `default`, `cover`, `center`, `two-cols`, `image`, `image-left`, `image-right`, `quote`, `statement`, `iframe`, `end`. Themes (like CTP's) can add more.

---
layout: two-cols-header
---

# Two columns, hands-on

::left::

Source:

```md
---
layout: two-cols-header
---

# Compare two things

::left::
### Option A
- Cheap
- Fast

::right::
### Option B
- Robust
- Scalable
```

::right::

Renders as a header that spans both columns, then two side-by-side bodies separated by `::left::` and `::right::`.

Use it for compare/contrast, "before/after", or any pair of parallel ideas.

---

# Code blocks

Triple-backtick fences with a language tag. Slidev renders with [Shiki](https://shiki.style) for accurate, theme-aware highlighting.

````md
```ts
function fib(n: number): number {
  if (n < 2) return n
  return fib(n - 1) + fib(n - 2)
}
```
````

Renders as:

```ts
function fib(n: number): number {
  if (n < 2) return n
  return fib(n - 1) + fib(n - 2)
}
```

---

# Code: highlighting and clicks

Add `{1,3-4}` after the language to highlight specific lines. Add `{monaco}` to make the block live-editable in the browser.

````md
```ts {2-3}
const square = (n: number) => {
  // highlight these two lines
  return n * n
}
```
````

```ts {2-3}
const square = (n: number) => {
  // highlight these two lines
  return n * n
}
```

You can also step through lines per click: `{1|2|3-4}` advances on each <CtpKbd>Space</CtpKbd>.

---

# Images

Static images live in `public/`. Reference them with a leading slash.

```md
![microscope](/img/microscope.jpg)

<!-- with sizing via inline HTML -->
<img src="/img/microscope.jpg" class="h-60 rounded-lg shadow" />
```

Slidev uses [UnoCSS](https://unocss.dev), so utility classes (`h-60`, `rounded-lg`, `shadow`, `mx-auto`, …) work inline. Tailwind users will feel at home.

<CtpCallout label="Where to put assets">
Workshop-specific images: <code>workshops/NN-.../public/img/</code>. Brand-wide assets (logos, photos for the whole series): <code>shared/brand/</code> — and copy into the deck's <code>public/</code> at build if needed.
</CtpCallout>

---

# Components: drop Vue into a slide

Put a `.vue` file in `components/` and Slidev auto-imports it. Use it like any HTML tag.

<<< @/snippets/component.vue

Then in your slide:

```md
# My slide

A button that counts: <Counter />
```

The CTP theme already ships `<CtpCallout>`, `<CtpKbd>`, `<CtpLogo>` — no install needed.

---

# Click animations &amp; transitions

Reveal items one click at a time with `<v-click>`:

```md
- Always shown
<v-click>

- Appears on click 1
</v-click>
<v-click>

- Appears on click 2
</v-click>
```

Live demo:

- Always shown
<v-click>

- Appears on click 1
</v-click>
<v-click>

- Appears on click 2
</v-click>

Per-slide transition in frontmatter: `transition: slide-left` (or `fade`, `view-transition`, etc.).

---

# Speaker notes

Anything inside an HTML comment **after** the slide content shows up in the presenter view, never to the audience.

```md
---

# My slide

Body.

<!--
Notes go here. Mention the thing about Q3 numbers. Don't forget to breathe.
-->
```

<CtpCallout label="Why bother" tone="accent">
The presenter view is excellent — slide preview + notes + timer. If you've ever forgotten what was supposed to come next, you'll appreciate it.
</CtpCallout>

---
layout: default
---

# Try it — Exercise 1

<div class="text-lg">

In `exercises/README.md` → **Exercise 1: Your first deck** (~5 min).

You'll:
1. `npm init slidev@latest` in a fresh folder.
2. Run the dev server.
3. Edit `slides.md` — change a title, add a slide, add a two-column layout.

</div>

<CtpCallout label="Stretch" tone="accent">
Add a code block with line highlighting. Add a <code>&lt;v-click&gt;</code> reveal. Try the dark-mode shortcut.
</CtpCallout>

---
layout: section
---

::number::
PART 04

# Theming with the CTP template

::subtitle::
The look you're watching, in your own deck.

---

# What the CTP theme gives you

It's the `slidev-theme-ctp` package, published from the sibling `ctp-templates` repo at `slidev/`:

- **Layouts:** `cover`, `section`, `default`, `two-cols-header`, `end`
- **Components:** `<CtpCallout>`, `<CtpKbd>`, `<CtpLogo>`, `<CtpFooter>` (auto-imported)
- **Color tokens** in CSS variables — easy to override per deck
- **Dark mode** that swaps the whole palette
- A **demo deck** at `ctp-templates/slidev/example.md` showing every piece

The deck you are watching right now uses it.

---

# Using it in your workshop

Make sure `ctp-templates` is checked out as a sibling of this repo. Then your workshop's `package.json` links to the theme:

```json
{
  "dependencies": {
    "slidev-theme-ctp": "link:../../../ctp-templates/slidev"
  }
}
```

(The `pnpm new-workshop <slug>` script writes this for you.)

Frontmatter of your `slides.md`:

```yaml
---
theme: ctp
title: My CTP Workshop
author: Hadi Zaatiti
info: |
  Short description for the presenter view and PDF metadata.
---
```

That's it. Every layout and component is now available by name.

---
layout: two-cols-header
---

# Customizing — without forking the theme

::left::

### Override a color

Drop a `style.css` in your deck:

```css
/* style.css — loaded automatically by Slidev */
:root {
  --ctp-color-accent: #4DB6AC;
}
```

Just that one variable repaints every accent in the deck.

::right::

### Add a workshop-specific component

Put it in `workshops/NN-.../components/`. Slidev auto-imports both the theme's components and your local ones.

If a name clashes, **yours wins**. Useful for per-workshop branded chrome that you don't want to push upstream.

---

# The tokens you can override

All defined in `ctp-templates/slidev/styles/tokens.css`:

```css
--ctp-color-violet      /* primary brand */
--ctp-color-accent      /* highlights, links, underlines */
--ctp-color-paper       /* default background */
--ctp-color-ink         /* default text */
--ctp-color-rule        /* hairline borders */

--ctp-font-sans
--ctp-font-mono
--ctp-font-display

--ctp-radius
--ctp-shadow-card
```

Re-skin the entire series by editing that file. Re-skin a single deck by overriding variables in your local `style.css`.

---
layout: default
---

# Try it — Exercise 2

<div class="text-lg">

In `exercises/README.md` → **Exercise 2: Use the CTP theme** (~10 min).

You'll:
1. Switch your deck from the default theme to `ctp`.
2. Add a cover slide, a section divider, and a callout.
3. Toggle dark mode and watch the palette swap.

</div>

<CtpCallout label="Stretch" tone="accent">
Override <code>--ctp-color-accent</code> in a local <code>style.css</code> to give your deck a unique accent color while keeping the rest of the brand.
</CtpCallout>

---
layout: section
---

::number::
PART 05

# Export &amp; publish

::subtitle::
PDF, static site, GitHub Pages, single-file HTML.

---

# Static site (the everyday option)

```bash
slidev build
```

Produces a `dist/` folder you can host anywhere static — Netlify, Vercel, S3, GitHub Pages, your own NGINX.

```bash
# Preview the build locally
npx serve dist
```

For a non-root path (like `/ws01/`):

```bash
slidev build --base /ws01/
```

---

# PDF

```bash
# Install the headless browser slidev needs
npm install -D playwright-chromium

slidev export                    # → slides-export.pdf
slidev export --with-clicks      # one PDF page per click step
slidev export --dark             # in dark theme
```

The PDF is what you'll attach to email follow-ups or upload to the CTP shared drive. It captures speaker notes too if you pass `--with-notes`.

---

# Single-file HTML (for sharing without a server)

```bash
slidev export --format pptx       # PowerPoint export
slidev export --format md         # plain markdown export
slidev build && npx slidev-export-html dist  # community tool — single file
```

For most cases the **static build** is what you want — drop `dist/` on any host and you're done.

---

# GitHub Pages — automatic on every push

The repo already has the workflow scaffolded for workshop 01. Drop the file below into `.github/workflows/deploy.yml` (or check this repo for the live one):

<<< @/snippets/deploy.yml{1-20}

Then in GitHub: **Settings → Pages → Source: GitHub Actions**. Push to `main`, the deck deploys.

<CtpCallout label="URL" tone="accent">
After deploy, the workshop lives at <code>https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/01/</code>. Add a link to the repo README.
</CtpCallout>

---
layout: default
---

# Try it — Exercise 3

<div class="text-lg">

In `exercises/README.md` → **Exercise 3: Publish** (~10 min).

Pick whichever appeals:

- Export your deck to **PDF**.
- Run a local **static build** and serve it.
- Drop the **GitHub Pages** workflow into your fork and push.

</div>

---
layout: section
---

::number::
PART 06

# Wrap up

::subtitle::
Resources, where to go next, questions.

---

# Resources

Bookmark these:

- **Slidev docs** — <https://sli.dev>
- **Slidev themes gallery** — <https://sli.dev/resources/theme-gallery>
- **CTP theme reference** — `ctp-templates/slidev/README.md` (sibling repo)
- **CTP theme demo** — run `pnpm dev:template`
- **This deck's source** — `workshops/01-slidev/slides.md`

For day-two questions, post in the CTP Upscaling channel.

---

# What's next in the series

| # | Topic | When |
|---|-------|------|
| 02 | TBD — propose a topic! | TBD |
| 03 | TBD | TBD |

The format will stay the same: a short deck + hands-on exercises, both built with the tooling we just learned.

<CtpCallout label="Pitch a workshop" tone="accent">
Open an issue in the repo with a one-paragraph proposal. CTP staff will pair with you on the materials.
</CtpCallout>

---
layout: end
---

# Thanks!

::meta::
Questions? Drop them in the CTP Upscaling channel.
Repo: github.com/NYUAD-Core-Technology-Platforms/ctp-upscaling-workshop-series
