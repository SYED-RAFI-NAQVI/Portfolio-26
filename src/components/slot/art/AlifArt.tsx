/**
 * Alif — card artwork, drawn rather than generated.
 *
 * Mark, wordmark, one line. The card renders around 420px wide, so anything
 * beyond a lockup and a single sentence stops being information and becomes
 * texture.
 *
 * One SVG on a fixed viewBox, so proportions hold at any width and the type
 * stays vector-crisp. Brand blue and the mark come from public/alif-logo.svg.
 */

const BLUE = "#2A2AFF";
const BLUE_LIFT = "#5757FF";
const INK = "#0A0A0C";

/** Alif's own stack. */
const SANS = '"General Sans", "Inter", "Helvetica Neue", Arial, sans-serif';

/** The ALIF LABS glyph, lifted verbatim from the logo file. */
const GLYPH =
  "M 325 356 A 8 8 0 0 1 333 348 L 403 348 A 6 6 0 0 1 409 354 L 409 404 A 28 28 0 0 0 437 432 L 596 432 A 28 28 0 0 0 624 404 L 624 354 A 6 6 0 0 1 630 348 L 700 348 A 8 8 0 0 1 708 356 L 708 433 A 51.2 51.2 0 1 0 708 515 L 708 595 A 8 8 0 0 1 700 603 L 656 603 A 28 28 0 0 0 628 631 L 628 678 A 8 8 0 0 1 620 686 L 413 686 A 8 8 0 0 1 405 678 L 405 631 A 28 28 0 0 0 377 603 L 333 603 A 8 8 0 0 1 325 595 L 325 515 A 51.2 51.2 0 1 0 325 433 L 325 356 Z M 443 515 L 589 515 A 34 34 0 0 1 623 549 L 623 570 A 34 34 0 0 1 589 604 L 443 604 A 34 34 0 0 1 409 570 L 409 549 A 34 34 0 0 1 443 515 Z";

const GLYPH_TRANSFORM =
  "rotate(180 192 192) translate(58 74) scale(0.70) translate(-325 -348)";

export function AlifArt() {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="img"
      aria-label="Alif — AI teammates that learn how your organization works"
    >
      <rect width="1600" height="1000" fill={INK} />

      {/* Lockup: mark + wordmark, optically centred as one unit */}
      <g transform="translate(566 356) scale(0.49)">
        <rect width="384" height="384" rx="80" fill={BLUE} />
        <path fill="#FFFFFF" fillRule="evenodd" transform={GLYPH_TRANSFORM} d={GLYPH} />
      </g>

      <text
        x="784"
        y="518"
        fill="#FFFFFF"
        fontFamily={SANS}
        fontSize="164"
        fontWeight="600"
        letterSpacing="-7"
      >
        Alif
      </text>

      <text
        x="800"
        y="648"
        fill={BLUE_LIFT}
        fontFamily={SANS}
        fontSize="44"
        fontWeight="500"
        letterSpacing="-0.8"
        textAnchor="middle"
      >
        AI teammates that learn how your organization works.
      </text>
    </svg>
  );
}
