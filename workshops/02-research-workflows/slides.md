---
theme: ctp
routerMode: hash
title: "AI-Assisted Research Workflows: From Search Strategy to Evidence Brief"
author: CTP at NYUAD
info: |
  CTP Upscaling Workshop 02. AI-Assisted Research Workflows:
  From Search Strategy to Evidence Brief.

  A supervised research workflow using Codex with Scopus, Zotero,
  NotebookLM, and portable Markdown notes.
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: fade
mdc: true
layout: cover
---

# AI-Assisted Research Workflows

::eyebrow::
<span class="ctp-tag ctp-tag--accent">Workshop 02 · From Search Strategy to Evidence Brief</span>

::meta::
Core Technology Platforms · NYU Abu Dhabi · Date to be confirmed

<!--
Welcome participants and connect this session to Workshop 01. The first workshop used
Codex to edit the source of a presentation. This session uses Codex to help operate a
research workflow while the researcher remains responsible for the evidence.
-->

---
layout: default
---

# Research workflows came next

<p class="ws-lede">Most-requested topics in the CTP survey (n = 21).</p>

<div class="ws-bars">
  <div class="ws-bar-row">
    <span class="ws-bar-label ws-strong">Presentations &amp; communication</span>
    <span class="ws-bar-track"><span class="ws-bar-fill ws-bar-fill--lead" style="width:100%"></span></span>
    <span class="ws-bar-value ws-strong">13</span>
  </div>
  <div class="ws-bar-row">
    <span class="ws-bar-label ws-strong">Research workflows</span>
    <span class="ws-bar-track"><span class="ws-bar-fill" style="width:92%"></span></span>
    <span class="ws-bar-value ws-strong">12</span>
  </div>
  <div class="ws-bar-row">
    <span class="ws-bar-label">Data analysis</span>
    <span class="ws-bar-track"><span class="ws-bar-fill ws-bar-fill--soft" style="width:85%"></span></span>
    <span class="ws-bar-value">11</span>
  </div>
</div>

<p class="ws-takeaway">This workshop answers the second-most requested topic with a practical, traceable workflow.</p>

<!--
Research workflows received 12 selections, immediately behind presentations at 13.
The broader survey showed regular AI use but a mainly beginner-to-intermediate audience,
so the workflow must remain concrete and reviewable.

[Sources]
- CTP Upscaling Survey, n = 21, reproduced in Workshop 01 slides, 2026.
[/Sources]
-->

---
layout: default
class: ws-slide--finish
---

# A realistic finish line

<p class="ws-lede">One hour cannot produce a complete state-of-the-art review. It can produce a reliable starting point.</p>

<div class="ws-output-list">
  <div class="ws-output"><span class="ws-output-n">01</span><span>A documented search strategy</span></div>
  <div class="ws-output"><span class="ws-output-n">02</span><span>A curated starter corpus in Zotero</span></div>
  <div class="ws-output"><span class="ws-output-n">03</span><span>A source-grounded evidence matrix</span></div>
  <div class="ws-output"><span class="ws-output-n">04</span><span>A verified, portable evidence brief</span></div>
</div>

<CtpCallout class="ws-compact-callout" label="Scope" tone="sand">
The output is a rapid evidence brief, not a systematic review.
</CtpCallout>

<!--
Set expectations early. A systematic review requires a protocol, multiple databases,
screening, deduplication, appraisal, and complete reporting. Today creates a traceable
starting point that can be extended into that process.
-->

---
layout: default
---

# Map first, then build

<div class="ws-agenda">
  <section class="ws-agenda-part">
    <span class="ctp-eyebrow">Part A · About 20 minutes</span>
    <h2>THE EVIDENCE CHAIN</h2>
    <p>Questions, search boundaries, delegation, and verification.</p>
  </section>
  <div class="ws-agenda-arrow">→</div>
  <section class="ws-agenda-part ws-agenda-part--active">
    <span class="ctp-eyebrow">Part B · About 40 minutes</span>
    <h2>THE PRACTICAL WORKFLOW</h2>
    <p>Codex, Scopus, Zotero, NotebookLM, and a durable brief.</p>
  </section>
