# Workshop 01 — Exercises

Three short exercises that pair with the slides. Each one stands alone — skip any that aren't relevant.

## Exercise 1 — Your first deck (5 min)

1. Make a new folder and `cd` into it.
2. Run `npm init slidev@latest` and accept the defaults.
3. `npm install`
4. `npm run dev`
5. Open the URL it prints. You should see the default Slidev intro deck.
6. Edit `slides.md` — change the title, add a new slide. Save. Watch the browser reload.

**Stretch:** add a code block and a two-column layout (`layout: two-cols`).

## Exercise 2 — Use the CTP theme (10 min)

1. In your `slides.md`, change the frontmatter to use the CTP theme:
   ```yaml
   ---
   theme: ctp
   title: My CTP-flavored Deck
   author: Your name
   ---
   ```
2. Inside this repo the theme is wired up for you via a `link:` dependency to the sibling `ctp-templates` repo — no install command needed. In your own project elsewhere you'd `npm install slidev-theme-ctp` once it's published.
3. Add a cover slide with `layout: cover`, a section divider with `layout: section`, and a `<CtpCallout label="Tip">` somewhere.
4. Toggle dark mode by pressing <kbd>d</kbd>. Notice the palette swap.

**Stretch:** override one CSS variable in a local `style.css` to change the accent color just for your deck.

## Exercise 3 — Publish (10 min)

Pick one:

- **PDF.** Run `npx slidev export`. Open the resulting PDF and confirm it matches the on-screen version.
- **Static site.** Run `npx slidev build --base /my-deck/`. Serve `dist/` locally with `npx serve dist` and verify it loads.
- **GitHub Pages.** Drop `snippets/deploy.yml` into `.github/workflows/deploy.yml` (adjust paths), push to `main`, and watch the Action build and deploy. Enable Pages → "GitHub Actions" in the repo settings first.

## Going further

- Read the Slidev docs at <https://sli.dev>.
- Look at the CTP template's `example.md` to see every layout and component live.
- Open a PR adding a new layout you wish the template had.
