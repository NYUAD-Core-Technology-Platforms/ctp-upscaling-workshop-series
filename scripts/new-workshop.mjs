#!/usr/bin/env node
/*
 * scripts/new-workshop.mjs
 *
 * Scaffold a new minimal workshop folder under workshops/.
 *
 * Usage:
 *   pnpm new-workshop <kebab-slug>
 *
 * Examples:
 *   pnpm new-workshop git-basics
 *   pnpm new-workshop reproducible-environments
 *
 * What it does:
 *   1. Picks the next workshop number by scanning workshops/ (01, 02, …).
 *   2. Creates workshops/NN-<slug>/ with:
 *        - package.json   (name = ctp-wsNN-<slug>, theme via link: to the
 *                          sibling ctp-templates repo)
 *        - slides.md      (minimal cover + outline + one section + end)
 *        - README.md      (run instructions)
 *        - public/brand/  (nyuad-logo.png copied so /brand/* resolves)
 *        - components/, snippets/, exercises/ (with .gitkeep / README)
 *   3. Prints the next two commands to run.
 *
 * Requirements:
 *   - `ctp-templates` repo checked out as a sibling of this repo (same parent
 *     directory). The script copies brand assets from there and the workshop
 *     consumes the Slidev theme via a link: dependency pointing at it.
 *
 * Nothing else in the repo is touched. The pnpm-workspace.yaml glob
 * `workshops/*` already includes the new folder.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync, cpSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Sibling repo holding the Slidev theme + brand assets.
// Expected directory layout:
//   <parent>/
//   ├── ctp-templates/                       <-- THEME_REPO
//   └── ctp-upscaling-workshop-series/       <-- this repo (root)
const THEME_REPO = resolve(root, '..', 'ctp-templates')
const THEME_PKG_REL_FROM_WORKSHOP = '../../../ctp-templates/slidev'

if (!existsSync(THEME_REPO)) {
  console.error(`Cannot find sibling ctp-templates repo at ${THEME_REPO}`)
  console.error('Clone it next to this repo:')
  console.error('  git clone https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates.git')
  console.error('(should sit alongside ctp-upscaling-workshop-series under the same parent folder)')
  process.exit(1)
}

// ----- Parse + validate the slug ---------------------------------------------

const rawArg = process.argv[2]
if (!rawArg) {
  console.error('Usage: pnpm new-workshop <kebab-slug>')
  console.error('Example: pnpm new-workshop git-basics')
  process.exit(1)
}

const slug = rawArg
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

if (!slug) {
  console.error(`Invalid slug: "${rawArg}". Use kebab-case letters and digits, e.g. git-basics.`)
  process.exit(1)
}

// ----- Pick the next workshop number -----------------------------------------

const workshopsDir = join(root, 'workshops')
const existingNumbers = readdirSync(workshopsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => parseInt(d.name.split('-')[0], 10))
  .filter((n) => !Number.isNaN(n))

const nextNum = existingNumbers.length ? Math.max(...existingNumbers) + 1 : 1
const numStr = String(nextNum).padStart(2, '0')
const dirName = `${numStr}-${slug}`
const targetDir = join(workshopsDir, dirName)

if (existsSync(targetDir)) {
  console.error(`Workshop already exists at workshops/${dirName}/.`)
  process.exit(1)
}

// ----- Generate the workshop -------------------------------------------------

const today = new Date().toISOString().slice(0, 10)
const titleCase = slug
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(' ')
const pkgName = `ctp-ws${numStr}-${slug}`

console.log(`Creating workshops/${dirName}/ ...`)

mkdirSync(targetDir, { recursive: true })
mkdirSync(join(targetDir, 'components'), { recursive: true })
mkdirSync(join(targetDir, 'snippets'), { recursive: true })
mkdirSync(join(targetDir, 'public', 'brand'), { recursive: true })
mkdirSync(join(targetDir, 'public', 'img'), { recursive: true })
mkdirSync(join(targetDir, 'exercises'), { recursive: true })

// Copy the brand asset so /brand/nyuad-logo.png resolves at build time. Source
// is the canonical copy in the sibling ctp-templates repo.
const brandSrc = join(THEME_REPO, 'shared', 'brand', 'nyuad-logo.png')
if (existsSync(brandSrc)) {
  cpSync(brandSrc, join(targetDir, 'public', 'brand', 'nyuad-logo.png'))
} else {
  console.warn(`Warning: brand asset not found at ${brandSrc}; skipping logo copy.`)
}

writeFileSync(
  join(targetDir, 'package.json'),
  JSON.stringify(
    {
      name: pkgName,
      version: '0.1.0',
      private: true,
      description: `CTP Upscaling workshop, ${titleCase}.`,
      scripts: {
        dev: 'slidev --open',
        build: 'slidev build',
        export: 'slidev export',
        'export:pdf': 'slidev export --format pdf',
      },
      dependencies: {
        // file: protocol, symlinks to the sibling ctp-templates repo.
        // Equivalent to `link:` in pnpm but works on both npm and pnpm,
        // so consumer setups using either tool work without changes.
        'slidev-theme-ctp': `file:${THEME_PKG_REL_FROM_WORKSHOP}`,
      },
      devDependencies: {
        '@slidev/cli': '^0.49.0',
        '@slidev/types': '^0.49.0',
        vue: '^3.4.0',
      },
    },
    null,
    2,
  ) + '\n',
)

writeFileSync(
  join(targetDir, 'slides.md'),
  `---
theme: ctp
routerMode: hash
title: ${titleCase}
author: CTP at NYUAD
info: |
  CTP Upscaling Workshop ${numStr}, ${titleCase}.

  Short description; appears in the presenter view and PDF metadata.
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
layout: cover
---

# ${titleCase}

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop ${numStr}</span>

::meta::
Core Technology Platforms · NYU Abu Dhabi
${today}

<!--
Speaker notes for the cover slide.
-->

---
layout: default
---

# Outline

- Topic A
- Topic B
- Topic C

---
layout: section
---

::number::
PART 01

# First section

::subtitle::
Optional lede paragraph beneath the title.

---

# A content slide

Body content.

<CtpCallout label="Tip">
Use callouts to highlight a key takeaway.
</CtpCallout>

---
layout: end
---

# Thanks!

::meta::
Questions? Drop them in the CTP Upscaling channel.
`,
)

writeFileSync(
  join(targetDir, 'README.md'),
  `# Workshop ${numStr}, ${titleCase}

## Run locally

\`\`\`bash
pnpm --filter ./workshops/${dirName} dev
\`\`\`

## Build / export

\`\`\`bash
pnpm --filter ./workshops/${dirName} build       # static site → dist/
pnpm --filter ./workshops/${dirName} export      # PDF
\`\`\`

## Structure

- \`slides.md\`, the deck (edit this)
- \`snippets/\`, code samples the deck imports
- \`public/img/\`, workshop-specific images
- \`public/brand/\`, NYUAD lockup (mirrored from /shared/brand/)
- \`exercises/\`, hands-on exercises that pair with the deck
- \`components/\`, workshop-specific Vue components (optional)

See \`ctp-templates/slidev/README.md\` (sibling repo) for the full theme reference (layouts, components, tokens).
`,
)

writeFileSync(join(targetDir, 'components', '.gitkeep'), '')
writeFileSync(join(targetDir, 'snippets', '.gitkeep'), '')
writeFileSync(join(targetDir, 'public', 'img', '.gitkeep'), '')

writeFileSync(
  join(targetDir, 'exercises', 'README.md'),
  `# Workshop ${numStr}, Exercises

Add hands-on exercises here as the workshop content takes shape.

Suggested format:

## Exercise 1, title (~5 min)

1. Step one.
2. Step two.

**Stretch:** optional extension.
`,
)

// ----- Done ------------------------------------------------------------------

console.log(`Created workshops/${dirName}/`)
console.log()
console.log('Next steps:')
console.log(`  pnpm install                                           # register the new workspace package`)
console.log(`  pnpm --filter ./workshops/${dirName} dev               # run it`)
console.log()
console.log(`Then edit workshops/${dirName}/slides.md to author the deck.`)
