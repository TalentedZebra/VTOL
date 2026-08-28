Build a static, GitHub-Pages-ready website for my tilt-rotor tricopter VTOL project in this repository (github.com/TalentedZebra/VTOL). Read this entire prompt before doing anything. Where it says "stop and ask," actually stop and ask me instead of guessing.

## 0. Ground rules (non-negotiable)

1. **Don't invent technical content.** The research/physics content for this site is provided verbatim in `content/research/*.md` in this same folder — I wrote it myself with real citations. Your job is to lay it out as HTML using the site's design system, not to rewrite the science, add new claims, change any numbers or equations, or drop any of the "Further reading" links. Light editing for HTML flow (e.g. turning a markdown list into an `<ul>`) is fine; changing facts, equations, or citations is not.
2. **Don't touch git history or force-push.** No `git reset --hard`, no `--force` pushes, no rewriting existing commits.
3. **Check before you overwrite.** This repo may already have files in it (README, LICENSE, whatever). Before creating any file, check if it already exists with different content. If overwriting an existing file (other than a placeholder README you're clearly meant to replace), show me what you're about to change and ask first.
4. **Work on a branch, not directly on `main`.** Create a branch (e.g. `site-build`), commit your work there, push it, and open a pull request with `gh pr create` so I can look at the rendered site before it goes live. Do not merge to `main` yourself — tell me it's ready and let me merge it.
5. If anything below is ambiguous or you hit a decision I clearly need to make (not a small implementation detail), stop and ask me rather than picking for me.

## 1. What already exists in this folder (do not skip reading these)

- `content/research/01-aerodynamics-lift-airfoils.md` through `06-regulations-and-safety.md` — the six research topics, full text, ready to use as source material.
- `assets/styles.css` — the complete, already-designed CSS for this project (design tokens, typography, light/dark theme support, all the component styles: title block, phase cards, checklists, tables, callouts, resource lists, etc.). **Reuse this file as-is.** Copy it into the repo at `assets/styles.css` unmodified. Only add new CSS rules (appended at the bottom, or in a separate small stylesheet) for anything genuinely not covered — e.g. the global top nav bar described in section 4.
- `assets/progress.js` — the checklist-progress-tracking script (saves checked items to `localStorage`, updates a progress bar). Copy it into the repo at `assets/progress.js` unmodified, and include it (via `<script src="assets/progress.js">` or the correct relative path from subfolders) on any page that has `.checklist` elements. It's safe to include on pages with no checklists too — it just does nothing there.
- `MANUAL_CONTENT_REFERENCE.html` — the existing build-pipeline manual (title block, the "tilt-rotor vs. tailsitter" decision callout, all 10 build phases as checklists, the budget table, the safety note, the resource library). This is the exact content and structure to use for the site's home page (`index.html`) — reuse its content and structure, just adapt the markup to be a standalone HTML page (see section 3) instead of the artifact-embed format it's currently in.

## 2. Site structure to create

```
/
├── index.html                                    (the build manual — home page)
├── assets/
│   ├── styles.css                                (copied in unmodified, see above)
│   ├── progress.js                                (copied in unmodified, see above)
│   └── nav.css or an addition to styles.css       (your call — small addition for the global nav bar)
├── research/
│   ├── index.html                                 (Research & Principles hub)
│   ├── aerodynamics-lift-airfoils.html
│   ├── propulsion-motors-propellers.html
│   ├── vtol-transition-aerodynamics.html
│   ├── flight-control-pid.html
│   ├── structures-and-materials.html
│   └── regulations-and-safety.html
└── README.md                                      (short: what this repo is, link to the live Pages URL once known)
```

Every HTML page needs a real, standalone document: `<!DOCTYPE html>`, `<html lang="en">`, a `<head>` with `<meta charset="utf-8">`, a responsive viewport meta tag, the Google Fonts `<link>` tag below, a `<title>`, and a `<link rel="stylesheet" href="...assets/styles.css">` (mind relative paths from the `research/` subfolder — it'll need `../assets/styles.css`). This is different from an embedded artifact snippet — these are real files that need to work when opened directly via GitHub Pages, so don't skip the boilerplate.

Google Fonts tag to include on every page's `<head>` (exact, don't change):
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
```

## 3. `index.html` — the build manual

Take the content and structure from `MANUAL_CONTENT_REFERENCE.html` (title block, intro, the tilt-rotor-vs-tailsitter decision callout, all 10 phases with their checklists and resource links, the safety note, the budget table, and the resource library section) and turn it into a proper standalone page using the classes already defined in `assets/styles.css` (`.shell`, `.rail`, `.titleblock`, `.phase`, `.checklist`, `.callout`, `.table-wrap`, `.lib-grid`, etc. — they're all already styled, just reuse the same markup patterns). Keep the sidebar phase index and the overall-progress bar. Keep every checklist item id exactly as it is in the reference (the progress script keys off those ids) — don't renumber or rename them.

Add a link into the Resource Library section (or right after the intro — your call) to `research/index.html`, something like "Want to actually understand *why* each of these choices works? See the Research & Principles section."

## 4. Global navigation

Every page (manual and research) needs a slim nav bar at the very top, above everything else, with two links: **Build Manual** (→ `index.html` / `../index.html` from research pages) and **Research & Principles** (→ `research/index.html` / `index.html` from within research pages). Style it using the existing color tokens (`--ink`, `--teal`, `--accent`, `--line`, etc. from `assets/styles.css`) so it feels like part of the same site, not a bolted-on afterthought — this is real design work you should actually do well, not just an unstyled `<ul>`. Highlight whichever section the current page belongs to (e.g. via an `aria-current="page"` attribute and a distinct visual treatment).

## 5. `research/index.html` — the hub page

A page that introduces the Research & Principles section in a couple of sentences (something like: this is where the *why* behind the build manual lives — the aerodynamics, propulsion physics, control theory, and structural principles behind a tilt-rotor tricopter, written with real citations so it can be checked and dug into further) and then lists all six topics as cards or a list, each with:
- the topic title,
- a one-sentence teaser (write these yourself, they're descriptive not technical — e.g. for aerodynamics: "How a wing actually generates lift, why 'equal transit time' is a myth, and why small RC aircraft don't fly like airliners."),
- a link to that topic's page.

Reuse `.lib-grid` / `.lib-cat`-style cards from the existing stylesheet, or a similar pattern consistent with the rest of the site — your call on the exact layout, but it should look intentional, not like an afterthought bolted onto the manual.

## 6. The six research topic pages

For each `content/research/NN-topic-name.md` file, create the corresponding `research/topic-name.html` page (drop the `NN-` numeric prefix from the filename). Structure:

- Global nav (section 4)
- A page header with the topic title (use `<h1>` styled like the rest of the site's headings) and a short eyebrow/label
- The markdown content transcribed faithfully into HTML: headings become `<h2>`/`<h3>`, prose stays as `<p>`, bullet lists become `<ul>`/`<li>`, and any inline-code-style math (things like `L = ½ ρ V² S C_L`) should render clearly — a `<p class="mono">` or similar treatment using the existing monospace token is fine, you don't need a math-rendering library for this content, plain formatted text is enough.
- The "Further reading" section at the bottom of each markdown file becomes a clearly labeled resources list (reuse the `.resources` styling pattern from the manual) with every link preserved exactly, opening in a new tab (`target="_blank" rel="noopener"`).
- A link back to `research/index.html` and to the other five topics (a simple "More in this section" list at the bottom is enough — doesn't need to be fancy).

Do this for all six: aerodynamics-lift-airfoils, propulsion-motors-propellers, vtol-transition-aerodynamics, flight-control-pid, structures-and-materials, regulations-and-safety.

## 7. Before committing: verify

- Open (or at least lint/read through) every generated HTML file and confirm: no unclosed tags, every internal link actually points to a file you created, every external link matches the source markdown exactly (no typos introduced), and the site works with relative paths (this matters for GitHub Pages — don't use absolute `/index.html`-style paths that assume the repo is served from domain root unless you've confirmed that's how Pages is configured for this repo; relative paths are safer regardless).
- Confirm `assets/styles.css` and `assets/progress.js` were copied byte-for-byte from this folder, not retyped from memory.
- Confirm every one of the six markdown files' "Further reading" links made it into its corresponding HTML page — count them if you have to.

## 8. Commit, push, and open a PR

1. `git checkout -b site-build`
2. Add and commit the new files with a clear commit message.
3. `git push -u origin site-build`
4. `gh pr create` with a short description of what's in it.
5. Tell me the PR is ready. Don't merge it yourself.

## 9. GitHub Pages setup (after I merge, or now if I say to go ahead)

Check current Pages status first: `gh api repos/TalentedZebra/VTOL/pages` (a 404 means it isn't configured yet). If it's not configured, enable it to deploy from the `main` branch, root folder:

```
gh api -X POST repos/TalentedZebra/VTOL/pages -f "source[branch]=main" -f "source[path]=/"
```

If that command fails (permissions, `gh` not authenticated with the right scope, or any other error), don't keep retrying — instead tell me exactly what failed and give me the manual steps: repo Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)` → Save. Once Pages is live, tell me the resulting `https://talentedzebra.github.io/VTOL/` URL (confirm the exact casing GitHub actually assigns) and add it to `README.md`.

## 10. Anything not covered above

Use your judgment for small implementation details (exact card layout on the research hub, minor spacing, etc.) — match the existing design system's spirit (the aerospace/engineering-drawing aesthetic: IBM Plex Sans/Mono + Big Shoulders Display, the teal/burnt-orange palette, hairline borders, title-block-style metadata). For anything that changes the actual content, structure of the manual, or repo/deployment behavior, stop and ask me first.
