# Handoff — `/work` explorer, project pages, card artwork

Updated 2026-08-22. Branch `feat/work-slot-machine`, pushed through `f97fe44`,
**not yet merged to `master`**.

---

## 1. Working agreements

**Never use Playwright or any browser automation in this repo.** Verify with
`npx tsc --noEmit`, `npx eslint`, and `npx next build`. When visual confirmation
is needed, describe what to look at and **ask the user for a screenshot**.

**Ask in prose, never with a multiple-choice prompt.** `AskUserQuestion` was
offered twice this session and rejected both times. The user works in short, fast
directives; a choice card is slower to read than the answer is to type. State a
recommendation in two sentences and let them reply, or take the obvious default,
say which one you took, and keep going.

**Don't over-explain.** Repeated feedback. Short answers, then act. The same
instinct applies to the artwork — see §5.

**Read `node_modules/next/dist/docs/` before writing Next-specific code.** Per
`AGENTS.md`, this version (16.3.1, Turbopack) differs from training data. It has
already caught two real bugs this session: `params` is `Promise<{slug}>` and must
be awaited, and `images.minimumCacheTTL` defaults to 4 hours.

**When patching files with scripts, assert before replacing.** Every patch should
fail loudly on a non-matching target and write nothing. This caught a miscounted
blurb and a bad script that would otherwise have half-applied.

**Stop the dev server before bulk filesystem operations.** Converting 60 images
and deleting 73 files under a running `next dev` corrupted Turbopack's incremental
graph (`Cell ... no longer exists`), which only a `rm -rf .next` and restart fixed.
Note the discriminator: **`next build` passing while `next dev` panics means cache,
not code** — a build creates a fresh graph each run.

**Design system lives in `DESIGN.MD`.** Dark-first, monochrome by default, colour
is rare and carries meaning.

---

## 2. What exists

```
src/app/work/page.tsx              shell: InteractionSounds + WorkExplorer + AboutDrawer
src/app/work/[slug]/page.tsx       project page — one per project, all 37
src/app/work/[slug]/page.module.css

src/components/slot/
  WorkExplorer.tsx/.css            two-column split, owns spin + reset state
  SlotMachine.tsx/.css             cabinet, three reels, lever rail, reset button
  WorkGallery.tsx/.css             ranked card grid, FLIP re-ranking
  art/
    kit.tsx                        ArtFrame, Ground, Mark, font + viewBox tokens
    registry.ts                    ART map — the single source for card artwork
    marks.ts                       brand mark paths extracted from public/
    AlifArt.tsx  BeonAIArt.tsx  PaperPilotArt.tsx  Burn0Art.tsx

src/data/slot.ts                   reels, art maps, 37-project archive, matching engine
src/sounds/slotSounds.ts           WebAudio SFX
src/components/InteractionSounds   sound prompt + toggle, bottom-left, both pages
```

---

## 3. How the machine works

**Reels are 5 / 7 / 35** — Type, Domain, Skill. Every face has artwork in
`public/type`, `public/domain`, `public/skills`, now **WebP** (was PNG; 82.8 MB →
7.6 MB). Art is keyed by reel *and* value via `artFor(reelIndex, value)` — `Founder`
appears on both the Type and Skill reels and needs a different card on each.

**Face labels are DOM text, not baked into the images.** Set in Doto with a
`.face::after` scrim, because the artwork ranges from near-black to bright and a
label without a scrim is legible on some faces and invisible on others.

**Physics** (`SlotMachine.tsx`): a rAF loop writes `transform` directly to the strip
elements, so React never re-renders during a spin. Phases are
`spin → settle → bounce → locked`, staggered per reel. Tick SFX are gated by
velocity. `CARD_RATIO` + a `ResizeObserver` derive cell height from measured column
width, and on resize `pos`/`to`/`from`/`loop` are **rescaled proportionally** —
without that, drums park between faces.

**Reset** lives on the lever rail above the lever, not in the page nav — it acts on
the machine, so it belongs on the machine. It works by **bumping `SlotMachine`'s
React `key`** from `WorkExplorer`. The machine keeps landed faces, strip offsets and
phase in internal state and in DOM transforms written outside React, so remounting
is the only clean way to unwind all of it at once.

