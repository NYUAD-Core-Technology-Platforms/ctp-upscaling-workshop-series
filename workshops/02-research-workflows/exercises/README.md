# Workshop 02, Exercises

These exercises create a reproducible search trail, a curated source library, and a
verified evidence brief. The facilitator supplies the shared research question, fallback
RIS export, and license-cleared source packet.

## Exercise 1, Scope the search (about 5 min)

Work in pairs.

1. Write the research question in one sentence.
2. Identify two to four concept blocks.
3. Add synonyms, acronyms, and spelling variants for each concept.
4. Define the date range, language, document types, and disciplinary boundary.
5. State what should be excluded and why.
6. Define the expected first-pass corpus and a stopping checkpoint.

Exchange the protocol with another pair. They should be able to apply it without asking
what any term means.

### Research-agent brief

Copy this into Codex and replace the bracketed fields:

```text
Help conduct a reproducible scoping search in Scopus.

Research question: [one sentence]
Purpose: [decision, evidence brief, proposal, or state-of-the-art starting point]
Coverage: [years, languages, disciplines, document types]
Include: [evidence types and concepts]
Exclude: [explicit exclusions and reasons]

Do not use the browser yet.

First:
1. Convert the question into concept blocks.
2. Propose synonyms, acronyms, and spelling variants.
3. Draft a Scopus TITLE-ABS-KEY query.
4. Explain how each block maps to the question.
5. Flag assumptions and ask for approval.

After approval:
- Use the signed-in Scopus session in Chrome.
- Record every exact query, filter, date, and result count.
- Explain and request approval for material scope changes.
- Never discard results or change the protocol silently.
- Shortlist 8-12 sources with DOI, year, study type, relevance, and uncertainty.
- Use standard Scopus export functions. Do not bulk-scrape or bypass site controls.
```

## Exercise 2, Curate and transfer (about 10 min)

The facilitator runs the approved query in Scopus with Codex.

1. Review the result set and record the initial count.
2. Apply only refinements justified by the protocol.
3. Add each refinement to the search log.
4. Shortlist 8-12 candidate records.
5. Record the DOI, year, document type, and relevance rationale.
6. Export the selected records as RIS.
7. Import the RIS file into a new Zotero collection.
8. Open at least two records and check title, authors, year, DOI, and publication source.
9. Merge duplicates or correct incomplete metadata.
10. Attach only full texts that are available and permitted for workshop use.

### Search-log template

| Run | Exact query or filter change | Date | Result count | Reason |
|---|---|---|---:|---|
| 01 |  |  |  | Initial approved protocol |
| 02 |  |  |  |  |
| 03 |  |  |  |  |

**Checkpoint:** another researcher should be able to reproduce the result set from the log.

## Exercise 3, Build and verify an evidence brief (about 15 min)

Use the prepared open-access full-text packet.

1. Create a new NotebookLM notebook.
2. Add the selected full texts.
3. Confirm the active source list before asking questions.
4. Run the evidence-matrix prompt below.
5. Select one agreement, one disagreement, and one evidence gap.
6. Open the supporting citations for at least two claims.
7. Read the cited passages in context.
8. Label each claim as supported, partially supported, or unsupported.
9. Rewrite any claim that is stronger than the evidence.
10. Copy only verified material into the evidence-brief template.

### Evidence-matrix prompt

```text
Create an evidence matrix from the active sources.

For each source include:
- Full source title
- Study design
- Population, sample, or technical context
- Key finding relevant to the research question
- Limitation stated or implied by the source
- Exact supporting citation

Then identify:
- Findings on which the sources agree
- Findings on which the sources disagree
- Questions the sources do not answer

Do not merge distinct study contexts.
Do not resolve conflicts that the sources do not resolve.
State when the active sources are insufficient.
```

### Evidence-brief template

```md
# Evidence brief

## Research question

## Scope and exclusions

## Search strategy
- Database:
- Search date:
- Final query:
- Filters:
- Results:
- Selected sources:

## Supported findings

## Conflicting or context-dependent findings

## Limitations

## Evidence gaps

## Next search

## References
```

## Optional extension, preserve the brief in Obsidian

1. Save the verified brief as a `.md` file.
2. Open it in an existing Obsidian vault.
3. Add links to two existing concepts or projects.
4. Inspect backlinks or the local graph.

Obsidian is the note and relationship layer. Zotero remains the bibliographic source and
citation layer.

## Facilitator fallback

If Scopus authentication, browser control, CAPTCHA, export, or publisher access interrupts
the live workflow:

1. Show the saved search log.
2. Import the prepared RIS file.
3. Continue from the prepared open-access source packet.

The exercise should never depend on bypassing access controls or redistributing restricted
publisher PDFs.
