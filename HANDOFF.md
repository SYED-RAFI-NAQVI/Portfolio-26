# Handoff — `/work` slot-machine explorer

Written 2026-08-22. Branch `feat/work-slot-machine`, pushed, **not yet merged to `master`**.

---

## 1. Working agreements

**Never use Playwright or any browser automation in this repo.** Verify with
`npx tsc --noEmit`, `npx eslint`, and `npx next build`. When visual confirmation is
needed, describe what to look at and **ask the user for a screenshot**. This is a
standing rule, already saved to memory.

**Read `node_modules/next/dist/docs/` before writing Next-specific code.** Per
`AGENTS.md`, this Next version (16.3.1, Turbopack) has breaking changes vs. training
data. The fonts and app-router APIs were checked and are unchanged, but don't assume.

**Design system lives in `DESIGN.MD`.** Dark-first, monochrome by default, colour is
rare and carries meaning, *"subtle differences between near-black surfaces to create
depth — avoid large medium-gray surfaces."* That last line was violated once and had
to be reverted; take it literally.

**When patching files with scripts, assert before replacing.** Several `str.replace`
calls silently no-opped during this work and I reported changes that never landed —
one of them dropped `"Shipping"` out of `SKILL_REEL` without any error. Every patch
should fail loudly on a non-matching target.

---

## 2. What exists

Route `/work` (there is no `/slot` — it was renamed). Full-viewport, no nav bar.

```
src/app/work/page.tsx            shell: InteractionSounds + WorkExplorer + AboutDrawer
src/app/work/page.module.css     100vh flex shell, overflow hidden

src/components/slot/
  WorkExplorer.tsx/.css          40/60 split, owns spin state, back link, h1, hint
  SlotMachine.tsx/.css           cabinet, three reels, vertical lever
  WorkGallery.tsx/.css           ranked project grid, FLIP re-ranking
  art/AlifArt.tsx                Alif's card artwork, drawn in SVG

src/data/slot.ts                 reels, art maps, 37-project archive, matching engine
src/sounds/slotSounds.ts         WebAudio SFX built on the existing SoundManager
```

Left pane and right pane scroll **independently** (`overflow-y: auto` on each, page
itself never scrolls). Scrollbars are hidden in all engines but scrolling works.

---

## 3. How the machine works

**Reels are `5 / 7 / 35`** — Type, Domain, Skill. Every face has artwork
(`public/type/`, `public/domain/`, `public/skills/`), 47 cards total.

**Art is keyed by reel *and* value**, via `artFor(reelIndex, value)` in `slot.ts`.
This matters: `Founder` appears on both the Type and Skill reels and needs a
different card on each. Keying by value alone silently overwrites one.

**Physics** (`SlotMachine.tsx`): a rAF loop writes `transform` directly to the strip
elements, so React never re-renders during a spin. Phases are
`spin → settle → bounce → locked`, staggered per reel.

- Tick SFX are **gated by velocity** (`TICK_GATE`) — that's what makes it sound
  mechanical: silence at speed, accelerating clacks as it slows.
- `CARD_RATIO` + a `ResizeObserver` derive cell height from the measured column
  width. On resize, `pos`/`to`/`from`/`loop` are **rescaled proportionally** —
  without that, drums park between faces and the next spin lands off-register.
- `landingPosition()` takes the live cell size as an argument; it must not close
  over a constant.

**Lever** has a vertical throw. Pointer-drag, click, and Space/Enter all work. The
`--pull` CSS var is written to the rig element, and the shaft is clipped by an
`overflow: hidden` channel so it looks like it retracts into the housing.

---

## 4. Matching and ranking

`resolveCombo()` is strictly tiered: if any project scores 3/3, only 3/3 projects
return; otherwise it falls back to 2/3, then 1/3. `pickSpinTarget()` biases landings
toward combinations a real project satisfies (`JACKPOT_BIAS = 0.7`).

`rankProjects()` returns **every** project re-ordered — the gallery never filters
down, non-matches just dim. Removing them made the grid flash empty.

`type` and `domain` are **arrays** (`ReelType[]`, `ReelDomain[]`) so a project can be
both Personal and Open Source. Ties inside a tier break on archive index, so the
editorial "strongest first" order survives filtering.

---

## 5. Gallery layout

Grid is `repeat(5, 1fr)`. **Spans are composed per spin in JS**, not by `nth-child`:

- `buildSpans()` emits rows from a grammar — a row is only `[5]`, `[3,2]` or `[2,3]`.
  Generating valid *rows* rather than per-card widths is what guarantees every row
  fills exactly 5 columns.
- The seed is a hash of the landed combination, **not `Math.random()`** — a random
  layout would reshuffle on re-render and break the FLIP measurements.
