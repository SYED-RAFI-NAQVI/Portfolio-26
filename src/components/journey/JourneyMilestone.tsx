import type { JourneyMilestone as JourneyMilestoneData } from "../../data/journey";
import { JourneyCmd } from "./JourneyCmd";
import { JourneyConnector, type JourneyConnectorVariant } from "./connectors/JourneyConnector";
import styles from "./JourneyExperience.module.css";

type JourneyMilestoneProps = {
  milestone: JourneyMilestoneData;
};

function getAlignmentClass(variant: JourneyConnectorVariant) {
  if (variant === "vertical" || variant === "short-branch") return styles.alignCenter;
  if (variant.endsWith("right")) return styles.alignStart;
  if (variant.endsWith("left")) return styles.alignEnd;
  return styles.alignCenter;
}

export function JourneyMilestone({ milestone }: JourneyMilestoneProps) {
  const isAbove = milestone.side === "above";
  const connectorVariant = (milestone.connector as JourneyConnectorVariant) ?? "vertical";

  return (
    <article
      className={`${styles.milestone} flex-none px-6 md:px-10 lg:px-14`}
      data-kind={milestone.kind}
      data-size={milestone.size ?? "md"}
      aria-label={milestone.title}
    >
      {/* 1. Connector line reaching out from timeline */}
      <div
        className={`${styles.connectorBox} ${
          isAbove ? styles.connectorAbove : styles.connectorBelow
        } ${getAlignmentClass(connectorVariant)}`}
        aria-hidden="true"
      >
        <JourneyConnector
          variant={connectorVariant}
          direction={isAbove ? "up" : "down"}
          showSignal
          animateIn
        />
      </div>

      {/* 2. Destination CMD Card */}
      <div
        className={`${styles.milestoneContent} ${
          isAbove ? styles.contentAbove : styles.contentBelow
        }`}
      >
        <JourneyCmd
          title={`${milestone.kind.toUpperCase()}.LOG`}
          meta={[milestone.indexLabel, milestone.year, ...milestone.meta].join(
            " · ",
          )}
          command={`cat ${milestone.id}`}
          description={milestone.summary}
        />
      </div>

      {/* 3. Timeline Marker */}
      <div className={styles.markerRow} aria-hidden="true">
        <span className={`${styles.marker} ${styles.markerActive}`} />
        <span className={styles.markerIndex}>{milestone.indexLabel}</span>
      </div>
    </article>
  );
}