</div>

<p class="ws-takeaway">The practical work starts only after the research boundary is explicit.</p>

<!--
Keep this fast. Part A is a map, not a tool catalogue. Part B applies that map to one
shared research question. Participants should know that most of the hour is practical.
-->

---
layout: section
---

::number::
PART A

# Research Before Automation

::subtitle::
The agent can accelerate the process. The researcher still owns the evidence.

<!--
Use this divider to make the central principle explicit. An agent can operate the
workflow, but it cannot inherit accountability for the research claim.
-->

---
layout: default
---

# A state of the art is a chain of custody

<div class="ws-flow">
  <div class="ws-flow-step"><span>01</span><strong>Question</strong><small>What is being asked?</small></div>
  <div class="ws-flow-arrow">→</div>
  <div class="ws-flow-step"><span>02</span><strong>Search</strong><small>Where and how?</small></div>
  <div class="ws-flow-arrow">→</div>
  <div class="ws-flow-step"><span>03</span><strong>Corpus</strong><small>What was selected?</small></div>
  <div class="ws-flow-arrow">→</div>
  <div class="ws-flow-step"><span>04</span><strong>Claims</strong><small>What does it support?</small></div>
  <div class="ws-flow-arrow">→</div>
  <div class="ws-flow-step"><span>05</span><strong>Brief</strong><small>What remains uncertain?</small></div>
</div>

<p class="ws-takeaway">Every conclusion should be traceable back through the chain.</p>

<!--
This is the workshop's backbone. If a claim cannot be traced to the selected source,
the search that found it, and the question that framed it, the workflow has lost
provenance.
-->

---
layout: default
---

# The search tool sets the horizon

<table class="ws-table ws-table--tools">
  <thead>
    <tr><th>Tool</th><th>Best use</th><th>Search universe</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Scopus</strong></td><td>Reproducible, fielded searching</td><td>Indexed scholarly literature</td></tr>
    <tr><td><strong>Consensus</strong></td><td>Natural-language academic discovery</td><td>Research-paper corpus</td></tr>
    <tr><td><strong>Perplexity</strong></td><td>Current context and reconnaissance</td><td>Broad web sources</td></tr>
  </tbody>
</table>

<CtpCallout class="ws-compact-callout" label="Principle" tone="violet">
The same question can produce different answers because each tool can see a different world.
</CtpCallout>

<!--
Scopus is the core discovery surface today because it supports a documented search
strategy. Consensus and Perplexity remain useful, but they answer different discovery
needs. Name specialist databases such as PubMed when relevant to the discipline.

[Sources]
- Elsevier, "How can I best use the Advanced search?", Scopus Support Center, accessed 2026-07-29, https://service.elsevier.com/app/answers/detail/a_id/11365/supporthub/scopus/~/how-can-i-best-use-the-advanced-search/
- Consensus, "How Consensus Works", accessed 2026-07-29, https://help.consensus.app/en/articles/9922673-how-consensus-works
- Perplexity, "What is Perplexity?", accessed 2026-07-29, https://www.perplexity.ai/help-center/en/articles/10352155-what-is-perplexity
[/Sources]
-->

---
layout: two-cols-header
---

# Human judgment stays in the loop

::left::

### THE RESEARCHER OWNS

- The research question
- Inclusion and exclusion criteria
- Relevance and quality judgments
- Interpretation and final claims
- The decision to stop

::right::

### CODEX CAN ACCELERATE

- Concept blocks and synonyms
- Query drafting and refinement
- Repetitive browser navigation
- Search logging and source tables
- Formatting the handoff

<!--
The division is deliberate. Codex handles repeatable operations and proposes structure.
The researcher approves the protocol, judges relevance, and accepts or rejects claims.
This is supervised agentic research, not autonomous scholarship.
-->

