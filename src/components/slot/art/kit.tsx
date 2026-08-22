/**
 * Shared building blocks for coded card artwork.
 *
 * Every card's art is one SVG on the same fixed viewBox, so proportions hold
 * at any card width — which matters here because buildSpans() hands cards a
 * span of 2, 3 or 5 columns, and the same artwork has to survive all three.
 *
 * The rules these primitives encode, learned the hard way on AlifArt:
 *
 *   - The card renders around 420px wide against a 1600-unit viewBox, so one
 *     screen pixel is ~3.8 viewBox units. Anything below ~28 units is under
 *     7px on screen and reads as noise rather than information.
 *   - Prefer a handful of large shapes. Detail added at this scale costs file
 *     size and buys texture, not meaning.
 *   - Type comes from the fonts the app already loads, referenced through
 *     their CSS variables so the art inherits whatever layout.tsx wires up.
 */

export const ART_W = 1600;
export const ART_H = 1000;

/** Fonts already loaded in layout.tsx and exposed as CSS variables on <html>. */
export const SANS = "var(--font-geist-sans), system-ui, sans-serif";
export const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** Standard wrapper: fixed viewBox, fills its .cover box, labelled for a11y. */
export function ArtFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

/** Full-bleed background. */
export function Ground({ fill }: { fill: string }) {
  return <rect width={ART_W} height={ART_H} fill={fill} />;
}

/**
 * Place a brand mark authored in its own coordinate system.
 *
 * A nested <svg> does the coordinate mapping, so marks can be dropped in at
 * any size without hand-computing a transform chain per use.
 */
export function Mark({
  mark,
  x,
  y,
  size,
  fill,
}: {
  mark: { viewBox: string; transform: string; d: string };
  x: number;
  y: number;
  size: number;
  fill: string;
}) {
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox={mark.viewBox}
      preserveAspectRatio="xMidYMid meet"
      overflow="visible"
    >
      <g transform={mark.transform}>
        <path d={mark.d} fill={fill} />
      </g>
    </svg>
  );
}
