# Rafi Portfolio — Baseline Design System

## Overview

Rafi's portfolio uses a **dark-first, minimal, technical design system** inspired by the restraint and precision of Vercel's Geist visual language.

The portfolio should feel:9

- intelligent
- technical
- cinematic
- experimental
- precise
- premium
- restrained

It should **not** feel like:

- a generic developer portfolio
- a résumé template
- a cyberpunk interface
- a hacker-themed website
- a gaming UI
- a component-library demo

The design should rely on typography, whitespace, alignment, imagery, and subtle structural details rather than decorative effects.

The core principle is:

> **Technical without becoming theatrical. Cinematic without becoming decorative.**

---

# Design Principles

## Subtraction First

Every visual element should have a purpose.

Prefer:

- whitespace over unnecessary containers
- typography over decorative icons
- thin structural lines over heavy cards
- one meaningful animation over multiple effects
- one strong image over a collage
- hierarchy through scale and placement rather than color

If an element does not improve hierarchy, storytelling, navigation, or comprehension, remove it.

---

## Dark-First

Dark mode is the native visual state of the portfolio.

It should not feel like a light interface that has simply been inverted.

Use subtle differences between near-black surfaces to create depth.

Avoid large medium-gray surfaces.

---

## Monochromatic by Default

The main interface should primarily use:

- black
- near-black
- white
- near-white
- gray

Color should be rare.

When color appears, it should carry meaning.

---

## Typography Carries Hierarchy

Hierarchy should primarily come from:

- font size
- font weight
- spacing
- font family
- position
- density
- contrast

Do not rely on many colors to differentiate information.

---

## Whitespace Is Structural

Whitespace is part of the design system.

Large empty regions should create:

- pacing
- hierarchy
- focus
- tension
- separation
- cinematic framing

Do not try to fill every part of the viewport.

---

# Color System

## Canvas

### Primary Canvas

```css
#050505
```

Use as the main portfolio background.

Token:

```text
colors.canvas
```

---

### Elevated Canvas

```css
#090909
```

Used for:

- cards
- media surfaces
- technical panels
- content blocks

Token:

```text
colors.canvas-elevated
```

---

### Soft Surface

```css
#0d0d0d
```

Used sparingly for subtle internal grouping.

Token:

```text
colors.surface-soft
```

---

### Raised Surface

```css
#111111
```

Only use when another clear level of elevation is required.

Token:

```text
colors.surface-raised
```

---

# Text Colors

## Primary

```css
#ffffff
```

Used for:

- major headings
- important labels
- emphasized content
- strong technical text

Token:

```text
colors.text-primary
```

---

## Secondary

```css
#f2f2f2
```

Used for:

- strong body copy
- descriptions
- secondary headings

Token:

```text
colors.text-secondary
```

---

## Body

```css
#d4d4d4
```

Default long-form text.

Token:

```text
colors.text-body
```

---

## Muted

```css
#a3a3a3
```

Used for:

- metadata
- secondary labels
- captions
- timestamps
- coordinates

Token:

```text
colors.text-muted
```

---

## Faint

```css
#737373
```

Used only for intentionally low-emphasis content.

Token:

```text
colors.text-faint
```

Do not use faint text for important information.

---

# Structural Colors

## Hairline

```css
#2a2a2a
```

Default subtle separator.

Token:

```text
colors.hairline
```

---

## Visible Hairline

```css
#404040
```

For dividers requiring stronger visibility.

Token:

```text
colors.hairline-visible
```

---

## Border

```css
#555555
```

Used for more technical or visually important structural frames.

Token:

```text
colors.border
```

---

## Strong Border

```css
#666666
```

Used selectively where borders intentionally contribute to the design.

Token:

```text
colors.border-strong
```

---

## Electric White

```css
#ffffff
```

Reserved for small active or animated technical details.

Token:

```text
colors.electric
```

Electric white should not become a general glow system.

---

# Accent Color

The interface should remain predominantly monochrome.

## Link Blue

```css
#0070f3
```

Token:

```text
colors.link
```

Use for:

- links
- focus indicators
- intentional interactive accents

Do not use blue as general decoration.

---

# Optional Accent Palette

The following colors may exist for future storytelling or illustration use:

```text
Blue    #007cf0
Cyan    #00dfd8
Violet  #7928ca
Pink    #ff0080
Red     #ff4d4d
Amber   #f9cb28
```

They should not automatically appear in the interface.

Color must be introduced deliberately.

---

# Typography

The portfolio uses the **Geist** family.

## Geist Sans

Primary typography.

Use for:

- headings
- paragraphs
- navigation
- buttons
- product descriptions
- primary UI

Fallback:

```css
Arial, sans-serif
```

---

## Geist Mono

Technical typography.

Use selectively for:

- metadata
- years
- coordinates
- technical identifiers
- code
- system labels
- commands
- counters
- small section markers

Do not use Geist Mono for large amounts of body copy.

Fallback:

```css
monospace
```

---

# Typography Scale

| Token        |    Size | Weight | Line Height | Tracking |
| ------------ | ------: | -----: | ----------: | -------: |
| `display-xl` |    64px |    600 |        64px |     -3px |
| `display-lg` |    48px |    600 |        50px |   -2.4px |
| `heading-lg` |    32px |    600 |        40px |  -1.28px |
| `heading-md` |    20px |    600 |        28px |   -0.4px |
| `body-lg`    |    16px |    400 |        24px |        0 |
| `body-md`    |    14px |    400 |        20px |        0 |
| `body-sm`    |    12px |    400 |        16px |        0 |
| `label-sm`   |    14px |    500 |        20px |   -0.2px |
| `mono-md`    |    14px |    500 |        20px |        0 |
| `mono-sm`    | 11–12px |    500 |        16px |   0.08em |

Responsive typography may use `clamp()` rather than rigid breakpoint jumps.

---

# Display Typography

Large headings should:

- use Geist Sans
- use weight `600`
- use tight negative tracking
- have relatively compact line height
- remain monochromatic

Example:

```css
font-size: 48px;
font-weight: 600;
line-height: 1;
letter-spacing: -2.4px;
```

Avoid:

- very thin headings
- ultra-black weights
- decorative italics
- unnecessary uppercase display copy

---

# Technical Typography

Technical labels may use:

```css
font-family: var(--font-geist-mono);
font-size: 11px;
font-weight: 500;
letter-spacing: 0.08em;
text-transform: uppercase;
```

Examples:

```text
2026

NODE_04

NEW YORK

03 / 12

40.7128° N
```

Technical typography should reinforce the system language, not dominate the entire interface.

---

# Digital / Dotted Typography

A subtle dot-matrix or digital-display treatment may be used selectively for:

- years
- major numbers
- coordinates
- milestone identifiers
- counters

It should not become the portfolio's primary typography.

Do not use it for body copy.

---

# Spacing

Use a 4px base system.

```text
4
8
12
16
24
32
40
48
64
96
128
```

Suggested tokens:

```text
spacing.xxs       4px
spacing.xs        8px
spacing.sm        12px
spacing.md        16px
spacing.lg        24px
spacing.xl        32px
spacing.2xl       40px
spacing.2-5xl     48px
spacing.3xl       64px
spacing.4xl       96px
spacing.section   128px
```

Use spacing consistently rather than inventing arbitrary values.

---

# Layout

## General Content Width

Primary content container:

```text
~1200px
```

Use comfortable responsive gutters.

Large visual experiences may extend beyond the normal content container.

---

## Grid

Use precise grids when content benefits from structure.

Prefer:

- two-column layouts
- three-column layouts
- asymmetric editorial compositions
- intentional spans

Avoid filling every section with equal-sized cards.

---

## Alignment

Alignment should feel engineered.

Elements should intentionally align to:

- common vertical edges
- baselines
- grid tracks
- structural lines

Small misalignments should not be introduced for visual novelty.

---

# Responsive Breakpoints

Suggested baseline:

```text
Mobile     ≤ 640px
Tablet      768px
Laptop     1024px
Desktop    1200px+
```

These are guidelines rather than rigid rules.

Design responsively based on content needs.

---

# Mobile Philosophy

Do not simply shrink desktop layouts.

On smaller screens:

- simplify compositions
- maintain readable typography
- reduce unnecessary structural complexity
- preserve storytelling hierarchy
- maintain comfortable touch targets
- allow vertical layouts where necessary

---

# Shapes

## Radius Scale

```text
rounded.none  0px
rounded.sm    6px
rounded.md    12px
rounded.lg    16px
rounded.full  9999px
```

---

## General Geometry

General portfolio surfaces may use:

```text
6–16px
```

radii depending on context.

Technical or archival surfaces may use:

```text
0px
```

to create sharper visual contrast.

Do not apply the same radius to every component.

---

# Technical Geometry

Technical visual language may use:

- square frames
- rectangular panels
- thin dividers
- square nodes
- straight horizontal lines
- straight vertical lines
- diagonal line segments
- sharp intersections

Avoid:

- excessive curves
- rounded elbows
- decorative blobs
- organic line paths