---
layout: default
---

# Set the boundary before Scopus

<div class="ws-boundary">
  <div><span class="ctp-eyebrow">Question</span><strong>What relationship or capability is being investigated?</strong></div>
  <div><span class="ctp-eyebrow">Coverage</span><strong>Years, disciplines, languages, and document types</strong></div>
  <div><span class="ctp-eyebrow">Evidence</span><strong>Reviews, primary studies, standards, or technical reports</strong></div>
  <div><span class="ctp-eyebrow">Exclusions</span><strong>What is outside scope, and why?</strong></div>
</div>

<p class="ws-takeaway">Without a boundary, every refinement is arbitrary.</p>

<!--
Ask participants to notice that these are research decisions, not prompt decorations.
The search strategy should change only when the reason for changing it is recorded.
-->

---
layout: default
---

# A citation must pass three tests

<div class="ws-tests">
  <section><span class="ws-test-n">01</span><h2>EXISTS</h2><p>Is the source real and correctly identified?</p></section>
  <section><span class="ws-test-n">02</span><h2>ENTAILS</h2><p>Does the cited passage actually support the claim?</p></section>
  <section><span class="ws-test-n">03</span><h2>FITS</h2><p>Is the study design and context adequate for this conclusion?</p></section>
</div>

<p class="ws-takeaway">A clickable citation is the beginning of verification, not the end.</p>

<!--
Walk through the three checks using one simple example. "Exists" catches fabricated or
misidentified sources. "Entails" catches citation mismatch. "Fits" catches overclaiming
from a weak design, narrow sample, or different context.
-->

---
layout: default
class: ws-slide--agent-brief
---

# Brief the agent before it acts

```text
Do not search yet.
1. Convert the question into concept blocks and synonyms.
2. Draft a Scopus TITLE-ABS-KEY query.
3. Propose coverage and exclusion criteria.
4. Flag assumptions and ask for approval.

After approval, log every query, filter, date, and result count.
Never discard results or change scope silently.
```

<p class="ws-takeaway">Proposal first. Approval second. Execution third.</p>

<!--
The full facilitator prompt is in exercises/README.md. The important control pattern is
that Codex proposes the protocol before using the browser. Approval is a research
checkpoint, not merely a website permission.
-->

---
layout: default
---

# Protect the material, not just the account

<div class="ws-safety">
  <div><span class="ctp-eyebrow">LOWER RISK</span><strong>Published open-access papers</strong><small>Still verify the license and source.</small></div>
  <div><span class="ctp-eyebrow">CHECK FIRST</span><strong>Licensed PDFs and unpublished manuscripts</strong><small>Confirm policy, rights, and collaborator consent.</small></div>
  <div><span class="ctp-eyebrow">KEEP OUT</span><strong>Personal data, participant data, confidential IP</strong><small>Do not upload without explicit authorization and an approved environment.</small></div>
</div>

<CtpCallout label="Workshop rule" tone="sand">
The practical exercise uses a prepared open-access source pack.
</CtpCallout>

<!--
Keep this conservative and practical. The governing NYU policy, publisher license, ethics
approval, and collaboration agreement take precedence over any tool capability. Do not
present this slide as a substitute for institutional data governance.
-->

---
layout: section
---

::number::
PART B

# From Search to Evidence Brief

::subtitle::
A supervised workflow using Codex, Scopus, Zotero, NotebookLM, and Markdown.

<!--
Move into the practical sequence. The live Scopus portion is instructor-led so the group
shares one authenticated session and one visible decision trail. Participants then work
with the same exported source set.
-->

---
layout: default
---

# One workflow, clear ownership

<div class="ws-pipeline">
  <div><span>Codex</span><strong>Plan and operate</strong></div>
  <b>→</b>
  <div><span>Scopus</span><strong>Find and refine</strong></div>
  <b>→</b>
  <div><span>Zotero</span><strong>Keep and cite</strong></div>
  <b>→</b>
  <div><span>NotebookLM</span><strong>Compare and question</strong></div>
  <b>→</b>
  <div><span>Researcher</span><strong>Verify and conclude</strong></div>
