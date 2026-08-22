import { ArtFrame, Ground, Mark, SANS, MONO } from "./kit";
import { BEONAI_MARK } from "./marks";

/**
 * BeonAI — card artwork, drawn rather than screenshotted.
 *
 * BeonAI's brand is light: warm parchment, terracotta accent, editorial print
 * rhythm. That is the inverse of this gallery, and the card commits to it
 * anyway — in a grid of near-black tiles the one parchment card is legible as
 * BeonAI before a single word resolves. Its dimmed state is handled specially
 * in WorkGallery.module.css, because the default dim rule turns a light panel
 * into exactly the mid-grey slab DESIGN.MD forbids.
 *
 * The subject is the product's own composer — skill pills, a prompt, the orb
 * peeking over the edge. It is drawn at roughly twice its true proportions
 * relative to the frame: reproduced faithfully, the prompt text would land
 * near 6px on screen. This is artwork of the product, not a screenshot of it,
 * so the skills dropdown, the icon set and the model logos are all cut. Five
 * rows of 9px type is texture, not information.
 *
 * All colours are BeonAI's own tokens. Both fonts are already loaded by
 * layout.tsx, so nothing new is pulled in for this card.
 */

const BG = "#faf9f5";
const SURFACE = "#ffffff";
const BORDER = "#d9d6cc";
const RULE = "#e8e6dc";
const INK = "#141413";
const INK_3 = "#94918a";
const ACCENT = "#cc6a42";
const ACCENT_SOFT = "#f4dac7";

/* ── Composer geometry ─────────────────────────────────────────────────── */

const BOX_X = 96;
const BOX_Y = 236;
const BOX_W = 1336;
const BOX_H = 540;
const PAD = 46;

const INNER_L = BOX_X + PAD;
const INNER_R = BOX_X + BOX_W - PAD;

/* ── Orb ───────────────────────────────────────────────────────────────────
 * The seven chromatic light sources, verbatim from the BeonOrb spec. On the
 * site they are painted to a canvas by a rAF loop; here they are SVG circles
 * in one rotated group, because the card's width is not fixed (buildSpans can
 * make it a 2-, 3- or 5-column card) and a pixel-sized canvas cannot follow
 * it. Rotation and blink are CSS keyframes, so this costs no JS and no main-
 * thread frame budget — which matters, since SlotMachine already runs a rAF
 * loop writing transforms during every spin.
 */

const LIGHTS = [
  { dx: -0.27, dy: -0.27, spread: 0.72, rgb: [110, 155, 235], a: 0.55 },
  { dx: 0.02, dy: -0.42, spread: 0.5, rgb: [155, 200, 245], a: 0.38 },
  { dx: -0.33, dy: 0.18, spread: 0.56, rgb: [160, 115, 220], a: 0.48 },
  { dx: 0.07, dy: 0.02, spread: 0.5, rgb: [205, 115, 225], a: 0.38 },
  { dx: 0.32, dy: -0.08, spread: 0.44, rgb: [235, 130, 170], a: 0.42 },
  { dx: 0.27, dy: 0.33, spread: 0.68, rgb: [240, 138, 95], a: 0.5 },
  { dx: 0.02, dy: 0.42, spread: 0.46, rgb: [245, 185, 115], a: 0.36 },
];

/** Sits on the composer's right edge so it reads as peeking over it. */
const ORB_CX = BOX_X + BOX_W;
const ORB_CY = 306;
const ORB_R = 64;

const EYE_W = ORB_R * 0.19;
const EYE_H = ORB_R * 0.33;
const EYE_GAP = ORB_R * 0.26;
const EYE_TOP = ORB_CY - EYE_H * 0.12 - EYE_H / 2;

/* The canvas loop advances 0.0018 rad/frame; at 60fps that is one turn in 58s.
   The double blink is a 3s period: close/open, a 160ms gap, then close/open. */
const ORB_CSS = `
@keyframes beonai-orb-spin {
  to { transform: rotate(360deg); }
}
@keyframes beonai-orb-blink {
  0%, 1.6%   { transform: scaleY(1); }
  2.4%       { transform: scaleY(0.04); }
  3.3%, 8.6% { transform: scaleY(1); }
  10.3%      { transform: scaleY(0.04); }
  12%, 100%  { transform: scaleY(1); }
}
.beonai-orb-lights {
  transform-box: view-box;
  transform-origin: ${ORB_CX}px ${ORB_CY}px;
  animation: beonai-orb-spin 58s linear infinite;
}
.beonai-orb-eyes {
  transform-box: view-box;
  transform-origin: ${ORB_CX}px ${EYE_TOP + EYE_H / 2}px;
  animation: beonai-orb-blink 3s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .beonai-orb-lights, .beonai-orb-eyes { animation: none; }
}
`;