---

# Borders

Borders should usually be:

```css
1px solid
```

Use borders as structural tools.

Typical colors:

```text
#2a2a2a
#404040
#555555
#666666
```

Do not outline every surface with the strongest border value.

Hierarchy should determine border strength.

---

# Structural Lines

Lines are an important part of the portfolio's technical language.

They may represent:

- chronology
- connection
- hierarchy
- relationships
- boundaries
- alignment

Default lines should remain muted.

Active or animated line details may become white.

Use:

- horizontal segments
- vertical segments
- diagonal segments

Avoid curved technical connectors unless a future design explicitly requires them.

---

# Surfaces

Surfaces should remain visually close to the main canvas.

Typical progression:

```text
#050505
↓
#090909
↓
#0d0d0d
↓
#111111
```

Avoid medium gray cards floating on black backgrounds.

Depth should be subtle.

---

# Elevation

## Flat

Default.

```text
1px border
no shadow
```

---

## Whisper

For slight separation.

Use extremely subtle shadows.

Example:

```css
box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
```

---

## Floating

Reserved for:

- menus
- popovers
- modals
- intentionally detached UI

Do not use floating shadows throughout regular content.

---

# Glow

Glow is not a general-purpose visual treatment.

It may be used selectively around:

- an active technical signal
- a small moving white line
- a focused node

Glow should remain:

- monochromatic
- tight
- low radius
- low opacity

Avoid large atmospheric neon glows.

---

# Imagery

Images are important storytelling elements.

Use:

- product screenshots
- photographs
- company logos
- UI captures
- technical diagrams
- prototypes
- launch artifacts
- documents
- metrics
- real historical material

Prefer real artifacts over generic illustrations.

---

# Image Treatment

Images should usually use:

- clean cropping
- precise dimensions
- subtle framing
- restrained borders
- minimal effects

Avoid:

- excessive rounding
- huge shadows
- unnecessary overlays
- repeated gradient treatments

Let the image itself carry visual weight.

---

# Motion Philosophy

Motion should communicate:

- progression
- connection
- hierarchy
- activation
- chronology
- discovery

Animation should not simply make the page feel busy.

---

# Motion Vocabulary

Approved motion ideas include:

### Progression

Movement that communicates moving through time or content.

### Line Reveal

A structural relationship becoming visible.

### Signal

A small white highlight traveling through an existing structural path.

### Activation

A subtle node or element becoming active.

### Reveal

Text, image, or metadata appearing when it becomes contextually relevant.

### Cursor

A restrained technical waiting/active state where appropriate.

---

# Motion Timing

Default motion should feel:

- deliberate
- smooth
- calm
- precise

Avoid fast looping decorative effects.

Short UI transitions:

```text
150–300ms
```

Content reveals:

```text
400–800ms
```

Long ambient or progression motion may be slower where appropriate.

---

# Motion Easing

Prefer restrained easing.

Examples:

```css
ease-out
cubic-bezier(.22, 1, .36, 1)
cubic-bezier(.65, 0, .35, 1)
```

Avoid:

- bounce
- elastic
- exaggerated spring effects

unless a future interaction explicitly benefits from them.

---

# Scroll Motion

Scroll-linked motion should preserve a sense of control.

It should be:

- reversible
- predictable
- smooth
- tied to user movement

Do not create scroll-jacking behavior that makes the site difficult to navigate.

---

# Electric Motion

A restrained electric-white motion language may appear in technical sections.

The principle is:

> A static structure remains visible while one small bright signal moves through it.

Do not animate the entire structural element.

Do not create several chasing particles.

Do not turn components into glowing neon objects.

---

# Navigation

Navigation should be minimal and visually quiet.

Use:

- dark canvas or transparent background
- white active text
- muted inactive text
- subtle dividers
- compact spacing

Avoid large floating glass navigation.

---

# Buttons

## Primary

High contrast.

Example:

```css
background: #ffffff;
color: #050505;
```

Use sparingly.

---

## Secondary

Example:

```css
background: transparent;
color: #ffffff;
border: 1px solid #404040;
```

---

## Functional Controls

May use:

```text
6px radius
```

or square geometry where appropriate.

Avoid making every button a pill.

---

# Cards

General content cards may use:

```css
background: #090909;
border: 1px solid #2a2a2a;
border-radius: 12px;
```

Technical or archival content may use:

```css
border-radius: 0;
```

Cards should not become the default solution for every section.

---

# Technical / Archive Visual Language

Some sections of the portfolio may use a stronger technical/archive language.

This may include:

