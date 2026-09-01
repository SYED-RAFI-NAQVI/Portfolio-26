# Handoff — playable work, the skills wall, and the home hero

Updated 2026-08-23. Branch `feat/skills-wall-and-hero`, pushed through `bb1319b`,
**not yet merged to `master`** (`master` sits at `ab4456c`).

---

## 1. Working agreements

**Never use Playwright or any browser automation in this repo.** Verify with
`npx tsc --noEmit`, `npx eslint`, and `npx next build`. When visual confirmation
is needed, describe what to look at and **ask the user for a screenshot**.

**Ask in prose, never with a multiple-choice prompt.** `AskUserQuestion` has been
rejected every time it has been offered. State a recommendation in two sentences
and let them reply, or take the obvious default, say which one you took, and keep
going.

**Don't over-explain.** Repeated feedback. Short answers, then act.

**Read `node_modules/next/dist/docs/` before writing Next-specific code.** Per
`AGENTS.md`, this version (16.3.1, Turbopack) differs from training data. It has
caught real bugs: `params` is `Promise<{slug}>` and must be awaited,
`images.minimumCacheTTL` defaults to 4 hours, and `useSearchParams` bails a
client tree out of prerendering up to the nearest `Suspense` boundary.

**When patching files with scripts, assert before replacing.** Every patch should
fail loudly on a non-matching target and write nothing. This session it caught: a
stale assumption about a file's state after a rejected tool call, and a
find-replace that would have silently resized the hero emoji because three
unrelated rules shared `font-size: 0.72em`. **Prefer line-scoped or
rule-scoped edits when a value is not unique in the file.**

**Stop the dev server before bulk filesystem operations**, and don't run
`next build` while `next dev` is up — both write `.next`. Symptom is a dev server
serving stale output or panicking with `Cell ... no longer exists`; the fix is
`rm -rf .next` and restart. **`next build` passing while `next dev` misbehaves
means cache, not code.**

**Design system lives in `DESIGN.MD`.** Dark-first, monochrome by default, colour
is rare and carries meaning.

---

## 2. What exists

```
src/app/page.tsx                   home — hero, celestial, plant, games badge
src/app/work/page.tsx              Suspense boundary + WorkExplorer + AboutDrawer
src/app/work/[slug]/page.tsx       project page — one per project, all 37
src/app/skills/page.tsx            the skills wall (SiteNav + SkillShelf)
src/app/journey/page.tsx           placeholder scaffolding — see §7

src/components/
  SiteNav.tsx/.css                 shared header: logo, nav, resume
  InteractionSounds.tsx            sound prompt + toggle, bottom-left
  home/GamesBadge.tsx/.css         gold badge beside the sound control
  game/GamePlayer.tsx/.css         full-stage iframe player + PlayButton
  skills/
    SkillShelf.tsx                 owns which card is off the shelf
    SkillCard.tsx/.css             grid card
    SkillDetail.tsx/.css           the expanded card + reading panel
    Foil.tsx/.css                  useFoil() + <Foil/>, shared by both cards
  slot/
    WorkExplorer.tsx/.css          two-column split, spin/reset/focus/easy mode
    SlotMachine.tsx/.css           cabinet, three reels, lever rail, reset
    WorkGallery.tsx/.css           ranked card grid, FLIP re-ranking, easy mode
    art/registry.ts                ART map — the single source for card artwork

src/data/slot.ts                   reels, art maps, 37-project archive, matching,
                                   focus model, SKILL_LEVEL_ORDER
public/work/*.webp                 11 game covers (~900KB total)
art-source/generated/              the 20MB source PNGs — gitignored, local only
```

---

## 3. Playable work

**Eleven projects carry `play: string`** — a deployed build embedded in an
iframe. Everything about the player follows from the iframe being a **foreign
origin**: no score, no state, no pause, and `load` is the only signal there is.

- **Check headers before adding a URL.** `curl -sI <url>` for `X-Frame-Options`
  and `content-security-policy`. All twelve checked so far send neither. A host
  that does cannot be embedded and no code change fixes it.
- **The loader's progress is paced, not measured.** It decelerates toward
  `CEILING = 99` while `CREEP` holds a floor under its velocity, so it always
  moves rather than parking on a round number. `load` snaps it to 100; a 15s
  failsafe covers a frame that never loads.
- **The stage is keyed on the URL** so each open is a fresh mount — no state to
  unwind on close, and the entry transition always runs.
- Audio inside a game needs a gesture *inside the iframe*. Clicking Play on our
  side does not count. Silence until you click the canvas is expected.

