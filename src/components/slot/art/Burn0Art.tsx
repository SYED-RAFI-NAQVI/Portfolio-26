import { ArtFrame, Ground, MONO, SANS } from "./kit";

/**
 * burn0 — card artwork.
 *
 * Type only: the wordmark and the line. burn0 is a library you never look at,
 * so drawing a surface for it was always inventing one — three versions tried
 * a TUI, a receipt and a terminal, and each read as an explanation rather than
 * a mark.
 *
 * Palette is the authoritative one from globals.css (43 uses of the accent
 * across src), not the TUI's theme.ts — those disagree, #FF4500 against
 * #ff7a00, and #FF4500 is what ships. The accent lands on the 0 and nowhere
 * else, which is the wordmark's whole construction.
 */

const BG = "#09090b";
const TEXT = "#fafafa";
const TEXT_2 = "#a1a1aa";
const ACCENT = "#ff4500";

export function Burn0Art() {
  return (
    <ArtFrame label="burn0 — know what your code costs">
      <Ground fill={BG} />

      <text
        x={800}
        y={512}
        fontSize="240"
        fontWeight="700"
        letterSpacing="-12"
        textAnchor="middle"
        style={{ fontFamily: MONO }}
      >
        <tspan fill={TEXT}>burn</tspan>
        <tspan fill={ACCENT}>0</tspan>
      </text>

      <text
        x={800}
        y={624}
        fontSize="62"
        fontWeight="500"
        letterSpacing="-1"
        textAnchor="middle"
        fill={TEXT_2}
        style={{ fontFamily: SANS }}
      >
        Know what your code costs
      </text>
    </ArtFrame>
  );
}