---

## 4. Cards and the gallery

**Every card is a link to `/work/<id>`.** A dedicated `<Link>` laid over the card at
`z-index: 1`, not the old "first action's `::after`" trick. Action buttons sit at
`z-index: 2`, which is what keeps the two behaviours independent: click the
`WEBSITE ↗` bar and you leave the site, click anywhere else and you go inside.
**That stacking order is load-bearing** — swap either number and the button silently
stops working.

**Card anatomy is now:** artwork · logo · name · role · year · description · one
button row. Tags, the overflow counter and the score pip were all removed. Note
`margin-top: auto` moved from `.tags` to `.cardFoot` when tags went — it is what
keeps footers aligned across a row.

**Grid is `repeat(5, 1fr)`,** spans composed per spin by `buildSpans()` from a row
grammar (`[5]`, `[3,2]`, `[2,3]`), seeded by a hash of the landed combination —
never `Math.random()`, which would reshuffle on re-render and break FLIP. Same
constraint applies inside artwork: `PaperPilotArt`'s node table is hardcoded for
this reason.

**Borders:** the grid itself has no light frame. Each card carries an inset ring,
and the artwork carries its own full border — necessary because **child elements
paint over a parent's `inset` box-shadow**, so full-bleed artwork erases the card's
ring wherever it overlaps.

**`ART` registry entries** (`art/registry.ts`) carry four flags:

| flag | meaning |
|---|---|
| `slot` | `top` \| `middle` \| `bottom` — where artwork sits in the card |
| `bare` | artwork already shows the logo and name, so the head hides them (the `<h2>` stays, `.srOnly`, for the document outline) |
| `light` | artwork on a light ground — needs a deeper dim, see `[data-light-art]` |
| `ground` | the artwork's own background colour |

**`ground` is what solves the stretched-card gap.** Grid rows stretch cards to the
tallest in the row; rather than crop the artwork or leave a hole, `.cover` is painted
the artwork's own colour and the art is centred in it, so leftover height reads as
padding the artwork was drawn with. `.cover > svg` must stay `height: auto` with
`aspect-ratio` — `height: 100%` stretches the drawing and `preserveAspectRatio="slice"`
then crops it.

---

## 5. Card artwork — what was learned

Four attempts at burn0 were rejected before landing. The lesson, in order:

1. **An asset card is a poster, not a diagram.** It has a half-second budget.
   Anything that has to be *read* is failing at the job. A three-pane TUI, a
   five-column table and an itemised receipt were all rejected as "explaining the
   product".
2. **Draw the product, not the idea.** Paper Pilot's first version was a generic
   document with grey bars — it could have been any PDF reader. What makes BeonAI's
   card work is that it draws the actual composer with the real prompt copy and the
   real orb.
3. **But draw one surface, not the whole app.** BeonAI's strength is *scope* — one
   input box, not the dashboard behind it.
4. **Some products have no surface.** burn0 is a library you never look at, so
   inventing a screen for it was inventing its face. It ended as type only:
   wordmark plus one line. That is the honest answer, not a fallback.
5. **Don't reuse one composition.** Paper Pilot, burn0 and Basketo all briefly
   shared wordmark-left / graphic-right / radial-glow and read as one template.

Constraint that has not changed: the card renders around 420px wide against a
1600-unit viewBox, so **anything under ~28 units is below 7px on screen and becomes
noise.** Keep new artwork to a handful of large shapes.

Basketo is the one PNG (`/basketo/assest1.png`) and is the reference for the
key-art register. Its wordmark cannot be resized like the coded ones.

---

## 6. Project pages

`/work/[slug]` renders **all 37 projects** — the card is a link, so no card leads
nowhere. `params` is `Promise<{ slug: string }>` and must be awaited.

Page carries: hero artwork · name · role · period · description · Context
(type/domain) · **the full skill list** · website link. The full stack list living
here is what justifies the card carrying none.

`Project.story?: { heading, body }[]` exists and renders when present. **It is
empty for every project** — the pages currently have no narrative, which is the
biggest content gap on the branch.

---

## 7. Outstanding

