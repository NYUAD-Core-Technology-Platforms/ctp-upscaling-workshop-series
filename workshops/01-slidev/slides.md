---
# Workshop 01: AI-Assisted Presentations with Slidev: From Prompt to Polished Deck
# This deck is itself made with Slidev, using the CTP theme. So the slides
# you're watching are the lesson AND the demo.
theme: ctp
routerMode: hash
title: "AI-Assisted Presentations with Slidev: From Prompt to Polished Deck"
info: |
  CTP Upscaling Workshop 01. AI-Assisted Presentations with Slidev: From Prompt to Polished Deck.

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

# AI-Assisted Presentations with Slidev

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop 01 · From Prompt to Polished Deck</span>

::meta::
Core Technology Platforms · NYU Abu Dhabi
12 May 2026

<!--
Welcome people in. Mention the deck they're watching is itself a Slidev deck, so
everything you see is achievable with the tools we'll teach in the next hour.
-->


---
layout: default
---

# What you'll leave with

The workshop is in **two halves**, mirroring the title.

**Part A. From Prompt** (AI-assisted authoring)
1. Map the main types of AI tools that can help create presentations.
2. Turn raw source material into a structured Markdown presentation brief.
3. Choose when to stay in chat, when to use visual deck tools, and when to use an agentic workflow.

**Part B. To Polished Deck** (Slidev)
4. Spin up a Slidev deck on your laptop from zero.
5. Write slides in Markdown, including code, images, columns, and components.
6. Apply the CTP theme so your deck matches the rest of the series.
7. Export the result to PDF, a static site, or GitHub Pages.

<CtpCallout label="Format" tone="accent">
Part A is a 20-minute map of AI-assisted presentation workflows, including one short prompt exercise. Part B is the hands-on Slidev build.
</CtpCallout>

<!--
Read the goals out loud; that anchors expectations for the two-part structure.
Mention that Part A teaches how to think about the tool landscape without turning
the workshop into a tool catalog. Part B is where everyone starts building.
-->

---
layout: section
---

::number::
PART A

# From Prompt

::subtitle::
AI-assisted workflows before writing a line of Slidev.

<!--
Big-chapter divider. Set the framing: Part A is a 20-minute map of AI-assisted
presentation workflows. We are not ranking tools. We are asking what kind of
work each tool is good at, and where the durable source of truth should live.
-->

---
layout: section
---

::number::
PART A · 01

# Start with the workflow

::subtitle::
The hard part is not opening a slide app.

---
layout: two-cols-header
---

# The work before the deck

::left::

### Source material
- Papers
- Websites
- Reports
- Notes
- Existing decks
- Data summaries

::right::

### Presentation work
- Understand the material.
- Decide the audience journey.
- Pick the claims and evidence.
- Shape slide-by-slide structure.
- Then choose a tool to render it.

<CtpCallout label="Framing" tone="accent">
The goal is not to find the one perfect AI presentation tool. The goal is to keep the thinking portable enough that many tools can help without trapping the work.
</CtpCallout>

<!--
Use this slide to slow down the "AI makes slides" instinct. The first decision is
not Gamma vs. PowerPoint vs. Slidev; it is where the structure of the talk lives.
-->

---
layout: section
---

::number::
PART A · 02

# Level 1: chat tools

::subtitle::
Turn source material into a structured brief.

---
layout: two-cols-header
---

# From raw material to a brief

::left::

### Inputs
- A PDF or paper
- A website
- Lab notes
- A project README
- A half-written abstract

Examples: ChatGPT, Claude, Gemini, Copilot Chat.

::right::

### Output
- Audience and goal
- Learning objectives
- Slide-by-slide outline
- Key claims and evidence
- Draft speaker notes
- Asset ideas

Call this file `presentation-brief.md`.

<CtpCallout label="Why Markdown now?" tone="accent">
Markdown shows up after the need is clear: it is plain text with structure. Humans can read it, AI can edit it, and many presentation tools can consume it.
</CtpCallout>

---

# Hands-on: make the brief

Use ChatGPT or any chat assistant. Give it source material and ask for a Markdown presentation brief.

```text
Turn the source material below into a Markdown presentation brief.

Audience: [who will attend]
Goal: [what they should be able to do after]
Length: 6-8 slides, 10 minutes.
Tone: clear, technical, no hype, no emoji.

Output:
- title
- audience
- learning objectives
- one h2 per slide
- 2-4 bullets per slide
- speaker notes for each slide
- questions or facts to verify

Source material:
PASTE NOTES, ABSTRACT, WEBSITE TEXT, OR PAPER EXCERPT HERE
```

Five minutes. The goal is a reusable brief, not a polished deck.

<!--
This is the one Part A hands-on moment. Attendees can use their own source
material or the fallback excerpt in exercises/README.md. Keep it moving: the
point is that the first durable artifact is the brief.
-->

---
layout: section
---