function Orb() {
  return (
    <>
      <defs>
        {LIGHTS.map(({ rgb, a }, i) => {
          const [r, g, b] = rgb;
          return (
            <radialGradient key={i} id={`beonai-light-${i}`}>
              <stop offset="0" stopColor={`rgb(${r},${g},${b})`} stopOpacity={a} />
              <stop offset="0.45" stopColor={`rgb(${r},${g},${b})`} stopOpacity={a * 0.35} />
              <stop offset="1" stopColor={`rgb(${r},${g},${b})`} stopOpacity="0" />
            </radialGradient>
          );
        })}

        {/* Spherical falloff. The canvas gradient starts at 0.42R, so the
            stops are remapped onto a full-radius gradient. */}
        <radialGradient id="beonai-orb-shade">
          <stop offset="0.42" stopColor="rgb(180,165,148)" stopOpacity="0" />
          <stop offset="0.8" stopColor="rgb(180,165,148)" stopOpacity="0.06" />
          <stop offset="0.91" stopColor="rgb(160,145,128)" stopOpacity="0.2" />
          <stop offset="1" stopColor="rgb(140,125,108)" stopOpacity="0.42" />
        </radialGradient>

        {/* Specular highlight: offset focal point, hence fx/fy. */}
        <radialGradient
          id="beonai-orb-spec"
          gradientUnits="userSpaceOnUse"
          cx={ORB_CX - ORB_R * 0.21}
          cy={ORB_CY - ORB_R * 0.24}
          r={ORB_R * 0.48}
          fx={ORB_CX - ORB_R * 0.26}
          fy={ORB_CY - ORB_R * 0.28}
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <clipPath id="beonai-orb-clip">
          <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} />
        </clipPath>
      </defs>

      <style>{ORB_CSS}</style>

      <g clipPath="url(#beonai-orb-clip)">
        <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="#faf9f6" />

        <g className="beonai-orb-lights">
          {LIGHTS.map(({ dx, dy, spread }, i) => (
            <circle
              key={i}
              cx={ORB_CX + dx * ORB_R * 1.38}
              cy={ORB_CY + dy * ORB_R * 1.38}
              r={spread * ORB_R * 1.55}
              fill={`url(#beonai-light-${i})`}
            />
          ))}
        </g>

        <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="url(#beonai-orb-shade)" />
        <circle cx={ORB_CX} cy={ORB_CY} r={ORB_R} fill="url(#beonai-orb-spec)" />
      </g>

      <g className="beonai-orb-eyes" fill="#1a1a17">
        <rect
          x={ORB_CX - EYE_GAP / 2 - EYE_W}
          y={EYE_TOP}
          width={EYE_W}
          height={EYE_H}
          rx={EYE_W / 2}
        />
        <rect
          x={ORB_CX + EYE_GAP / 2}
          y={EYE_TOP}
          width={EYE_W}
          height={EYE_H}
          rx={EYE_W / 2}
        />
      </g>
    </>
  );
}

/** Active-skill pill. Icons are omitted — at this scale they are 5px of noise. */
function Pill({ x, w, label }: { x: number; w: number; label: string }) {
  return (
    <>
      <rect
        x={x}
        y={282}
        width={w}
        height={72}
        rx={36}
        fill={ACCENT_SOFT}
        stroke={ACCENT}
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <text
        x={x + w / 2}
        y={331}
        fill={ACCENT}
        fontSize="38"
        fontWeight="500"
        textAnchor="middle"
        style={{ fontFamily: SANS }}
      >
        {label}
      </text>
    </>
  );
}

export function BeonAIArt() {
  return (
    <ArtFrame label="BeonAI — your agent for AI visibility">
      <Ground fill={BG} />

      {/* Corner identity */}
      <Mark mark={BEONAI_MARK} x={86} y={50} size={100} fill={INK} />
      <text
        x={202}
        y={128}
        fill={INK}
        fontSize="76"
        fontWeight="600"
        letterSpacing="-1"
        style={{ fontFamily: SANS }}
      >
        BeonAI
      </text>

      {/* Composer */}
      <rect
        x={BOX_X}
        y={BOX_Y}
        width={BOX_W}
        height={BOX_H}
        rx={36}
        fill={SURFACE}
        stroke={BORDER}
        strokeWidth="2"
      />

      <Pill x={INNER_L} w={352} label="Visibility Audit" />
      <Pill x={INNER_L + 372} w={322} label="GTM Playbook" />

      <text fill={INK} fontSize="58" style={{ fontFamily: SANS }}>
        <tspan x={INNER_L} y={470}>
          Plan a Q2 GTM around the prompts
        </tspan>
        <tspan x={INNER_L} y={546}>
          {"I’m losing to Postmark."}
        </tspan>
      </text>

      <line x1={INNER_L} y1={622} x2={INNER_R} y2={622} stroke={RULE} strokeWidth="2" />

      <text
        x={INNER_L}
        y={702}
        fill={INK_3}
        fontSize="34"
        style={{ fontFamily: MONO }}
      >
        Attach CSV / Audit
      </text>

      <rect x={INNER_R - 310} y={652} width={310} height={78} rx={39} fill={ACCENT} />
      <text
        x={INNER_R - 178}
        y={702}
        fill="#fff"
        fontSize="40"
        fontWeight="500"
        textAnchor="middle"
        style={{ fontFamily: SANS }}
      >
        Run Plan
      </text>
      <path
        d={`M ${INNER_R - 62} 706 L ${INNER_R - 62} 676 M ${INNER_R - 76} 690 L ${INNER_R - 62} 676 L ${INNER_R - 48} 690`}
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Peeking over the composer's right edge, drawn last so it sits above it */}
      <Orb />

      {/* Positioning line */}
      <text x={96} y={896} fontSize="62" fontWeight="500" style={{ fontFamily: SANS }}>
        <tspan fill={INK}>Your </tspan>
        <tspan fill={ACCENT}>Agent</tspan>
        <tspan fill={INK}> for AI Visibility</tspan>
      </text>
    </ArtFrame>
  );
}
