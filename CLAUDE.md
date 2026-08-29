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
- **v1 is the Flightory Stallion, v2 is a fully custom airframe** — v1 will be built
  from the [Flightory Stallion](https://flightory.com/product/stallion/) base airframe
  and its [VTOL conversion pack](https://flightory.com/product/stallion-vtol/)
  (background: [DroneXL writeup](https://dronexl.co/2025/04/04/3d-printed-stallion-drone-diy-fixed-wing/)),
  a real, documented tilt-rotor tricopter in the same 2-tilt-motor + 1-fixed-motor
  layout as this project, already CFD-validated and flown by others. Building a proven
  design first de-risks the electronics/assembly/flight-testing learning curve on its
  own, before spending time on from-scratch aerodynamic sizing for a custom v2. See
  `research/reference-design-stallion.html` for the full build-vs-custom comparison
  this was based on. **This makes v1's airframe geometry and fabrication method
  (3D-printed LW-PLA/PETG, ~1340mm span, ~2–3kg AUW) the Stallion's, not the
  ~700–900mm class the budget table currently assumes** — the budget table, phase
  checklists, and component-sizing guidance have not yet been updated to match and are
  a known follow-up, not yet done as of this writing.
- **dRehmFlight on a Teensy 4.0 for v1, not ArduPilot QuadPlane** — chosen because the
  goal is to read and understand the actual control loop (fits the Mechatronics track),
  not tune a black-box autopilot. Migrating to ArduPilot for autonomy features is a
  possible v2 direction, not planned for v1. Note: the Stallion's own stock VTOL build
  (SpeedyBee F405 Wing + ArduPilot) differs from this — reconciling that is part of the
  same not-yet-done follow-up above, not a decision this bullet has settled.
- **dRehmFlight has no built-in Remote ID broadcast** — unlike some ArduPilot/Pixhawk
  stacks, a standalone Remote ID module (or FRIA-only flying) is a real, budgeted line
  item, not an afterthought.

## Who this is for

Built by a Multidisciplinary Engineering Technology (Mechatronics track) student at
Texas A&M, alongside coursework, starting from limited hands-on RC/electronics
experience — the goal is to actually understand the underlying engineering (aero,
propulsion, controls, structures), not just end up with a flying aircraft. Explanations
and new content should teach the *why*, not just state a conclusion.

## ARS standing preferences

- This is engineering/hobbyist research for a personal VTOL build, not academic
  publishing — don't default to peer-reviewed-only sourcing.
- Acceptable sources: manufacturer datasheets/specs, established open-source aerospace/RC
  projects (e.g. ArduPilot, dRehmFlight, PX4 docs), reputable hobbyist technical
  references (e.g. Oscar Liang, mh-aerotools, eCalc), and regulatory bodies (FAA, AMA) —
  alongside academic literature when it exists (e.g. tiltrotor aerodynamics papers).
- Citation style: a clear link + source title is sufficient; APA formatting only needed
  if producing a formal write-up (e.g. the Phase 09 project report).
- Default to deep-research's quick or socratic mode for day-to-day questions; reserve
  systematic-review/meta-analysis mode for when I explicitly ask for a literature review.
- Always add real, working links — never a fabricated citation.

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