::number::
PART A · 03

# Levels 2 and 3

::subtitle::
When the tool starts making slides.

---
layout: two-cols-header
---

# Visual-first tools

::left::

### Level 2: deck builders
Prompt or brief in; designed slides out.

Examples: Gamma, Canva Magic Design, Beautiful.ai, Claude Design.

Useful for:
- Fast visual drafts
- Mood boards
- Non-technical slide decks

::right::

### Level 3: AI inside slide apps
Stay where the final file already lives.

Examples: PowerPoint Copilot, Gemini in Slides, Canva AI.

Useful for:
- Required templates
- Existing decks
- Last-mile rewriting and layout help

<CtpCallout label="Trade-off" tone="accent">
These tools can produce something attractive quickly. The risk is that the real source of truth becomes trapped in a visual file that is harder to review, diff, reuse, or ask another AI tool to edit precisely.
</CtpCallout>

---
layout: section
---

::number::
PART A · 04

# Level 4: agentic workflows

::subtitle::
When AI edits the actual presentation source.

---

# Three ways to use AI with source

### Best: agentic editor
Codex, Cursor, Claude Code, or similar edits `slides.md`, runs the preview, checks the build, and iterates with you.

### Good fallback: chat interface
Paste `slides.md` into ChatGPT, Claude, or Gemini and ask for revised Markdown or patch-style changes. Less interactive, but still works.

### Least ideal: manual recreation
Generate a visual draft elsewhere, then recreate it by hand in the final tool. Useful for inspiration, expensive for maintenance.

<CtpCallout label="Key shift" tone="accent">
Agentic tools are strongest when the deck has source files. They can edit structure, not just pixels.
</CtpCallout>

<!--
Name Codex, Cursor, and Claude Code as examples, but keep the category
tool-agnostic. Also make the fallback explicit: people without agentic tools can
still use a chat interface to revise the Markdown source.
-->

---
layout: section
---

::number::
PART A · 05

# The source of truth

::subtitle::
One portable artifact, many possible outputs.

---

# One brief can feed many tools

```text
raw material
  -> chat assistant
    -> presentation-brief.md
      -> Slidev / slides.md
      -> HTML or PDF
      -> LaTeX / Beamer
      -> PowerPoint or Canva draft
      -> Claude Design or other visual tools
      -> another AI editing pass
```

Keep edits flowing back to the Markdown source, or the workflow splits into disconnected copies.

<CtpCallout label="Working principle" tone="accent">
The durable source is the text you can review, version, reuse, and ask AI to change. The rendered deck is one output of that source.
</CtpCallout>

---

# Why Slidev next?

For the rest of the workshop, Slidev gives us a concrete version of this workflow:

- One source file: `slides.md`
- Live preview while editing
- CTP theme and reusable components
- Export to PDF, static web, and other formats
- Works well with agentic tools because the deck is text

<!--
This is the bridge. The point is not that Slidev is the only destination; it is
the hands-on destination for this workshop because it makes the source visible.
-->

---
layout: section
---

::number::
PART B

# To Polished Deck

::subtitle::
From portable Markdown source to a published Slidev presentation.

<!--
Big-chapter divider. Part A gave the 20-minute workflow map. Part B is the
hands-on implementation: turn the source-of-truth idea into a running Slidev deck.
-->

---
layout: section
---

::number::
PART B · 01

# Why Slidev?

::subtitle::
Markdown decks that feel like a real product.

---

# What is Slidev?

A presentation tool where:

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

# Making a simple slides.md file

The minimum a Slidev deck needs is a single Markdown file `slides.md`, minimal example below:

````md
# Deck Test

Use markdown syntax here to add content

- item 1
- item 2
- etc...

<!--
Speaker notes here
-->

---

# the title for slide 1

Some text

<!--
Notes for slide 2
-->
````


---
layout: two-cols-header
---

# Running the deck

`cd` into the folder where `slides.md` lives, install Slidev locally (pinned to `^0.49.0` because v52 has a Windows path bug), and start the dev server. Open `http://localhost:3030/` when it prints.

::left::

### Windows (PowerShell)