**Gold is the site's one colour with a job: "this runs."** Four tokens in
`globals.css` (`--gold`, `--gold-deep`, `--gold-lit`, `--gold-veil`), carried by
the card ring, the Play pill, and the player chrome so a card and the window it
opens read as one object. Don't spend it on anything else.

---

## 4. The skills wall

`/skills` is the grid and nothing else. All 35 skills from `SKILL_REEL`, ordered
by `SKILL_LEVEL_ORDER` (ownership → system shape → AI → languages → specialisms).
That order is **separate from `SKILL_REEL` on purpose** — the reel's order is the
machine's business. `skillsByLevel()` ranks anything unlisted last rather than
dropping it, so adding a skill can't make it vanish.

**The foil is two `color-dodge` layers moving at different rates** (after
simeydotme's Pokémon card pen). The band tracks the pointer at `/1.5`, the
sparkle sheet at `/7`. That parallax is the entire effect — one layer produces
nothing convincing at any opacity. Tracking lives in `useFoil()`, layers in
`<Foil/>`, shared by the grid card and the expanded one.

**Clicking pulls a card off the shelf.** It flies from its exact grid rect to the
stage, turning one revolution; the panel slides in from the right. Closing calls
`anim.updatePlaybackRate(-(OUT_MS / BACK_MS))` and replays the *same* animation
backwards, so the card retraces its path and lands in its own slot rather than
near it. **The grid slot stays `visibility: hidden`, never `display: none`** —
remove it from flow and the grid reflows on click, the origin rect goes stale,
and the card flies home to where its slot used to be.

The expanded card's tilt rides on `.cardWrap`, not `.card`: the card's own
`transform` belongs to the fly-out animation, and two writers on one property
fight. Nesting composes them instead.

---

## 5. Focus, and the home hero

**Four disjoint slices, all read off `project.type`:**

| focus | n | rule |
|---|---|---|
| `startups` | 4 | `type` includes Founder |
| `software` | 5 | `type` includes Job |
| `hackathons` | 4 | `type` includes Hackathon |
| `games` | 11 | has `play` |

They **rank, never filter** — arriving from a home link must not look like the
archive lost thirty projects. A dismissible chip shows the active focus.

**Earlier skill-based predicates were wrong and it took counting to see it:**
"AI products" and "companies" shared three of four projects, and "software"
promoted **27 of 37** — not a focus, the archive with a chip on it. When adding a
slice, print the membership before trusting the definition.

**13 projects are reached by no link** — mostly 2019 exercises, which is fine, but
**burn0, github-ask and hadith-qa** are current work with no entry point. Tagging
them `Open Source` and adding a fourth noun would close it.

The hero is four explicit lines (three clauses + CTA), each a `display: block`
`.line`, so the sentence breaks where it means to. Company logos sit inline as
app-icon tiles sized in `em`, so they track the headline at every viewport.

**`since 6+ years` is not correct English** — *since* takes a point in time.
`for 6+ years` or `since 2018`. Flagged twice, kept deliberately; leave it unless
asked.

---

## 6. CSS lessons that cost real time this session

**An unterminated `/*` swallows whatever follows and still compiles.** A missing
`*/` ate the entire `.sheen` rule; Turbopack built it happily and the effect was
simply absent. Several rounds of tuning were spent editing inside a comment.
**After editing a stylesheet with a script, check delimiter and brace balance.**

**`overlay` picks its behaviour from the backdrop.** It screens where the
backdrop is light and *multiplies* where it's dark. The skill artwork is
near-black, so an overlay glow had nowhere to land and no alpha could rescue it.
`screen` is unconditionally additive; that's what "glow" means.

**`color-dodge` clips to white almost instantly as the blend colour approaches
white**, because it divides by the inverse. Every dodge layer needs a
`brightness()` under 1 holding the flare in range — those values are structural,
not taste. Tinted colours have a dark channel to spare and can run brighter;
white has none.

**Two CSS-module rules at equal specificity, in different files, are decided by
bundle order.** `.plantWrap { width }` in the component silently beat
`.plantContainer { width }` from the page for three consecutive edits. If a
change appears to do nothing, check for a competing declaration before changing
the value again.

**A rule targeting an inner element outranks one on its parent.**
`.bioLink.cta .label` sets the CTA's font; a `font-family` on `.cta` never
reaches the text. Same trap, one level down.

**`overflow: hidden` forces `transform-style` back to `flat`.** The skill label
can't use `translateZ` for parallax because the card clips its artwork — the
depth has to be faked in 2D against the same pointer offsets.

**`rotateX` and `rotateY` don't take the same sign for the same physical result.**
Positive `rotateY` sends the right edge back; it's *positive* `rotateX` that
sends the top back. Feeding both raw offsets in tilts one axis the wrong way.

**Children paint over a parent's `inset` box-shadow.** Full-bleed artwork erases
the card's ring wherever it overlaps, which is why `.coverBanner` carries a
border standing in for the ring — and why that border had to turn gold when the
ring did.

---

## 7. Outstanding

**Four pre-existing lint errors**, none introduced this session:

- `AboutDrawer.tsx:47` — `closeDrawer` accessed before declaration in an effect
- `LocationMap.tsx:55` — same pattern, plus an `any` at `:64`
- `TimeBasedCelestial.tsx:20` — `setState` called synchronously in an effect body

The first is the same class of bug the easy-mode toggle hit (a callback using a
`useState` setter declared below it) — caught by lint, invisible to `tsc`, and it
would have thrown on first click.

**Ten skills still have zero project tags:**

```
Machine Learning, Computer Vision, Databases, Vector Databases,
Queues & Background Jobs, Streaming, Smart Contracts,
WebGL / Creative Coding, CLI & Developer Tooling, Programmatic SEO
```

29% of the skill reel can never match, `pickSpinTarget()` can never choose them,
and on `/skills` they now show "No projects tagged yet" — the gap is visible to
visitors. **Note the side effect:** the AI focus currently excludes the 2019
OpenCV work only *because* ML and CV are untagged. Tag them and four experiments
join the AI slice.

**`/journey` is placeholder scaffolding** — "Origin point", "A milestone shell
for a company, role, collaborator". It builds, resolves by URL, and has no
inbound link. Retire it or write it; don't link to it as-is.

**`/skills` has no inbound link either.** `SiteNav` has Home, Work, About and
Resume. Adding Skills is one line now that the nav is a component.

**Content gaps:** `Project.story?` is empty for all 37 — the project pages carry
no narrative. `links[0]` in `about.ts` is still `hello@example.com`, now
marqueeing across a white band in the About drawer's flowing menu.

Smaller items:

- `images.minimumCacheTTL` is **60s** in `next.config.ts`, set while reel artwork
  was in flux. `/skills` leans on 35 images now; raise it.
- Home says **Rafi**, the layout and `about.ts` say **Syed Rafi Naqvi**.
- `AlifArt`'s font stack is `"General Sans", "Inter"` — neither is loaded.
- `public/domain/creaive_gaming.webp` has a typo in the filename, pointed at
  deliberately.
- `public/maplibre-gl-*.mjs.map` — 4 source maps publicly served.
- Two dot fonts are loaded: **Doto** (reel labels, skill cards, game loader) and
  **DotGothic16** (home CTA only). Unifying was tried and reverted — the CTA
  reads better in DotGothic16.
- `art-source/generated/` holds the 20MB source PNGs, gitignored. Only the
  ~900KB of WebP in `public/work/` ships. Don't move them back under `public/`.

---

## 8. Copy and identity decisions

**Blurbs are a fixed shape: a 4–5 word subject, then a 5–8 word proof clause,
joined by a participial phrase.** All 37 follow it. Validate by splitting on the
**first** comma — several have interior commas in the proof half.

burn0's blurb previously claimed "5K+ downloads". Real figure is ~3,100 all-time;
`social-proof.tsx` in that repo hardcodes numbers off by ~30× and is dead code.
Don't harvest stats from it.

Titles: the root layout supplies `template: "%s — Syed Rafi Naqvi"` to every child
segment, so **pages must not append a name of their own**. The home page is in the
root segment and does not receive the template.

**Card artwork for the games is deliberately playful** — glossy toy-plastic,
chunky bubble type, confetti — against a site that is otherwise austere. That
contrast is the point, and it is gated behind the gold "playable" system. Prompts
that read as "premium" or "cinematic" were rejected; so were pixel-art and
restrained-minimal directions. Three cards (need-for-speed, space-x,
music-player) went deliberately serious because the subject demanded it.

**Check the archive before writing artwork prompts.** CS-LEETS was drawn as a
competitive-programming grind; it is a 2018 student community site. Four of the
eleven prompts were written from guesses and that one was wrong.

The left column of `/work` is deliberately spare. Rejected and worth not
re-proposing: a Newsreader serif lede, a stats line in mono, "Proof of Work" as a
display title, and any copy that describes the slot machine rather than the
person.
