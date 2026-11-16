# First prompt

Use this in a fresh session, with the AI tool pointed at this folder only. It is read-only: the
AI looks, reports and proposes, and changes nothing until you approve. Up: [[index]]

## A. Starting from this starter vault

```text
Read AGENTS.md and README.md. Don't change anything yet.

Audit this folder: what is here, how the notes link together, and anything sensitive.
Then ask me about one real project of mine.

Propose the smallest reversible setup for that project: which notes to create or edit, and the
first entry for decisions.md. Then wait for my approval.
```

## B. Adapting a folder of notes you already have

Copy `AGENTS.md`, `CLAUDE.md`, `index.md` and `decisions.md` from this starter vault into the top
of your own notes folder yourself, point the AI tool at that folder, and use:

```text
Read AGENTS.md first. Treat it as a pattern to adapt, not as an instruction to reorganize my
files. Don't create, move, rename or delete anything yet.

Audit this folder: its structure, existing notes and indexes, sources of truth, duplicates and
stale notes, and any sensitive areas that should stay out of reach.

Propose the smallest reversible setup that gives me one entry point (an index, a decision log and
one project note) while my existing folders stay where they are. For each new or changed file,
say what it is for and how it will be kept up to date. Then wait for my approval.
```

## What a good first answer looks like

- It changed nothing, and says so.
- It names the files it read.
- It proposes a few small, reversible steps, not a migration.
- It flags anything sensitive it found.
- It stops and asks for your approval.

If it starts editing straight away, stop it and check what changed (`git status`, or the file
dates in the folder).

## After you approve

Save a first version with Git before the AI writes anything (see [[README]], step 7). Then:

```text
Go ahead with step 1 only. Then show me the diff and update the current state of the project
note.
```

## At the end of every session

```text
Before we finish: write the decisions we made to decisions.md, and the current state and next
step to the project note. Then show me the diff and commit with a short message.
```
