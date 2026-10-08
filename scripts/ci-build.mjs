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
const useShell = process.platform === 'win32'

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

/**
 * Pull deck metadata out of a deck's slides.md headmatter: title, author,
 * date (optional `date:` key, YYYY-MM-DD) and the first paragraph of `info`.
 * Tolerant of CRLF (decks are often authored on Windows) and of missing keys.
 */
function deckMeta(name) {
  const fallbackTitle = name
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
  const meta = { title: fallbackTitle, author: '', date: '', description: '' }
  const slides = join(workshopsDir, name, 'slides.md')
  let fm = ''
  try {
    const text = readFileSync(slides, 'utf8')
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (m) fm = m[1]
  } catch {
    return meta
  }
  const lines = fm.split(/\r?\n/)
  const scalar = (key) => {
    const line = lines.find((l) => new RegExp(`^${key}:\\s*`).test(l))
    if (!line) return ''
    return line
      .replace(new RegExp(`^${key}:\\s*`), '')
      .trim()
      .replace(/^["']|["']$/g, '')
  }
  meta.title = scalar('title') || meta.title
  meta.author = scalar('author')
  meta.date = scalar('date')
  // `info: |` block scalar: take the indented lines that follow, first paragraph only.
  const infoIdx = lines.findIndex((l) => /^info:\s*[|>]?\s*$/.test(l))
  if (infoIdx !== -1) {
    const block = []
    for (const l of lines.slice(infoIdx + 1)) {
      if (/^\S/.test(l)) break
      block.push(l.trim())
    }
    const paras = block.join('\n').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean)
    // The first paragraph usually restates the title ("CTP Upscaling Workshop NN. Title."); prefer the next one.
    meta.description = paras.find((p) => !p.startsWith('CTP Upscaling Workshop')) || paras[0] || ''
  }
  return meta
}

/** Format YYYY-MM-DD as "8 October 2026"; pass anything else through. */
function prettyDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return iso || ''
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** Run a slidev subcommand inside a workshop package via pnpm. */
function slidev(name, slidevArgs) {
  execFileSync(
    'pnpm',
    ['--filter', `./workshops/${name}`, 'exec', 'slidev', ...slidevArgs],
    { cwd: root, stdio: 'inherit', shell: useShell },
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
      ...deckMeta(name),
      hasPdf: nonEmpty(pdfPath),
      hasPptx: nonEmpty(pptxPath),
    })
  }

  // Brand asset for the landing page, mirrored from the first deck's public/brand/.
  const logoSrc = workshops
    .map((n) => join(workshopsDir, n, 'public', 'brand', 'nyuad-logo.png'))
    .find((p) => nonEmpty(p))
  if (logoSrc) {
    mkdirSync(join(distRoot, 'brand'), { recursive: true })
    copyFileSync(logoSrc, join(distRoot, 'brand', 'nyuad-logo.png'))
  }

  writeFileSync(join(distRoot, '.nojekyll'), '')
  writeFileSync(join(distRoot, 'index.html'), landingPage(cards, Boolean(logoSrc)))
  console.log(`\nPages site ready in dist/ (${cards.length} deck(s)).`)
}

