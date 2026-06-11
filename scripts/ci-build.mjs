#!/usr/bin/env node
/*
 * scripts/ci-build.mjs
 *
 * Build every workshop deck for publishing. Used by the GitHub Actions
 * workflows (.github/workflows/deploy-pages.yml and release.yml) and runnable
 * locally.
 *
 * Auto-discovers any folder matching workshops/NN-* (NN = digits) -- no need to
 * touch this script when you add a workshop with `pnpm new-workshop`.
 *
 * Modes
 * -----
 *   --mode pages   (default)   Combined static site for GitHub Pages:
 *       dist/index.html              landing page linking to each deck
 *       dist/<NN-slug>/              the interactive Slidev SPA build
 *       dist/<NN-slug>/slides.pdf    downloadable PDF (best-effort)
 *       dist/<NN-slug>/slides.pptx   downloadable PowerPoint (best-effort)
 *       dist/<NN-slug>/404.html      SPA fallback (prevents refresh 404s)
 *       dist/.nojekyll               stop GitHub Pages running Jekyll
 *
 *   --mode release             Per-deck artifacts for a GitHub Release:
 *       release/<NN-slug>.pdf        PDF export
 *       release/<NN-slug>.pptx       PowerPoint export
 *       release/<NN-slug>-html.zip   offline-openable HTML site (base "./")
 *
 * Options
 * -------
 *   --base <path>   Override the Pages base. Default "/<repo>/" derived from
 *                   $GITHUB_REPOSITORY, falling back to the repo folder name.
 *   --no-pdf        Skip PDF export (use when playwright-chromium isn't installed).
 *   --no-pptx       Skip PPTX export (same reason; both need playwright-chromium).
 *
 * Examples
 * --------
 *   node scripts/ci-build.mjs                       # Pages build, base from env
 *   node scripts/ci-build.mjs --base /repo/ --no-pdf
 *   node scripts/ci-build.mjs --mode release
 */

import {
  existsSync,
  statSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  rmSync,
} from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const workshopsDir = join(root, 'workshops')

// ----- Args ------------------------------------------------------------------

