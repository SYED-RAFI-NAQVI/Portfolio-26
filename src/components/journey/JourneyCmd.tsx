import type { ReactNode } from "react";
import styles from "./JourneyCmd.module.css";

export type JourneyCmdProps = {
  /** Terminal window title (top-right mono label). */
  title?: string;
  /** Metadata line above the command. */
  meta?: string;
  /** Terminal command text (displayed after `$`). */
  command?: string;
  /** Output / description below the command line. */
  description?: ReactNode;
  /** Custom body content — replaces the default meta / command / description. */
  children?: ReactNode;
  /** Additional CSS class on the root element. */
  className?: string;
  /** Show a blinking block cursor after the command. @default true */
  showCursor?: boolean;
  /** Seconds for one full tracer loop around the perimeter. @default 6 */
  tracerSpeed?: number;
  /** Tracer visible length as a percentage of the perimeter (0–100). @default 6 */
  tracerLength?: number;
  /** Tracer stroke width in pixels. @default 2 */
  tracerThickness?: number;
};

/**
 * A reusable dark terminal / CMD card with one electric-white tracer
 * traveling continuously around its static border.
 *
 * Sizing is controlled by the parent — the component fills `width: 100%; height: 100%`.
 *
 * The tracer uses an SVG `<rect>` with `pathLength="100"`, making its
 * dash values percentage-based and fully dimension-independent.
 */
export function JourneyCmd({
  title = "RAFI.JOURNEY",
  meta,
  command,
  description,
  children,
  className,
  showCursor = true,
  tracerSpeed = 6,
  tracerLength = 6,
  tracerThickness = 2,
}: JourneyCmdProps) {
  const hasDefaultBody = !!(meta || command || description);

  return (
    <div className={`${styles.cmd}${className ? ` ${className}` : ""}`}>
      {/* ── Electric tracer ──────────────────────────────────────── */}
      <svg className={styles.electricBorder} aria-hidden="true">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          pathLength={100}
          rx="0"
          className={styles.tracer}
          style={{
            strokeDasharray: `${tracerLength} ${100 - tracerLength}`,
            animationDuration: `${tracerSpeed}s`,
            strokeWidth: tracerThickness,
          }}
        />
      </svg>

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className={styles.bar}>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        {title && <span className={styles.title}>{title}</span>}
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className={styles.body}>
        {children ??
          (hasDefaultBody ? (
            <>
              {meta && <p className={styles.meta}>{meta}</p>}
              {command && (
                <div className={styles.line}>
                  <span className={styles.prompt}>$</span>
                  <span>
                    {command}
                    {showCursor && (
                      <span
                        className={styles.cursor}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </div>
              )}
              {description && (
                <div className={styles.output}>{description}</div>
              )}
            </>
          ) : null)}
      </div>
    </div>
  );
}