</div>

<p class="ws-takeaway">The original sources and Zotero library remain canonical. Every AI output is derived.</p>

<!--
This is the practical map. Make the source-of-truth distinction explicit: Scopus helps
find sources, Zotero preserves the source records, NotebookLM produces working analysis,
and the researcher decides what survives into the brief.

[Sources]
- Zotero, "The Basics", accessed 2026-07-29, https://www.zotero.org/support/quick_start_guide
- Google, "Use chat in NotebookLM", accessed 2026-07-29, https://support.google.com/notebooklm/answer/16179559
[/Sources]
-->

---
layout: default
---

# Exercise 1 · Scope the search

<p class="ws-lede">In pairs, turn the shared question into a protocol the agent can follow.</p>

<div class="ws-exercise">
  <div><span>1</span><strong>Write the question in one sentence.</strong></div>
  <div><span>2</span><strong>Define the concepts, coverage, and exclusions.</strong></div>
  <div><span>3</span><strong>Choose what the first-pass corpus should contain.</strong></div>
</div>

<CtpCallout label="Five-minute checkpoint" tone="accent">
Another pair should be able to apply the protocol without asking what you meant.
</CtpCallout>

<!--
Give participants five minutes. Use the prepared question if the group does not have a
shared topic. Ask two pairs to name one ambiguity they resolved.
-->

---
layout: default
---

# Codex proposes; the researcher approves

<div class="ws-browser-steps">
  <div><span class="ws-step-num">01</span><p><strong>Draft</strong><br>Codex proposes concept blocks, synonyms, and a Scopus query.</p></div>
  <div><span class="ws-step-num">02</span><p><strong>Review</strong><br>The researcher corrects scope and approves the protocol.</p></div>
  <div><span class="ws-step-num">03</span><p><strong>Operate</strong><br>Codex uses the signed-in Scopus session and records each action.</p></div>
  <div><span class="ws-step-num">04</span><p><strong>Checkpoint</strong><br>The researcher approves refinements and the final shortlist.</p></div>
</div>

<p class="ws-takeaway">Use <code>@Chrome</code> when the Scopus session is already authenticated in Chrome.</p>

<!--
Run this live. Open Codex beside Scopus, provide the approved agent brief, and insist that
the first response is a proposed query rather than browser action. The Chrome extension
can work with sites where the user is already signed in. The built-in browser uses a
separate profile and can be signed in separately.

[Sources]
- OpenAI, "Chrome extension", accessed 2026-07-29, https://learn.chatgpt.com/docs/chrome-extension
- OpenAI, "Browser", accessed 2026-07-29, https://learn.chatgpt.com/docs/browser
[/Sources]
-->

---
layout: two-cols-header
---

# Scopus queries have a grammar

::left::

```text
TITLE-ABS-KEY(
  ("large language model*" OR LLM*)
  AND
  ("literature review" OR "evidence synthesis")
)
AND PUBYEAR > 2020
```

::right::

### READ IT ALOUD

- Field: title, abstract, keywords
- Concepts: grouped with parentheses
- Synonyms: joined with `OR`
- Concepts: joined with `AND`
- Coverage: applied explicitly

<!--
This is an illustrative query, not the final workshop topic. Show how each block maps
back to the approved protocol. Scopus supports field codes plus Boolean and proximity
operators. Not every record contains every field, so narrow field selection can also
exclude relevant material.

[Sources]
- Elsevier, "How can I best use the Advanced search?", Scopus Support Center, accessed 2026-07-29, https://service.elsevier.com/app/answers/detail/a_id/11365/supporthub/scopus/~/how-can-i-best-use-the-advanced-search/
[/Sources]
-->

---
layout: default
---

# Refine without losing the history