const args = process.argv.slice(2)
const getFlag = (name) => args.includes(name)
const getOpt = (name, fallback) => {
  const i = args.indexOf(name)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const mode = getOpt('--mode', 'pages')
const noPdf = getFlag('--no-pdf')
const noPptx = getFlag('--no-pptx')

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || basename(root)
let base = getOpt('--base', `/${repoName}/`)
if (!base.startsWith('/')) base = `/${base}`
if (!base.endsWith('/')) base = `${base}/`

// ----- Discover workshops ----------------------------------------------------

const workshops = readdirSync(workshopsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d+-/.test(d.name))
  .map((d) => d.name)
  .sort()

if (workshops.length === 0) {
  console.error('No workshops found under workshops/NN-*. Nothing to build.')
  process.exit(1)
}

console.log(`Mode: ${mode}`)
console.log(`Workshops: ${workshops.join(', ')}`)
if (mode === 'pages') console.log(`Base path: ${base}`)
console.log('')

// ----- Helpers ---------------------------------------------------------------

/** Pull the human title out of a deck's slides.md frontmatter. */
function deckTitle(name) {
  const slides = join(workshopsDir, name, 'slides.md')
  try {
    const text = readFileSync(slides, 'utf8')
    // CRLF-tolerant: decks are often authored on Windows.
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (fm) {
      const line = fm[1].split(/\r?\n/).find((l) => /^title:\s*/.test(l))
      if (line) {
        return line
          .replace(/^title:\s*/, '')
          .trim()
          .replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    /* fall through to slug title */
  }
  return name
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

/** Run a slidev subcommand inside a workshop package via pnpm. */
function slidev(name, slidevArgs) {
  execFileSync(
    'pnpm',
    ['--filter', `./workshops/${name}`, 'exec', 'slidev', ...slidevArgs],
    { cwd: root, stdio: 'inherit' },
  )
}

function buildSpa(name, deckBase, outDir) {
  console.log(`\n-> Building SPA: ${name}  (base ${deckBase})`)
  slidev(name, ['build', 'slides.md', '--base', deckBase, '--out', outDir])
}

/** True only if the path exists and is a non-empty file. */
function nonEmpty(p) {
  try {
    return existsSync(p) && statSync(p).size > 0
  } catch {
    return false
  }
}

function exportPdf(name, outFile) {
  if (noPdf) {
    console.log(`  (skipping PDF for ${name} -- --no-pdf)`)
    return
  }
  try {
    console.log(`-> Exporting PDF: ${name}`)
    slidev(name, ['export', 'slides.md', '--format', 'pdf', '--output', outFile])
  } catch (err) {
    // Don't let one deck's export failure sink the whole publish.
    console.warn(`  ! PDF export failed for ${name}: ${err.message}`)
  }
}

function exportPptx(name, outFile) {
  if (noPptx) {
    console.log(`  (skipping PPTX for ${name} -- --no-pptx)`)
    return
  }
  try {
    console.log(`-> Exporting PPTX: ${name}`)
    // --per-slide + a longer timeout make big decks export reliably in CI;
    // --no-with-clicks gives one image per slide (pptx defaults to one per click
    // step, which is slow, huge, and the usual cause of a failed/absent pptx).
    slidev(name, [
      'export', 'slides.md',
      '--format', 'pptx',
      '--output', outFile,
      '--per-slide',
      '--no-with-clicks',
      '--timeout', '90000',
    ])
  } catch (err) {
    // Best-effort, like PDF: a single deck's failure shouldn't sink the publish.
    console.warn(`  ! PPTX export failed for ${name}: ${err.message}`)
  }

  // Some Slidev versions ignore --output for pptx and drop the file in the deck
  // folder (e.g. slides-export.pptx). If the target is missing, recover it from
  // the known fallback locations so the served path always has the file.
  if (!nonEmpty(outFile)) {
    const deckDir = join(workshopsDir, name)
    const candidates = [
      join(deckDir, basename(outFile)),
      join(deckDir, 'slides-export.pptx'),
      join(deckDir, 'slides.pptx'),
      join(root, basename(outFile)),
      join(root, 'slides-export.pptx'),
    ]
    const found = candidates.find((p) => nonEmpty(p))
    if (found) {
      mkdirSync(dirname(outFile), { recursive: true })
      copyFileSync(found, outFile)
      if (resolve(found) !== resolve(outFile)) rmSync(found, { force: true })
      console.log(`   (recovered PPTX from ${found})`)
    }
  }

  console.log(`   PPTX ${nonEmpty(outFile) ? 'ready' : 'MISSING'} -> ${outFile}`)
}

// ----- Mode: pages -----------------------------------------------------------

function buildPages() {
  const distRoot = join(root, 'dist')
  rmSync(distRoot, { recursive: true, force: true })
  mkdirSync(distRoot, { recursive: true })

  const cards = []
  for (const name of workshops) {
    const deckBase = `${base}${name}/`
    const outDir = join(distRoot, name)
    buildSpa(name, deckBase, outDir)

    // SPA fallback so deep-link refreshes don't 404 on GitHub Pages.
    const indexHtml = join(outDir, 'index.html')
    if (existsSync(indexHtml)) copyFileSync(indexHtml, join(outDir, '404.html'))

    const pdfPath = join(outDir, 'slides.pdf')
    exportPdf(name, pdfPath)

    const pptxPath = join(outDir, 'slides.pptx')
    exportPptx(name, pptxPath)

    cards.push({
      name,
      title: deckTitle(name),
      hasPdf: nonEmpty(pdfPath),
      hasPptx: nonEmpty(pptxPath),
    })
  }

  writeFileSync(join(distRoot, '.nojekyll'), '')
  writeFileSync(join(distRoot, 'index.html'), landingPage(cards))
  console.log(`\nPages site ready in dist/ (${cards.length} deck(s)).`)
}

function landingPage(cards) {
  const items = cards
    .map(
      (c) => `      <li class="card">
        <a class="deck" href="./${c.name}/">
          <span class="num">${c.name.match(/^\d+/)?.[0] ?? ''}</span>
          <span class="title">${escapeHtml(c.title)}</span>
        </a>
        <span class="downloads">
          ${c.hasPdf ? `<a class="btn" href="./${c.name}/slides.pdf" download title="Download PDF">PDF</a>` : ''}
          ${c.hasPptx ? `<a class="btn" href="./${c.name}/slides.pptx" download title="Download PowerPoint">PPTX</a>` : ''}
        </span>
      </li>`,
    )
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CTP Upscaling Workshop Series</title>
  <style>
    :root { --violet:#57068c; --violet-dark:#330662; --ink:#1a1a1a; --muted:#6b6b76; --line:#e6e3ec; --bg:#faf9fc; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color:var(--ink); background:var(--bg); }
    header { background: linear-gradient(135deg, var(--violet-dark), var(--violet)); color:#fff; padding:3rem 1.5rem 2.5rem; }
    .wrap { max-width: 820px; margin: 0 auto; }
    header .eyebrow { text-transform:uppercase; letter-spacing:.14em; font-size:.72rem; opacity:.85; margin:0 0 .5rem; }
    header h1 { margin:0; font-size: clamp(1.5rem, 4vw, 2.25rem); line-height:1.15; }
    header p { margin:.75rem 0 0; opacity:.9; max-width:46ch; }
    main { padding: 2rem 1.5rem 4rem; }
    ul { list-style:none; margin:0; padding:0; display:grid; gap:.75rem; }
    .card { display:flex; align-items:stretch; gap:.5rem; }
    .deck { flex:1; display:flex; align-items:center; gap:1rem; padding:1rem 1.25rem; background:#fff; border:1px solid var(--line); border-radius:12px; text-decoration:none; color:var(--ink); transition: border-color .15s, transform .15s; }
    .deck:hover { border-color:var(--violet); transform: translateY(-1px); }
    .num { font-variant-numeric: tabular-nums; font-weight:700; color:var(--violet); background:#f1ecf7; border-radius:8px; padding:.35rem .6rem; font-size:.95rem; }
    .title { font-weight:600; }
    .downloads { display:flex; gap:.5rem; }
    .btn { display:flex; align-items:center; padding:0 1rem; background:#fff; border:1px solid var(--line); border-radius:12px; text-decoration:none; color:var(--violet); font-weight:600; font-size:.85rem; white-space:nowrap; }
    .btn:hover { border-color:var(--violet); }
    footer { color:var(--muted); font-size:.8rem; padding:0 1.5rem 3rem; }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <p class="eyebrow">Core Technology Platforms &middot; NYU Abu Dhabi</p>
      <h1>Upscaling Workshop Series</h1>
      <p>Interactive slides for each workshop. Open a deck to present in the browser, or download it as PDF or PowerPoint.</p>
    </div>
  </header>
  <main class="wrap">
    <ul>
${items}
    </ul>
  </main>
  <footer class="wrap">Built from the ctp-upscaling-workshop-series repo. Last published automatically on push to main.</footer>
</body>
</html>
`
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

// ----- Mode: release ---------------------------------------------------------

function buildRelease() {
  const releaseRoot = join(root, 'release')
  const tmpRoot = join(root, '.release-tmp')
  rmSync(releaseRoot, { recursive: true, force: true })
  rmSync(tmpRoot, { recursive: true, force: true })
  mkdirSync(releaseRoot, { recursive: true })
  mkdirSync(tmpRoot, { recursive: true })

  for (const name of workshops) {
    // Offline HTML: relative base so it opens from any folder / file path.
    const htmlDir = join(tmpRoot, name)
    buildSpa(name, './', htmlDir)
    const zipPath = join(releaseRoot, `${name}-html.zip`)
    console.log(`-> Zipping HTML: ${name}`)
    execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: htmlDir, stdio: 'inherit' })
    exportPdf(name, join(releaseRoot, `${name}.pdf`))
    exportPptx(name, join(releaseRoot, `${name}.pptx`))
  }

  rmSync(tmpRoot, { recursive: true, force: true })
  console.log(`\nRelease artifacts ready in release/.`)
}

// ----- Go --------------------------------------------------------------------

if (mode === 'pages') buildPages()
else if (mode === 'release') buildRelease()
else {
  console.error(`Unknown --mode "${mode}". Use "pages" or "release".`)
  process.exit(1)
}