- Hard constraints the user set: **never 50/50, never more than 2 per row, no
  project locked to one width.**

**FLIP re-ranking** (`useFlip` in `WorkGallery.tsx`): measure → reorder → invert with
a transform → play to zero, via the Web Animations API. React keys stay stable so
real position deltas animate. Cards resize as well as move, since width comes from
the composed layout.

**Card anatomy:** artwork (16:10) → logo + name + year → role → tags → action row.
Description is hidden when a card has artwork. The whole card is clickable via the
**stretched-link** pattern — `.card` is `position: relative`, the primary action is
`position: static`, and its `::after { inset: 0 }` resolves against the card. Making
that action `relative` collapses the hit area back to the button.

**Depth comes from the gutters, not the fill.** Cards are `#0b0c0d`, one value above
the canvas; the 1px gaps are pure `#000`, *below* both. Plus a 5% white inset hairline
on the top edge as a catch-light. A lighter grey fill was tried and rejected.

---

## 6. Card artwork

Two mechanisms, both supported:

- **Image** — `project.cover`, a PNG. Basketo uses `/basketo/assest1.png`.
- **Code** — a component registered in `ART` in `WorkGallery.tsx`, keyed by project
  id. Alif uses `art/AlifArt.tsx`.

**Prefer code.** These are flat vector layouts, and generated PNGs gave wrong logo
glyphs and uncanny faces. `AlifArt` embeds the real glyph path and `#2A2AFF` straight
from `public/alif-logo.svg`, on a fixed `1600×1000` viewBox so it stays crisp at any
card width.

**Hard-won constraint:** the card renders around 420px wide, ~26% scale. Anything
under ~24px in the viewBox falls below 7px on screen and becomes noise. Four
increasingly detailed versions of `AlifArt` were rejected before landing on
mark + wordmark + one line. **Keep new artwork to a handful of large shapes.**

Full-page screenshots do not work as card art — black-on-black has no edge and the
type is illegible at card size. Purpose-made assets only.

---

## 7. Outstanding

**Ten skills have zero project tags** and are the highest-priority fix:

```
Machine Learning, Computer Vision, Databases, Vector Databases,
Queues & Background Jobs, Streaming, Smart Contracts,
WebGL / Creative Coding, CLI & Developer Tooling, Programmatic SEO
```

That's 29% of the skill reel that can never match. Worse, `pickSpinTarget()` samples
a real project and reads a triple off it, so these can **never** be chosen on a
rigged spin — they only appear on free spins and always fall back to 2/3.

The user was offered a full re-derivation of all 37 projects' `skills` arrays from
their tagging table (in the previous chat's history) plus assignment of these ten,
and had not yet answered. Intended mapping: ML/CV → the 2019 Python and OpenCV work;
Databases/Queues → the flagships; WebGL → Three.js and music-balls; Smart Contracts →
Basketo; CLI → burn0 and the npm packages; Programmatic SEO → Paper Pilot and BeonAI.

Other open items:

- **`/work/basketo` does not exist** — Basketo's `CASE STUDY →` link 404s. Link kinds
  are `case-study | live | play`, and the user's rule is that **every** destination is
  an internal page; the gallery never links off-site.
- **`AlifArt` font stack is `"General Sans", "Inter", …`** and neither is loaded, so
  it falls to Helvetica Neue on macOS and Arial elsewhere. Either load General Sans
  via `next/font/local` or add Inter via `next/font/google`.
- **Five pixel fonts load on every page and nothing uses them** — Doto, Geist Pixel,
  Pixelify Sans, Raleway Dots, VT323, all in `layout.tsx`. Also, Geist Pixel has no
  metrics in Next's table, so it warns at build and will cause layout shift.
- **57MB of card PNGs**, 1024×1536 unoptimised. WebP would cut ~75%.
- **`public/domain/creaive_gaming.png`** has a typo in the filename; the art map
  points at it as-is deliberately. Rename both if you want it fixed.
- **`public/skills/next.png` is unused** — `Next.js` points at `next1.png`.
- **`page.tsx` metadata still says "Project Hunter"**, a name retired from the UI.
- `public/maplibre-gl-*.mjs.map` — 4.5MB of source maps publicly served.

---

## 8. Copy and identity decisions

The left column is deliberately spare: back link → `<h1>` → machine → hint. A large
display title was tried and rejected twice; the `<h1>` is `Work / 2017 — Now` at
label scale (10px mono), and the project cards are `<h2>` so the outline is
contiguous.

Rejected and worth not re-proposing: a Newsreader serif lede (removed, font unloaded),
a stats line in mono (mixed fonts disliked), "Proof of Work" as a display title, and
any copy that describes the slot machine rather than the person.

The user's name appears nowhere on the page by choice — the back link covers it.