function landingPage(cards, hasLogo) {
  const num = (c) => c.name.match(/^\d+/)?.[0] ?? ''
  const links = (c) =>
    [
      `<a class="btn btn--primary" href="./${c.name}/">Open slides</a>`,
      c.hasPdf ? `<a class="btn" href="./${c.name}/slides.pdf" download title="Download PDF">PDF</a>` : '',
      c.hasPptx ? `<a class="btn" href="./${c.name}/slides.pptx" download title="Download PowerPoint">PPTX</a>` : '',
    ]
      .filter(Boolean)
      .join('\n            ')
  const byline = (c) => [c.author, prettyDate(c.date)].filter(Boolean).map(escapeHtml).join(' · ')

  // Most recent workshop (highest number) is featured at the top.
  const latest = cards[cards.length - 1]
  const featured = latest
    ? `    <section class="featured" aria-labelledby="featured-title">
      <p class="eyebrow eyebrow--gold">Latest workshop</p>
      <div class="featured__grid">
        <div>
          <span class="tag">Workshop ${num(latest)}</span>
          <h2 id="featured-title" class="featured__title"><a href="./${latest.name}/">${escapeHtml(latest.title)}</a></h2>
          ${byline(latest) ? `<p class="featured__meta">${byline(latest)}</p>` : ''}
          ${latest.description ? `<p class="featured__lede">${escapeHtml(latest.description)}</p>` : ''}
          <div class="actions">
            ${links(latest)}
          </div>
        </div>
        <a class="featured__preview" href="./${latest.name}/" aria-label="Open the slides for workshop ${num(latest)}">
          <span class="featured__preview-num">${num(latest)}</span>
          <span class="featured__preview-text">Interactive deck<br>opens in the browser</span>
        </a>
      </div>
    </section>`
    : ''

  const rows = cards
    .slice()
    .reverse()
    .map(
      (c) => `      <li class="row">
        <span class="row__num">${num(c)}</span>
        <div class="row__body">
          <a class="row__title" href="./${c.name}/">${escapeHtml(c.title)}</a>
          ${byline(c) ? `<p class="row__meta">${byline(c)}</p>` : ''}
        </div>
        <div class="row__links">
          ${c.hasPdf ? `<a class="link" href="./${c.name}/slides.pdf" download>PDF</a>` : ''}
          ${c.hasPptx ? `<a class="link" href="./${c.name}/slides.pptx" download>PPTX</a>` : ''}
          <a class="link link--strong" href="./${c.name}/">Slides</a>
        </div>
      </li>`,
    )
    .join('\n')

  const published = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

  // Visual language follows ctp-templates/shared/brand/DESIGN_SYSTEM.md:
  // NYU violet, serif display, Inter body, hairlines, squared corners, gold only
  // for the editorial eyebrow. Tokens are inlined because this page is built
  // outside the Slidev theme.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CTP Upscaling Workshop Series</title>
  <meta name="description" content="Interactive slides, PDFs and PowerPoint downloads for the Core Technology Platforms upscaling workshops at NYU Abu Dhabi." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --nyu-violet: #57068C; --violet-700: #3D0462; --violet-800: #2D0349; --violet-900: #1F0233;
      --violet-300: #A06DCB; --violet-200: #C9A6E0; --violet-100: #E8D9F2; --violet-050: #F6F0FB;
      --ink-900: #111111; --ink-600: #555555; --ink-500: #6F6F6F; --ink-300: #BDBDBD; --ink-200: #DDDDDD; --ink-050: #F7F7F7;
      --gold: #C99A1E; --sand: #F2EBDD; --white: #FFFFFF;
      --font-sans: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      --font-serif: 'Source Serif 4', 'Times New Roman', Times, serif;
      --tracked: 0.18em; --tracked-sm: 0.08em;
    }
    * { box-sizing: border-box; }
    html { background: var(--white); }
    body { margin: 0; font-family: var(--font-sans); color: var(--ink-900); background: var(--white); line-height: 1.5; -webkit-font-smoothing: antialiased; }
    a { color: var(--nyu-violet); }
    .wrap { max-width: 960px; margin: 0 auto; padding: 0 24px; }
    .eyebrow { margin: 0 0 12px; font-size: 12px; font-weight: 600; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--nyu-violet); }
    .eyebrow--gold { color: var(--gold); }
    .eyebrow--gold::after { content: ""; display: block; width: 48px; height: 2px; margin-top: 10px; background: var(--gold); }
    .tag { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: var(--tracked-sm); text-transform: uppercase; color: var(--gold); border: 1px solid var(--gold); border-radius: 999px; padding: 2px 10px; margin-bottom: 14px; }

    /* Hero */
    .hero { background: var(--violet-700); color: var(--white); padding: 40px 0 48px; border-bottom: 1px solid var(--violet-800); }
    .hero .wrap { display: flex; flex-direction: column; gap: 28px; }
    .logo { display: inline-flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .logo img { height: 34px; width: auto; filter: brightness(0) invert(1); display: block; }
    .logo span { font-size: 12px; font-weight: 600; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--violet-200); }
    .hero h1 { margin: 0; font-family: var(--font-serif); font-size: clamp(36px, 5vw, 60px); font-weight: 700; line-height: 1.08; letter-spacing: -0.01em; color: var(--white); max-width: 16ch; text-wrap: pretty; }
    .hero p { margin: 0; font-family: var(--font-serif); font-size: 18px; line-height: 1.6; color: var(--violet-200); max-width: 52ch; }
    .hero .eyebrow { color: var(--gold); margin: 0; }

    /* Featured */
    .featured { padding: 40px 0 24px; border-bottom: 1px solid var(--ink-200); }
    .featured__grid { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 32px; align-items: stretch; }
    .featured__title { margin: 0 0 8px; font-family: var(--font-serif); font-size: clamp(26px, 3.4vw, 36px); font-weight: 700; line-height: 1.15; letter-spacing: -0.005em; text-wrap: pretty; }
    .featured__title a { color: var(--ink-900); text-decoration: none; }
    .featured__title a:hover { color: var(--nyu-violet); }
    .featured__meta { margin: 0 0 14px; font-size: 14px; color: var(--ink-600); }
    .featured__lede { margin: 0 0 20px; font-family: var(--font-serif); font-size: 17px; line-height: 1.6; color: var(--ink-900); max-width: 58ch; }
    .featured__preview { display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 20px; background: var(--violet-900); border: 1px solid var(--violet-700); border-radius: 4px; text-decoration: none; color: var(--white); min-height: 180px; transition: border-color .15s; }
    .featured__preview:hover { border-color: var(--gold); }
    .featured__preview-num { font-family: var(--font-serif); font-size: 72px; font-weight: 700; line-height: 1; color: var(--violet-200); }
    .featured__preview-text { font-size: 12px; font-weight: 600; letter-spacing: var(--tracked-sm); text-transform: uppercase; color: var(--violet-200); line-height: 1.5; }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; }
    .btn { display: inline-flex; align-items: center; padding: 9px 16px; font-size: 14px; font-weight: 600; color: var(--nyu-violet); background: var(--white); border: 1px solid var(--ink-300); border-radius: 4px; text-decoration: none; transition: border-color .15s, background .15s; }
    .btn:hover { border-color: var(--nyu-violet); background: var(--violet-050); }
    .btn--primary { color: var(--white); background: var(--nyu-violet); border-color: var(--nyu-violet); }
    .btn--primary:hover { background: var(--violet-700); border-color: var(--violet-700); }

    /* Index */
    .index { padding: 32px 0 56px; }
    .index h2 { margin: 0 0 8px; font-size: 13px; font-weight: 700; letter-spacing: var(--tracked); text-transform: uppercase; color: var(--ink-600); }
    ul.rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--ink-200); }
    .row { display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--ink-200); }
    .row__num { font-family: var(--font-serif); font-size: 26px; font-weight: 700; color: var(--violet-300); line-height: 1; }
    .row__title { font-size: 17px; font-weight: 600; color: var(--ink-900); text-decoration: none; }
    .row__title:hover { color: var(--nyu-violet); text-decoration: underline; text-underline-offset: 3px; }
    .row__meta { margin: 2px 0 0; font-size: 13px; color: var(--ink-600); }
    .row__links { display: flex; gap: 14px; font-size: 13px; }
    .link { color: var(--ink-600); text-decoration: none; font-weight: 500; }
    .link:hover { color: var(--nyu-violet); text-decoration: underline; text-underline-offset: 3px; }
    .link--strong { color: var(--nyu-violet); font-weight: 600; }

    footer { border-top: 1px solid var(--ink-200); padding: 20px 0 40px; font-size: 12px; color: var(--ink-500); }
    footer a { color: var(--ink-600); }
    @media (max-width: 640px) {
      .featured__grid { grid-template-columns: 1fr; }
      .featured__preview { min-height: 0; flex-direction: row; align-items: center; gap: 16px; }
      .featured__preview-num { font-size: 44px; }
      .row { grid-template-columns: 40px minmax(0, 1fr); }
      .row__links { grid-column: 2; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="wrap">
      ${hasLogo ? `<div class="logo"><img src="./brand/nyuad-logo.png" alt="NYU Abu Dhabi" /><span>Core Technology Platforms</span></div>` : `<p class="eyebrow">Core Technology Platforms · NYU Abu Dhabi</p>`}
      <div>
        <p class="eyebrow">Workshop series</p>
        <h1>Upscaling with AI, one workshop at a time.</h1>
      </div>
      <p>Hands-on sessions for the CTP team: presentations, facility operations, simulations and analysis built with AI assistance. Open a deck to present in the browser, or download it as PDF or PowerPoint.</p>
    </div>
  </header>

  <main class="wrap">
${featured}
    <section class="index" aria-labelledby="index-title">
      <h2 id="index-title">All workshops</h2>
      <ul class="rows">
${rows}
      </ul>
    </section>
  </main>

  <footer class="wrap">Built from <a href="https://github.com/NYUAD-Core-Technology-Platforms/ctp-upscaling-workshop-series">ctp-upscaling-workshop-series</a> with the <a href="https://github.com/NYUAD-Core-Technology-Platforms/ctp-templates">CTP Slidev theme</a>. Published automatically on push to main · ${published}.</footer>
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
