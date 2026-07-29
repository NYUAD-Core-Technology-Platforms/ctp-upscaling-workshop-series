# Workshop 02, AI-Assisted Research Workflows

**From Search Strategy to Evidence Brief**

The second session in the CTP Upscaling Workshop Series. It builds on the Codex
introduction in Workshop 01 and applies supervised browser work to research:

1. Define a research question and search protocol.
2. Use Codex with an authenticated Scopus session to propose, run, and document a search.
3. Preserve the selected records in Zotero.
4. Interrogate selected full texts in NotebookLM.
5. Verify the claims and save a portable Markdown evidence brief.

The session produces a reproducible starting point, not a completed systematic review.

## Run locally

From the workshop-series repo root:

```bash
pnpm dev:02
```

The long form is:

```bash
pnpm --filter ./workshops/02-research-workflows dev
```

Open `http://localhost:3030/presenter` in a second tab for speaker notes.

## Workshop structure

The session is designed for approximately 60 minutes:

| Part | Focus | Approximate time |
|---|---|---:|
| A | Evidence chain, research boundaries, delegation, verification | 20 min |
| B | Codex + Scopus, Zotero, NotebookLM, Markdown | 40 min |

Part B is practical. The Scopus browser segment is instructor-led but participatory.
Participants then work individually or in pairs from the same RIS export and open-access
source pack.

## Practical outputs

Each participant or pair should finish with:

- A research question with explicit coverage and exclusions
- An exact Scopus search log with dates, filters, result counts, and reasons
- A curated Zotero collection with checked metadata
- A NotebookLM evidence matrix linked to supporting passages
- A Markdown evidence brief containing verified findings, conflicts, limitations, and gaps

The full activity instructions and reusable prompts are in
[`exercises/README.md`](exercises/README.md).

## Facilitator preflight

Complete these checks before delivery:

1. Confirm Codex can use `@Chrome` with the intended Chrome profile.
2. Sign into Scopus through the institutional access route and run a test query.
3. Confirm the Scopus query, export, and RIS import in Zotero.
4. Confirm NotebookLM access with the intended participant accounts.
5. Prepare a license-cleared packet of four to six open-access papers.
6. Prepare a fallback RIS file and a saved copy of the search log.
7. Confirm no source pack contains confidential, personal, participant, or unpublished data.
8. Run the deck and click through every slide in normal and dark mode.

Do not depend on live authentication, bulk PDF downloads, or a paid-only feature for
the session to continue.

## Source-pack criteria

The shared packet should contain:

- Four to six open-access full-text papers
- One review plus several primary studies
- At least one disagreement, limitation, or difference in study context
- Complete DOI and bibliographic metadata
- A topic understandable across CTP disciplines
- Redistribution terms suitable for the workshop

The final topic and papers remain to be selected. The slides use an illustrative query
about large language models and evidence synthesis only to explain Scopus syntax.

## Build and export

```bash
pnpm build:02
pnpm export:02
pnpm export:02:pptx
```

The filtered forms are:

```bash
pnpm --filter ./workshops/02-research-workflows build
pnpm --filter ./workshops/02-research-workflows export
pnpm --filter ./workshops/02-research-workflows export:pptx
```

Build artifacts, exported PDFs, exported PowerPoint files, and `node_modules/` are not
committed.

## Folder contents

- `slides.md`: audience-facing deck and presenter notes
- `style.css`: workshop-specific structures using CTP theme tokens
- `exercises/README.md`: guided exercises, prompts, and evidence-brief template
- `public/img/`: workshop-specific images, if later required
- `public/brand/`: NYUAD lockup copied by the scaffold
- `components/`: optional workshop-specific Vue components
- `snippets/`: long reusable examples, if later required

All theme, layout, component, font, and brand changes remain in the sibling
`ctp-templates` repository.
