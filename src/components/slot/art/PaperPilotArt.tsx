import { ArtFrame, Ground, SANS, MONO } from "./kit";

/**
 * Paper Pilot — card artwork.
 *
 * The product grounded every answer to the exact page it came from, so the
 * card is a highlighted passage with a citation marker — the gesture a
 * researcher makes, drawn at poster scale.
 *
 * Identity stacks in the corner and the sentence takes the rest of the frame.
 * An earlier pass hung the tagline below the sentence, which left it orphaned
 * and the lower third of the artwork empty — and empty reads as a hole here,
 * because this ground is near-black rather than BeonAI's cream.
 *
 * #ff9c01 is sampled from public/paperpilot-logo.png.
 */

const ORANGE = "#ff9c01";
const BG = "#0b0907";
const INK = "#f2efe9";
const DIM = "#8a8078";

const SIZE = 104;

/** Marker swipe, sized to "to the exact page" at SIZE with even padding. */
const HL_X = 80;
const HL_Y = 526;
const HL_W = 930;
const HL_H = 132;

export function PaperPilotArt() {
  return (
    <ArtFrame label="Paper Pilot — every answer traced back to the page it came from">
      <Ground fill={BG} />

      {/* Identity, stacked */}
      <text
        x={104}
        y={150}
        fontSize="74"
        fontWeight="700"
        letterSpacing="-1.5"
        fill={ORANGE}
        style={{ fontFamily: SANS }}
      >
        Paper Pilot
      </text>
      <text
        x={106}
        y={212}
        fontSize="30"
        fontWeight="600"
        letterSpacing="10"
        fill={DIM}
        style={{ fontFamily: MONO }}
      >
        AI LITERATURE REVIEW
      </text>

      {/* The swipe sits under the line it marks. */}
      <rect x={HL_X} y={HL_Y} width={HL_W} height={HL_H} rx={9} fill={ORANGE} />

      <g fontSize={SIZE} fontWeight="600" letterSpacing="-3" style={{ fontFamily: SANS }}>
        <text x={104} y={470} fill={INK}>
          Every answer traced back
        </text>
        <text x={104} y={620} fill={BG}>
          to the exact page
        </text>
        <text x={104} y={770} fill={INK}>
          it came from.
        </text>
      </g>

      {/* Citation marker, set as a superscript against the full stop. */}
      <rect x={790} y={694} width={32} height={32} rx={8} fill={ORANGE} />
    </ArtFrame>
  );
}