**Ten skills still have zero project tags** — unchanged, and still the highest-value
data fix:

```
Machine Learning, Computer Vision, Databases, Vector Databases,
Queues & Background Jobs, Streaming, Smart Contracts,
WebGL / Creative Coding, CLI & Developer Tooling, Programmatic SEO
```

29% of the skill reel can never match. Worse, `pickSpinTarget()` samples a real
project and reads a triple off it, so these can never be chosen on a rigged spin.
Intended mapping: ML/CV → the 2019 Python and OpenCV work; Databases/Queues → the
flagships; WebGL → Three.js and music-balls; Smart Contracts → Basketo; CLI → burn0
and the npm packages; Programmatic SEO → Paper Pilot and BeonAI.

**Home page — assessed but not touched.** In priority order:

- `😊😊` is **doubled**, and is the only colour on an otherwise monochrome page.
- All four hero lines are at the same scale, so the statement never resolves.
  "6+ years making ideas real" wants to be roughly half size.
- Three hero links point at `/work?filter=ai|software|companies`. **Nothing reads
  that param**, and `/work` re-ranks rather than filters by design, so the concept
  no longer exists.
- Text is flush to the left edge (~25px on a 2000px viewport) with the right half
  empty, and ~390px of dead space between nav and first line.
- Nav is **22 lines duplicated verbatim** in `src/app/page.tsx` and
  `src/app/skills/page.tsx`, differing only in which link is `.active`. It is absent
  entirely from `/work` and `/journey`. Should be a component.
- The About nav link is `<a href="#about">`, so from `/skills` it resolves to
  `/skills#about` — broken anywhere but home.

**`/journey` and `/skills` are orphaned.** Both were hidden from the nav and the
hero CTA was repointed to `/work`, so neither has an inbound link anywhere. Both
still build and resolve by URL. Decide whether they are retired or re-linked.

**Four pre-existing lint errors**, none introduced this session:

- `AboutDrawer.tsx:46` — `closeDrawer` accessed before declaration inside an effect,
  so the effect captures a stale binding
- `LocationMap.tsx:55` — same pattern, plus an `any` at :64
- `TimeBasedCelestial.tsx:20` — `setState` called synchronously in an effect body

Smaller items:

- **`AlifArt`'s font stack is `"General Sans", "Inter", …`** and neither is loaded,
  so it falls back to Helvetica Neue. Geist Sans and Geist Mono *are* loaded and are
  what every other artwork uses — switch it or load the real face.
- **`public/domain/creaive_gaming.webp`** has a typo in the filename; the art map
  points at it as-is deliberately.
- **`public/maplibre-gl-*.mjs.map`** — 4 source map files publicly served.
- `images.minimumCacheTTL` is set to **60s** in `next.config.ts` while reel artwork
  is in flux. Raise it once the art settles.
- `shipping.webp` was deleted as unreferenced — `SKILL_REEL` has no "Shipping"
  entry, the silent-`str.replace` casualty from the previous session. Recoverable
  from `git show 08e318f:public/skills/shipping.png`.
- The PNGs live on in history at `08e318f`; only the working tree and deploys got
  lighter. Clean up large binaries *before* the first push next time.

---

## 8. Copy and identity decisions

**Blurbs are a fixed shape: a 4–5 word subject, then a 5–8 word proof clause,
joined by a participial phrase.** All 37 follow it. Validate by splitting on the
**first** comma — several have interior commas in the proof half.

burn0's blurb previously claimed "5K+ downloads". Real figure is ~3,100 all-time;
`social-proof.tsx` in that repo hardcodes numbers off by ~30× and is dead code.
Don't harvest stats from it.

Titles: the root layout supplies `template: "%s — Syed Rafi Naqvi"` to every child
segment, so **pages must not append a name of their own** — three did, and rendered
it twice. The home page is in the root segment and so does not receive the template.

Naming is inconsistent: "Rafi Naqvi" on home, "Syed Rafi Naqvi" in the layout and
`about.ts`.

The left column of `/work` is deliberately spare. Rejected and worth not
re-proposing: a Newsreader serif lede, a stats line in mono, "Proof of Work" as a
display title, and any copy that describes the slot machine rather than the person.
