# VTOL — Tricopter VTOL project

## What this repo is

A static, GitHub-Pages-hosted site (`https://talentedzebra.github.io/VTOL/`) documenting a
from-scratch tilt-rotor tricopter VTOL build: two wingtip motors that tilt between vertical
(hover) and horizontal (cruise), plus one fixed rear motor for hover yaw and extra lift.
The site is both a build manual and a growing engineering reference — it's meant to keep
accumulating real content over the life of the project, not stay static.

### File structure

- `index.html` — the build manual. A 10-phase pipeline (00 Foundations → 09 Iterate &
  document) with per-phase checklists, a budget table, a resource library, and a
  "Decision" callout pattern for major design choices. Checklist item ids (`p0-1`,
  `p4-8`, etc.) are keyed by `assets/progress.js` for localStorage-based progress
  tracking — never renumber or reuse an existing id.
- `research/` — cited deep-dive pages: `research/index.html` is the hub; the six (and
  growing) topic pages cover aerodynamics/airfoils, propulsion (motors/props/ESCs/
  batteries), VTOL transition aerodynamics, flight control & PID, structures &
  materials, and regulations & safety.
- `content/research/NN-topic-name.md` — the source markdown each research page is
  transcribed from. When a research page changes, keep its source `.md` in sync.
- `assets/styles.css` — the complete design system (colors, type, every component
  class). Reuse as-is; never redesign or restyle from scratch.
- `assets/site.css` — small additive stylesheet layered on top of `styles.css` for
  things the base system doesn't cover (global nav bar, research hub cards, page
  headers, equation blocks). New site-wide UI patterns belong here, appended — don't
  touch `styles.css` itself.
- `assets/progress.js` — the checklist-progress-tracking script. Include on any page
  with `.checklist` elements; safe to include everywhere else too.
- `serve-local.sh` — local static-file server for previewing the site before merging
  (mirrors how GitHub Pages serves relative paths).

### Design system reference (`assets/styles.css`)

- **Fonts**: `Big Shoulders Display` (headings, uppercase, heavy weight) + `IBM Plex Sans`
  (body) + `IBM Plex Mono` (labels, numbers, code/equations via `.mono`). Loaded from
  Google Fonts — the exact `<link>` tag is already on every page; copy it verbatim onto
  any new page.
- **Color tokens**: `--bg`, `--surface`, `--surface-2`, `--line`, `--line-strong`, `--ink`,
  `--ink-muted`, `--ink-faint`, `--accent` (burnt orange), `--teal`, `--good`, `--warn` —
  all with light/dark variants already handled. Always use the tokens, never hardcode
  hex values.
- **Reusable component classes**: `.shell` / `.rail` (phase-index sidebar layout),
  `.titleblock`, `.callout` + `.compare` / `.compare-card` (decision call-outs),
  `.phase` / `.phase-head` / `.phase-body` / `.checklist` / `.check-item` (build phases),
  `.resources` (further-reading / key-resource lists), `.table-wrap` + standard `<table>`
  markup (budget-style tables), `.lib-grid` / `.lib-cat` (resource library), `.safety`
  (warning callout), `.sitenav` (global top nav, defined in `site.css`), `.research-grid`
  / `.research-card` (research hub cards), `.page-header`, `.equation`, `.article`
  (research article body typography).
- Every page is a standalone HTML document (own `<!DOCTYPE>`, `<head>`, relative asset
  paths — `../assets/...` from inside `research/`) so it works directly under GitHub
  Pages. No absolute `/`-rooted paths.

## Aircraft configuration & key decisions already made

- **Tilt-rotor tricopter, not a tailsitter** — chosen because the fuselage stays level
  through transition (simpler attitude control) and it has real open-source precedent
  (MiniHawk VTOL) and a commercial reference (E-flite Convergence / PX4). A tailsitter
  is noted as a possible v2/stretch build, not the current target.
- **dRehmFlight on a Teensy 4.0 for v1, not ArduPilot QuadPlane** — chosen because the
  goal is to read and understand the actual control loop (fits the Mechatronics track),
  not tune a black-box autopilot. Migrating to ArduPilot for autonomy features is a
  possible v2 direction, not planned for v1.
- **dRehmFlight has no built-in Remote ID broadcast** — unlike some ArduPilot/Pixhawk
  stacks, a standalone Remote ID module (or FRIA-only flying) is a real, budgeted line
  item, not an afterthought.
- Fabrication method (3D-printed vs. balsa/foam) and exact airframe geometry are later,
  per-build decisions (Phases 02–03), not yet fixed as of this writing.

## Who this is for

Built by a Multidisciplinary Engineering Technology (Mechatronics track) student at
Texas A&M, alongside coursework, starting from limited hands-on RC/electronics
experience — the goal is to actually understand the underlying engineering (aero,
propulsion, controls, structures), not just end up with a flying aircraft. Explanations
and new content should teach the *why*, not just state a conclusion.

## Git workflow — non-negotiable for any change to the site

- Always work on a new branch for any change (`git checkout -b <descriptive-name>`).
- Commit, then `git push -u origin <branch>`, then open a PR with `gh pr create`.
- **Never commit directly to `main`.**
- **Never force-push, and never rewrite existing history.**
- Don't merge your own PR — the repo owner reviews and merges.
- `gh` may not be installed/authenticated in a given environment; if so, push the
  branch and hand back the GitHub compare URL
  (`https://github.com/TalentedZebra/VTOL/compare/main...<branch>`) instead of
  guessing around it.
