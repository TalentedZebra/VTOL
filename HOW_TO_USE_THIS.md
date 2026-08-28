# How to use this kit

This folder is everything Claude Code needs to build your VTOL project website — you shouldn't need to write anything else by hand.

## What's in here

- `CLAUDE_CLI_PROMPT.md` — the prompt. This is the thing you paste into Claude Code.
- `content/research/*.md` — six pieces of real, cited research content (aerodynamics/airfoils, propulsion, VTOL transition aerodynamics, flight control/PID, structures, regulations) that I wrote for the site's "Research & Principles" section. Claude Code is instructed to use these as-is, not rewrite the science.
- `assets/styles.css` and `assets/progress.js` — the exact design system and progress-tracking script from your build manual, so the new site matches it instead of Claude Code having to guess at colors/fonts.
- `MANUAL_CONTENT_REFERENCE.html` — your existing build manual, used as the content source for the site's home page.

## Steps

1. Get this whole `vtol-site-kit` folder onto the machine where your **VTOL** repo is checked out (or clone it fresh: `git clone https://github.com/TalentedZebra/VTOL.git`).
2. Copy everything from this kit **into the root of that repo** (so `content/`, `assets/`, `MANUAL_CONTENT_REFERENCE.html`, and `CLAUDE_CLI_PROMPT.md` all sit next to each other at the repo root, alongside whatever's already in the repo).
3. Open a terminal in that repo folder and start Claude Code (`claude`).
4. Paste the entire contents of `CLAUDE_CLI_PROMPT.md` as your first message.
5. Claude Code will build the site on a branch and open a pull request for you to look at before anything goes live — review it, then merge when you're happy.
6. Once merged, ask it (or do it yourself in GitHub's UI) to flip on GitHub Pages: Settings → Pages → Source: "Deploy from a branch" → `main` → `/ (root)`. Your site will land at `https://talentedzebra.github.io/VTOL/`.

## If you want changes later

Talk to Claude Code directly in that repo — it'll have full context of what it built. If you want more research topics added later, just write (or ask me to write) another `content/research/NN-topic-name.md` file in the same format and ask it to add the corresponding page and hub-page entry.