<table class="ws-table ws-table--log">
  <thead><tr><th>Run</th><th>Change</th><th>Results</th><th>Reason</th></tr></thead>
  <tbody>
    <tr><td>01</td><td>Initial approved query</td><td>642</td><td>Baseline</td></tr>
    <tr><td>02</td><td>Reviews + articles, 2021-2026</td><td>188</td><td>Current evidence</td></tr>
    <tr><td>03</td><td>Add screening and synthesis terms</td><td>74</td><td>Improve relevance</td></tr>
  </tbody>
</table>

<CtpCallout label="Record every run" tone="violet">
Keep the exact query, filters, date, result count, and reason for the change.
</CtpCallout>

<!--
The numbers are illustrative and must be replaced by the live search results. Do not let
Codex silently improve the query. Each change needs a reason so another researcher can
reconstruct the search.
-->

---
layout: default
---

# Exercise 2 · Curate and transfer

<div class="ws-exercise ws-exercise--four">
  <div><span>1</span><strong>Shortlist 8-12 candidate sources.</strong></div>
  <div><span>2</span><strong>Record DOI, year, design, and relevance.</strong></div>
  <div><span>3</span><strong>Export the selected records as RIS.</strong></div>
  <div><span>4</span><strong>Import into a new Zotero collection.</strong></div>
</div>

<CtpCallout label="Ten-minute checkpoint" tone="accent">
Open two records in Zotero and verify the title, authors, year, DOI, and source.
</CtpCallout>

<!--
Use the facilitator's saved RIS file if the live export is delayed. Scopus can export
selected records as RIS, CSV, or BibTeX with different metadata fields. Zotero and its
Connector support standardized bibliographic imports including RIS.

[Sources]
- Elsevier, "What fields are used when exporting documents from Scopus?", accessed 2026-07-29, https://service.elsevier.com/app/answers/detail/a_id/14785/supporthub/scopus/kw/export/
- Zotero, "Importing Standardized Formats", accessed 2026-07-29, https://www.zotero.org/support/kb/importing_standardized_formats
[/Sources]
-->

---
layout: two-cols-header
---

# Zotero is the canonical library

::left::

### KEEP HERE

- Bibliographic metadata
- DOI and source links
- Full-text attachments
- Highlights and annotations
- Formal citations and bibliography

::right::

### CHECK BEFORE MOVING ON

- Duplicate records
- Missing or incorrect metadata
- Retracted or superseded work
- Full text versus abstract only
- Rights to reuse or upload the PDF

<!--
Zotero is not merely a holding folder. It keeps source identity, metadata, attachments,
notes, and citations together. The PDF reader can carry annotations into notes with links
back to the cited page.

[Sources]
- Zotero, "The Basics", accessed 2026-07-29, https://www.zotero.org/support/quick_start_guide
- Zotero, "Zotero PDF Reader and Note Editor", accessed 2026-07-29, https://www.zotero.org/support/pdf_reader
[/Sources]
-->

---
layout: default
---

# NotebookLM works on a bounded corpus

<div class="ws-corpus">
  <div class="ws-corpus-source"><span>Selected PDFs</span><small>Reviewed and permitted for upload</small></div>
  <div class="ws-corpus-source"><span>Reports or web sources</span><small>Added deliberately</small></div>
  <div class="ws-corpus-arrow">→</div>
  <div class="ws-corpus-notebook"><span>NotebookLM</span><strong>Answers from the active sources</strong><small>Inline citations return to supporting passages</small></div>
</div>

<p class="ws-takeaway">The quality of the synthesis cannot exceed the quality and coverage of the corpus.</p>

<!--
For this exercise, use only the prepared full-text packet. NotebookLM chat can ground its
answers in selected notebook sources and provides inline citations that navigate back to
the supporting passage. Those citations help verification but do not replace the Zotero
bibliography.

[Sources]
- Google, "Use chat in NotebookLM", accessed 2026-07-29, https://support.google.com/notebooklm/answer/16179559
- Google, "Add or discover new sources for your notebook", accessed 2026-07-29, https://support.google.com/notebooklm/answer/16215270
[/Sources]
-->

