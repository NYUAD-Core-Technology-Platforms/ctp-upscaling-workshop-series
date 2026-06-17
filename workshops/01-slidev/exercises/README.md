# Workshop 01, Exercises

One short Part A prompt exercise plus three Slidev exercises that pair with the slides. Each one stands alone, skip any that isn't relevant.

## Exercise A, Create a Markdown presentation brief (5 min)

Use ChatGPT, Claude, Gemini, or any similar chat assistant. If you have your own non-confidential source material, use that. Otherwise, use the fallback source text below.

Prompt:

```text
Turn the source material below into a Markdown presentation brief.

Audience: staff and researchers who need a practical 10-minute overview.
Goal: help them understand the topic, remember the key points, and know what to do next.
Length: 6-8 slides, 10 minutes.
Tone: clear, technical, no hype, no emoji.

Output:
- title
- audience
- learning objectives
- one h2 per slide
- 2-4 bullets per slide
- speaker notes for each slide
- questions or facts to verify before presenting

Source material:
PASTE YOUR NOTES, ABSTRACT, WEBSITE TEXT, OR PAPER EXCERPT HERE
```

Fallback source material:

```text
The Core Technology Platforms at NYU Abu Dhabi support research by providing
shared access to specialized instruments, technical staff, training, and
method-development support. Researchers often arrive with a scientific question
but need help choosing an instrument, preparing samples, estimating timelines,
or understanding what data quality is realistic.

A good orientation presentation should explain what the platforms are, when a
researcher should contact them, what information to bring to the first meeting,
and how shared facilities improve reproducibility and reduce duplicated effort.
It should avoid marketing language and focus on practical next steps.
```

Result: you should have a `presentation-brief.md`-style outline that could feed Slidev, PowerPoint, Canva, an AI deck builder, or another AI editing pass.

**Stretch:** ask the assistant to revise the brief for a different audience, such as first-year graduate students or external collaborators.

## Exercise 1, Your first deck (5 min)

1. Make a new folder and `cd` into it.
2. Run `npm init -y`.
3. Run `npm i -D "@slidev/cli@^0.49.0" @slidev/theme-default`.
4. Create a `slides.md` file with this starter deck:

   ```md
   ---
   title: My first Slidev deck
   ---

   # My first Slidev deck

   Hello Slidev.

   ---

   # One more slide

   Edit this file and save.
   ```

5. Run `npx slidev`.
6. Open the URL it prints.
7. Edit `slides.md`, change the title, add a new slide. Save. Watch the browser reload.

**Stretch:** add a code block and a two-column layout (`layout: two-cols`).

## Exercise 2, Use the CTP theme (10 min)

1. In your `slides.md`, change the frontmatter to use the CTP theme:
   ```yaml
   ---
   theme: ctp
   title: My CTP-flavored Deck
   author: Your name
   ---
   ```
2. Inside this repo the theme is wired up for you via a `link:` dependency to the sibling `ctp-templates` repo, no install command needed. In your own project elsewhere you'd `npm install slidev-theme-ctp` once it's published.
3. Add a cover slide with `layout: cover`, a section divider with `layout: section`, and a `<CtpCallout label="Tip">` somewhere.
4. Toggle dark mode by pressing <kbd>d</kbd>. Notice the palette swap.

**Stretch:** override one CSS variable in a local `style.css` to change the accent color just for your deck.

## Exercise 3, Publish (10 min)

Pick one:

- **PDF.** Run `npx slidev export`. Open the resulting PDF and confirm it matches the on-screen version.
- **Static site.** Run `npx slidev build --base /my-deck/`. Serve `dist/` locally with `npx serve dist` and verify it loads.
- **GitHub Pages.** Drop `snippets/deploy.yml` into `.github/workflows/deploy.yml` (adjust paths), push to `main`, and watch the Action build and deploy. Enable Pages → "GitHub Actions" in the repo settings first.

## Going further

- Read the Slidev docs at <https://sli.dev>.
- Look at the CTP template's `example.md` to see every layout and component live.
- Open a PR adding a new layout you wish the template had.
