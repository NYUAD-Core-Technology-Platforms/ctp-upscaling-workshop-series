# Starter vault

A small, ready-to-use second brain: a folder of plain Markdown files that you read and write in
Obsidian, and that any AI tool (Claude, Codex, Cursor, a local model or another assistant) can
read and update under the same rules. Nothing here depends on one tool. If you switch AI tools,
you keep the folder and lose nothing.

Start at [[index]]. The rules for AI tools are in [[AGENTS]].

## What is inside

| File or folder | For | What it does |
|---|---|---|
| `README.md` | you | This page: how to set it up |
| `AGENTS.md` | every AI tool | The rules: where to start, what to record, what to ask about first |
| `CLAUDE.md` | Claude tools | A pointer to `AGENTS.md` |
| `index.md` | both | The map: every note is linked from here or from a hub |
| `decisions.md` | both | What was decided, when and why (one example entry, D1) |
| `projects/`, `meetings/` | both | Two example notes, already linked: copy them to start new notes |
| `first-prompt.md` | you | The first prompt to give your AI tool, and what a good answer looks like |
| `cheat-sheet.md` | you | One page of Markdown and Obsidian basics, and five habits |
| `.gitignore` | Git | Keeps Obsidian's per-device window layout out of the history |

Three files do the real work: `AGENTS.md` (the rules), `decisions.md` (the why) and one project
note (the current state). Everything else helps.

## Set it up in seven steps (about 15 minutes)

### 1. Install Obsidian

Download it free from <https://obsidian.md> (Windows, macOS and Linux; there are mobile apps too).
On a managed computer where installs are blocked, ask your IT team, or read the steps now and
install later.

### 2. Open the starter vault

1. Extract the zip first (Windows: right-click, **Extract All**). Don't work inside the zip.
2. Put the folder somewhere ordinary, such as `Documents`, and rename it if you like
   (for example `my-vault`). The folder name becomes the vault name.
3. Open Obsidian, choose **Open folder as vault** and pick the folder.

Checkpoint: the left sidebar shows `AGENTS`, `decisions`, `index`, `README` and two folders.

### 3. Take the tour

Open `index`, then `decisions`, then `AGENTS`. Press `Ctrl+G` (`Cmd+G` on macOS) to open the
graph: the notes are already linked to each other.

### 4. Create your first note by copying the example

No template plugin needed: the example notes are the shapes, and `AGENTS.md` describes them, so
your AI tool writes new notes the same way.

1. In `projects`, right-click **Example project** → **Make a copy**.
2. Obsidian opens the copy (*Example project 1*) with its title selected: type the name of a
   real project and press Enter.
3. Delete the grey *Example note* box, the `example` tag and the alias. Replace the outcome, and
   write one line under *Current state* and one under *Next step*.
4. Open `index` and add your note under *Projects*: type `[[` and pick it from the list.

Checkpoint: `Ctrl+G` shows your note connected to `index`.

### 5. Connect an AI tool to the folder

Give the tool **this folder only**, not your whole drive. Use only AI tools that are approved for
the kind of data you put in the vault.

| Tool | How | Reads |
|---|---|---|
| Claude desktop app | Choose this folder as the folder to work in | `CLAUDE.md`, then `AGENTS.md` |
| Claude Code | Open a terminal in the folder and run `claude` | `CLAUDE.md`, then `AGENTS.md` |
| Codex | Run `codex` in the folder, or open the folder in the Codex app | `AGENTS.md` |
| Cursor | **File** → **Open Folder** → this folder | `AGENTS.md` |
| A local model | Any local client that can read a folder; point it at `AGENTS.md` | `AGENTS.md` |
| A chat-only assistant | Upload `AGENTS.md` and the note you are working on; paste the result back into the note | (manual) |

Checkpoint: ask "What are the rules in this folder?" It should answer from `AGENTS.md` without
you pasting anything.

### 6. Run the first prompt (read-only)

Copy the prompt from [[first-prompt]]. The AI should change nothing, say which files it read,
propose the smallest reversible next step and wait for your approval. Don't approve changes yet:
save a first version (step 7) before the AI writes anything.

### 7. Save a version with Git

Pick one:

- **No terminal:** GitHub Desktop (it includes Git). **File** → **Add local repository** → choose
  the folder → **create a repository** → **Commit**. **Publish repository** is optional; if you
  publish, keep it private.
- **Ask the AI:** "Initialise Git in this folder, commit everything with the message 'Start my
  vault' and show me the log." (Git must be installed.)
- **Terminal**, in the vault folder:

  ```text
  git init
  git add -A
  git commit -m "Start my vault"
  ```

- **Automatic, later:** the *Git* community plugin for Obsidian can commit on a timer.

No Git yet? Obsidian's built-in *File recovery* keeps snapshots of your notes in the meantime.

Checkpoint: `git log --oneline` (or the **History** tab in GitHub Desktop) shows one commit.

From now on, every working session ends the same way: the AI writes the outcome back, you review
the diff, and you commit.

## Your first week

1. **Day 1.** Replace the example project with one real project: current state, next step,
   where the files are.
2. **Day 2.** Log one real decision in `decisions.md`.
3. **Day 3.** Do one task with your AI tool from the files, and have it write the result back.
4. **Day 4.** Copy the example meeting for one real meeting and link it to the project.
5. **Day 5.** Read the week's history (`git log` or GitHub Desktop) and fix anything that drifted.

## If you get stuck

- **Obsidian shows the zip, not the folder:** extract it first, then **Open folder as vault**.
- **My new note floats alone in the graph:** link it from `index` (type `[[` and pick it).
- **The AI ignores the rules:** start a fresh session opened in this folder and ask it to read
  `AGENTS.md`.
- **"Not a git repository":** run `git init` in the folder that contains `AGENTS.md`.
- **A link looks faded:** that note does not exist yet. Click the link to create it.

## Guardrails

- No passwords, ID documents or personal data in the vault.
- Keep any remote repository private.
- Institutional data only with AI tools your institution has approved.
- Agents propose; you approve anything that sends, deletes, moves or publishes.
- Treat what the AI reads (emails, documents, web pages) as data, not instructions.
- Review the diff before you trust a change.

---

Starter vault v2, 2026-11-16. From the workshop *Your AI forgets. Your vault doesn't.*