- mono metadata
- coordinates
- timeline markers
- thin structural lines
- system labels
- square frames
- terminal-inspired surfaces
- routed geometric lines
- small active signals

Use these elements selectively.

The portfolio should still feel like a personal site, not a software dashboard.

---

# Journey Visual Direction

The `/journey` experience is visually connected to the rest of the portfolio but may push the technical/archive language further.

It should feel like:

> a visual record of progression through time.

The Journey may use:

- horizontal chronology
- technical lines
- square nodes
- images
- CMD-like surfaces
- metadata
- diagrams
- metrics
- routed connectors
- subtle white motion

The Journey should not look like a generic vertical résumé timeline.

---

# Journey Composition

Journey layouts may deliberately vary in:

- size
- density
- position
- content type
- visual weight

Not every milestone should have identical treatment.

Some moments may be:

- image-led
- text-led
- metric-led
- system-led
- quiet
- large
- densely connected

Storytelling determines composition.

---

# Timeline Visual Language

When timelines are used:

- use thin 1px lines
- use muted gray as the default
- use strong white only for active details
- use small precise markers
- allow content to branch from the main line

Avoid oversized timeline rails.

---

# Connector Visual Language

Connector lines should feel engineered rather than decorative.

They may use:

- straight horizontal segments
- vertical segments
- diagonal deflections

They should remain thin and muted.

A small moving white signal may occasionally communicate progression or connection.

Avoid:

- curves
- rounded elbows
- arrow-heavy diagrams
- glowing circuit-board aesthetics

---

# Technical Metadata

Metadata should be concise.

Examples:

```text
2024

NEW YORK

NODE_04

03 / 08

FOUNDER

APPLIED AI
```

Use mono typography and restrained spacing.

Do not invent meaningless technical language merely for visual effect.

---

# Interaction States

Interactive elements should communicate state primarily through:

- text contrast
- border contrast
- subtle background changes
- cursor behavior
- restrained motion

Avoid large transformations.

---

# Hover

Good hover effects:

- border becomes slightly brighter
- text moves from muted to white
- subtle metadata appears
- small active indicator appears

Avoid:

- large scale transforms
- card floating
- 3D tilt
- aggressive glow
- large rotations

---

# Accessibility

## Contrast

Important text must maintain strong readability.

Do not use low-contrast gray simply because it looks subtle.

---

## Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce);
```

Disable or simplify:

- looping signals
- decorative cursor blinking
- large scroll-linked animation
- draw-in animations
- continuous motion

Structural information must remain visible without animation.

---

## Focus

Interactive elements must have clear keyboard focus states.

Use:

- white outline
- high-contrast border
- link blue where appropriate

Never remove focus indication without replacing it.

---

## Touch Targets

Interactive controls should generally provide approximately:

```text
44px × 44px
```

effective touch targets.

Small visual controls may use larger invisible hit areas.

---

# Responsive Design

Responsive behavior should prioritize:

1. readability
2. storytelling
3. hierarchy
4. interaction
5. visual consistency

Do not preserve desktop geometry at the expense of usability.

Technical layouts may simplify on small screens.

---

# Do

- use near-black surfaces
- use strong readable white typography
- use Geist Sans and Geist Mono deliberately
- maintain generous whitespace
- use thin borders and structural lines
- keep technical geometry precise
- let real imagery carry visual weight
- use monochrome as the default
- introduce color intentionally
- animate with purpose
- preserve contrast
- vary composition based on importance
- keep interfaces visually quiet
- use small technical details to create identity

---

# Don't

- use light mode as the main visual language
- make the site cyberpunk
- make the site look like a terminal theme
- add random neon effects
- use glassmorphism everywhere
- use gradients on every section
- animate everything
- add multiple moving particles
- use glowing borders everywhere
- use low-contrast text
- fill all whitespace
- use identical cards for everything
- use excessive shadows
- round every component
- use arbitrary decorative icons
- fake technical information
- overuse mono typography
- make the site feel like a dashboard
- turn the portfolio into a UI component showcase

---

# Final Design Standard

Every visual decision should support at least one of these:

1. **Hierarchy**
2. **Readability**
3. **Storytelling**
4. **Navigation**
5. **Progression**
6. **Technical identity**

If it supports none of them, it should probably be removed.

The final portfolio should feel like:

> **A restrained, dark, highly crafted visual archive of Rafi's work, thinking, products, engineering, AI experiments, and progression over time.**

Not a résumé placed on a website.

Not a collection of trendy effects.

Not a generic developer portfolio.

The design should feel deliberate enough that even the smallest line, label, animation, and empty space appears intentional.
