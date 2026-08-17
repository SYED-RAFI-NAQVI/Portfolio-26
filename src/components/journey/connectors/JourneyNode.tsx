import styles from "./JourneyConnector.module.css";

type JourneyNodeProps = {
  /** If true, the border and center become white. */
  active?: boolean;
  className?: string;
};

/**
 * A tiny reusable timeline connection node.
 * Dark square with a 1px border and a tiny center dot.
 */
export function JourneyNode({ active, className }: JourneyNodeProps) {
  return (
    <span
      className={`${styles.node}${active ? ` ${styles.nodeActive}` : ""}${
        className ? ` ${className}` : ""
      }`}
      aria-hidden="true"
    >
      <span className={styles.nodeCenter} />
    </span>
  );
}

type JourneyConnectorCapProps = {
  className?: string;
};

/**
 * A subtle square cap where a routed connector reaches a destination card.
 */
export function JourneyConnectorCap({ className }: JourneyConnectorCapProps) {
  return (
    <span
      className={`${styles.cap}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