**No Node yet?** Download LTS from [nodejs.org](https://nodejs.org), or:

```powershell
winget install OpenJS.NodeJS.LTS
```

Then in a **fresh** PowerShell window:

```powershell
cd C:\path\to\your\deck
npm init -y
npm install --save-dev "@slidev/cli@^0.49.0"
npx slidev
```

::right::

### macOS / Linux (Terminal)

**No Node yet?** Download LTS from [nodejs.org](https://nodejs.org), or:

```bash
brew install node           # macOS
sudo apt install nodejs npm # Debian / Ubuntu
```

Then in your deck folder:

```bash
cd /path/to/your/deck
npm init -y
npm install --save-dev "@slidev/cli@^0.49.0"
npx slidev
```

---
layout: two-cols-header
---

# Start your own deck: one command

After the manual setup above works once, the **CTP templates repo** ships a scaffold script so you never repeat those steps. Clone [`ctp-templates`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates) once as a sibling of where you keep code, then:

::left::

### Scaffold

```bash
cd ctp-templates
pnpm install         # one-time
pnpm new-deck my-talk
```

It creates `../my-talk/` next door to `/ctp-templates/`

::right::

### Run

```bash
cd ../my-talk
npm install
npx slidev
```

Edit `slides.md` and the browser hot-reloads.



---
layout: two-cols-header
---

# Published automatically, online

Push to `main` and a GitHub Action rebuilds every deck and republishes the site. The same build reruns when the CTP theme changes, so every deck stays current. No manual export, no uploading files.

::left::

### Live site and landing page
- The landing page lists every workshop and links to each deck.
- Each deck is live at `/<NN-slug>/`, with a downloadable PDF beside it.

Live now:
- [Landing page](https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/)
- [Workshop 01](https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/01-slidev/)

::right::

### Versioned releases
Tag a version and a second workflow attaches per-deck archives to a GitHub Release:

```bash
git tag v2026.05 && git push origin v2026.05
```

- `<NN-slug>.pdf`, the exported PDF
- `<NN-slug>-html.zip`, an offline copy of the slides

<!--
Point at this live site as proof: the deck on screen is published exactly this
way. Two workflows do it: deploy-pages.yml (Pages site on every push) and
release.yml (versioned PDF + HTML archives on a tag), both via scripts/ci-build.mjs.
-->

---
layout: two-cols-header
---

# When the CTP template changes

Your deck links the theme via `file:../ctp-templates/slidev`, a **symlink** not a copy, so you never reinstall when it evolves.

::left::

### To get the latest theme

```bash
cd /path/to/ctp-templates
git pull
```

The next browser reload (or `npx slidev build` / `export`) picks up the changes.

::right::

### Where it applies
- **Locally:** `git pull` in [`ctp-templates`](https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates), every deck reflects it.
- **Online:** a theme change triggers an automatic rebuild and republish.

<CtpCallout label="Check after a template change" tone="sand">
A theme update can break or shift a slide. Always page through your deck afterward to confirm it still looks great.
</CtpCallout>


---
layout: two-cols-header
---

# Why all this complexity?

Plain text plus a few workflows buy you things a binary slide file simply cannot.

::left::

### It's just syntax
Markdown is readable, reviewable, and portable. AI tools can edit it precisely, and it travels across formats (PDF, web, LaTeX).

### Version control
Git gives full history with push, pull, branches, and pull-request review. Roll back a bad change; collaborate without emailing files around.

::right::

### Automated testing
CI builds every deck on each push, flags one that fails to render, and republishes the site. No manual export, no stale copies.

### Interactive by design
Slidev slides are web pages: live charts, components, and animations. For research, display scientific data interactively instead of pasting static screenshots.

<!--
This is the payoff slide. Tie each advantage back to a pain it removes:
text = reviewable + AI-editable, git = history + collaboration, CI = always
publishable + verified, interactive = real data viz for scientific talks.
-->

---

# Live data: lab equipment from Booked

Pulled live from the CTP **Booked** system at build time. Page through the full catalog:

<EquipmentList />

<!--
The whole list is real data baked into equipment.json by scripts/fetch-equipment.mjs
(GET /Services/Resources/ with X-Booked-ApiId / X-Booked-ApiKey headers). Booked is
behind the NYU VPN, so the fetch runs on the self-hosted MEG Workstation runner
(refresh-equipment.yml) or locally via `npm run data`, then the names are committed.
No credentials ship in the published deck. Use the Prev/Next buttons to page through
~300 resources; mention the count to show the scale of the CTP facility.
-->

---

# Interactive math: least-squares regression

Slides are web pages, so this stats demo is **live**: least squares fits points drawn from `y = slope·x + 2 + noise`. Change the parameters and watch the fit and **R²** update.

<LeastSquaresDemo />

<!--
Try it live: raise Noise sigma and watch R squared fall; grow the sample size and
the fitted slope settles closer to the true slope; hit Resample for a fresh draw
from the same parameters.

The point: this is real computation in the slide, not a screenshot. The OLS
slope/intercept are computed in JS (closed form) and R squared updates live.
A seeded RNG keeps the data fixed when you change one parameter, so each button
isolates one effect; Resample bumps the seed for a new draw. Component lives in
components/LeastSquaresDemo.vue. Tie back to the "interactive by design" slide.
-->

---
layout: end
---

# Thanks!

::meta::

Questions? Drop them in the CTP Upscaling channel.

Repo &nbsp;·&nbsp; [github.com/NYUAD-Core-Technology-Platforms/ctp-upscaling-workshop-series](https://github.com/NYUAD-Core-Technology-Platforms/ctp-upscaling-workshop-series)

