import styles from "./JourneyConnector.module.css";

export type JourneyConnectorVariant =
  | "vertical"
  | "horizontal"
  | "deflect-right"
  | "deflect-left"
  | "double-bend-right"
  | "double-bend-left"
  | "short-branch";

export type JourneyConnectorProps = {
  /** Connector route shape. */
  variant: JourneyConnectorVariant;
  /** Orientation. Vertical variants default to "up"; horizontal defaults to "right". */
  direction?: "up" | "down" | "left" | "right";
  /** Show a moving white signal along the route. */
  showSignal?: boolean;
  /** Animate the line drawing in from start → end on mount. */
  animateIn?: boolean;
  /** Seconds per signal loop. @default 4 */
  signalSpeed?: number;
  /** Signal visible length as % of path (0–100). @default 8 */
  signalLength?: number;
  /** Additional CSS class on the SVG root. */
  className?: string;
};

/* ─── Path definitions (normalized 0–100 coordinate space) ───────────────── */

const PATHS: Record<string, Record<string, string>> = {
  vertical: {
    up: "M 50 100 L 50 0",
    down: "M 50 0 L 50 100",
  },
  horizontal: {
    right: "M 0 50 L 100 50",
    left: "M 100 50 L 0 50",
  },
  "deflect-right": {
    up: "M 0 100 L 0 58 L 55 18 L 100 18",
    down: "M 0 0 L 0 42 L 55 82 L 100 82",
  },
  "deflect-left": {
    up: "M 100 100 L 100 58 L 45 18 L 0 18",
    down: "M 100 0 L 100 42 L 45 82 L 0 82",
  },
  "double-bend-right": {
    up: "M 0 100 L 0 68 L 28 46 L 48 46 L 48 18 L 100 18",
    down: "M 0 0 L 0 32 L 28 54 L 48 54 L 48 82 L 100 82",
  },
  "double-bend-left": {
    up: "M 100 100 L 100 68 L 72 46 L 52 46 L 52 18 L 0 18",
    down: "M 100 0 L 100 32 L 72 54 L 52 54 L 52 82 L 0 82",
  },
  "short-branch": {
    up: "M 50 100 L 50 0",
    down: "M 50 0 L 50 100",
  },
};

function resolveDirection(
  variant: JourneyConnectorVariant,
  direction?: "up" | "down" | "left" | "right",
): string {
  if (variant === "horizontal") {
    return direction === "left" ? "left" : "right";
  }
  return direction === "down" ? "down" : "up";
}

/**
 * A reusable SVG connector line for the Journey timeline.
 *
 * All paths use a normalized `viewBox="0 0 100 100"` with
 * `preserveAspectRatio="none"`, so the geometry stretches to fill any
 * container size. `pathLength={100}` makes dash values percentage-based.
 *
 * Sizing is controlled by the parent container.
 */
export function JourneyConnector({
  variant,
  direction,
  showSignal = false,
  animateIn = false,
  signalSpeed = 4,
  signalLength = 8,
  className,
}: JourneyConnectorProps) {
  const dir = resolveDirection(variant, direction);
  const d = PATHS[variant]?.[dir] ?? PATHS.vertical.up;
  const signalDelay = animateIn ? 1.2 : 0;

  return (
    <svg
      className={`${styles.connector}${className ? ` ${className}` : ""}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Static base line (optionally draws in) */}
      <path
        d={d}
        pathLength={100}
        className={styles.line}
        data-draw-in={animateIn || undefined}
      />

      {/* Moving signal on top of the base line */}
      {showSignal && (
        <path
          d={d}
          pathLength={100}
          className={styles.signal}
          data-delay={animateIn || undefined}
          style={
            {
              strokeDasharray: `${signalLength} ${100 - signalLength}`,
              "--signal-speed": `${signalSpeed}s`,
              "--signal-delay": `${signalDelay}s`,
            } as React.CSSProperties
          }
        />
      )}
    </svg>
  );
}