---
layout: default
---

# Exercise 3 · Build an evidence matrix

```text
Create an evidence matrix from the active sources.
For each source include: study design, context or sample,
key finding, limitation, and the exact supporting citation.

Then identify where the sources agree, disagree, or leave a gap.
Do not resolve conflicts that the sources do not resolve.
```

<CtpCallout label="Ten-minute checkpoint" tone="accent">
Every row must lead back to a passage in an uploaded source.
</CtpCallout>

<!--
Participants run this prompt in NotebookLM, inspect the matrix, and choose one agreement,
one disagreement, and one gap. Encourage them to disable irrelevant sources if the answer
starts to blend distinct contexts.
-->

---
layout: default
---

# Verify the claim, not the confidence

<div class="ws-verify">
  <div><span>01</span><strong>Open the citation.</strong><small>Read the supporting passage in context.</small></div>
  <div><span>02</span><strong>Inspect the study.</strong><small>Check design, population, comparison, and limitation.</small></div>
  <div><span>03</span><strong>Rewrite the claim.</strong><small>Match its strength to the available evidence.</small></div>
  <div><span>04</span><strong>Record uncertainty.</strong><small>Keep disagreements and gaps visible.</small></div>
</div>

<p class="ws-takeaway">Fluent language is not a measure of evidential strength.</p>

<!--
Verify at least two claims live. Ask participants to label each as supported, partially
supported, or unsupported. A cautious claim that matches the source is more useful than a
confident claim that outruns it.
-->

---
layout: two-cols-header
---

# Preserve the result outside the chat

::left::

```md
# Evidence brief

## Question and scope
## Search strategy
## Supported findings
## Conflicts and limitations
## Evidence gaps
## Next search
## References
```

::right::

<p class="ws-lede">One portable Markdown file carries the reasoning forward.</p>

- Zotero remains the source library
- The search log remains reproducible
- The brief can feed a report or proposal
- Obsidian can link and visualize related briefs

<!--
Copy only verified claims into the brief. The optional Obsidian demonstration is a
three-minute payoff: open the Markdown file, link two concepts, and show backlinks or the
local graph. Obsidian is a destination for durable notes, not a replacement for Zotero.

[Sources]
- Obsidian, "How Obsidian stores data", accessed 2026-07-29, https://obsidian.md/help/Files%2Band%2Bfolders/How%2BObsidian%2Bstores%2Bdata
- Obsidian, "Backlinks", accessed 2026-07-29, https://obsidian.md/help/plugins/backlinks
- Obsidian, "Graph view", accessed 2026-07-29, https://obsidian.md/help/plugins/graph
[/Sources]
-->

---
layout: default
---

# A good first pass leaves a trail

<div class="ws-final-list">
  <div><span>✓</span><strong>Research question and boundary</strong></div>
  <div><span>✓</span><strong>Exact Scopus queries, filters, dates, and counts</strong></div>
  <div><span>✓</span><strong>Curated Zotero collection with verified metadata</strong></div>
  <div><span>✓</span><strong>Evidence matrix with source-linked passages</strong></div>
  <div><span>✓</span><strong>Claims checked against context and limitations</strong></div>
  <div><span>✓</span><strong>Open disagreements, gaps, and next search</strong></div>
</div>

<p class="ws-takeaway">The test is not whether the workflow looks complete. It is whether another researcher can inspect it.</p>

<!--
Use this as the group debrief. Ask participants which part of the trail their current
workflow usually loses. Point them to exercises/README.md for the reusable prompts and
evidence-brief template.
-->

---
layout: end
---

# The agent accelerates the process. You own the evidence.

::meta::
Questions? Drop them in the CTP Upscaling channel.

<!--
Close by returning to the chain of custody. Codex can help plan and operate. Scopus,
Zotero, and NotebookLM each have a defined role. The researcher's responsibility is to
preserve provenance, verify claims, and state uncertainty honestly.
-->
