# Workshop 03 · Your AI forgets. Your vault doesn't.

Obsidian and Markdown as a shared, model-agnostic memory for AI-assisted work.
About 45 minutes plus Q&A (short slot: about 32 minutes), with a live demo of two
AIs working on one vault and a hands-on setup of a starter vault.

Live: https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/03-second-brain/

Take-home starter vault: https://nyuad-core-technology-platforms.github.io/ctp-upscaling-workshop-series/03-second-brain/starter-vault.zip (source in `starter-vault/`, see below).

## Run it

From the repository root:

```bash
pnpm install
pnpm dev:03        # live deck at http://localhost:3030
pnpm build:03      # static site in workshops/03-second-brain/dist
pnpm export:03     # PDF
```

Presenter view: `/presenter` (speaker notes and timer). Dark mode: `d`.

## What is different from the other decks

The deck keeps the CTP theme (cover, section and default layouts, footer, serif
titles, violet and gold, `CtpKbd`) and adds a deck-local visual layer:

- `style.css`: `sb-` prefixed cards, chips, mock windows, chat panes, checkpoint
  bars and entrance motion. Base states are final states, so print/PDF and
  reduced-motion show everything.
- `components/`: `VaultGraph` (drifting graph, cover and close), `HubDiagram`,
  `AgentLoop`, `StoresMap`, `WorkflowMap`, `CodeWin` (window with line-by-line
  reveal), `CountUp`, `TypeWriter`. All client-side, no libraries.

Motion restarts every time a slide is shown (Slidev mounts slides once and
toggles them with `v-show`, which restarts CSS animations).

## Before the session

See the speaker notes on slides 1, 17 and 24: demo vault, fresh AI sessions with
memory off, the old August chat, and the starter-vault link.

## Starter vault (take-home)

`starter-vault/` is the take-home second brain for attendees: `AGENTS.md` (the rules
for any AI tool), `CLAUDE.md` (a pointer to it), `index.md`, `decisions.md`, one
example project and one example meeting, `first-prompt.md` (the read-only prompt to
give an AI first) and `cheat-sheet.md`. Its own `README.md` has the seven setup steps.
No Obsidian template plugin is used: the example notes and `AGENTS.md` define the
note shapes.

`public/starter-vault.zip` is the same folder zipped, so the published site serves
it next to the deck (`<site>/03-second-brain/starter-vault.zip`). After editing the
folder, rebuild the zip from this directory:

```bash
python -c "import zipfile,os;z=zipfile.ZipFile('public/starter-vault.zip','w',zipfile.ZIP_DEFLATED);[z.write(os.path.join(r,f),os.path.join(r,f).replace(os.sep,'/')) for r,d,fs in os.walk('starter-vault') for f in sorted(fs)]"
```
