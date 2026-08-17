"use client";

import { useRef } from "react";
import type { JourneyMilestone as JourneyMilestoneData } from "../../data/journey";
import { JourneyMilestone } from "./JourneyMilestone";
import styles from "./JourneyExperience.module.css";
import { useHorizontalJourney } from "./useHorizontalJourney";

type JourneyExperienceProps = {
  milestones: JourneyMilestoneData[];
};

export function JourneyExperience({ milestones }: JourneyExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useHorizontalJourney({ sectionRef, trackRef, progressRef });

  return (
    <main className={styles.root}>
      <section
        ref={sectionRef}
        className={styles.scrollSection}
        aria-label="Rafi's journey"
      >
        <div className={styles.stickyStage}>
          <div className={styles.grid} aria-hidden="true" />

          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-6 px-5 pt-5 md:px-8 md:pt-7">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--journey-mute)] md:text-xs">
                Rafi Naqvi / Journey
              </p>
              <p className="mt-2 max-w-[32ch] text-xs leading-5 text-[var(--journey-faint)] md:text-sm">
                Scroll vertically. Time moves horizontally.
              </p>
            </div>

            <div className="hidden text-right font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--journey-faint)] sm:block md:text-xs">
              <div>Archive / Foundation</div>
              <div className="mt-1">Direction / X+</div>
            </div>
          </header>

          <div className={styles.viewport}>
            <div ref={trackRef} className={styles.track}>
              <div className={styles.axis} aria-hidden="true" />

              <div className={styles.introPanel}>
                <div className="max-w-[760px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--journey-mute)] md:text-xs">
                    00 / The archive begins
                  </p>
                  <h1 className="mt-4 max-w-[12ch] text-[clamp(3.25rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[var(--journey-ink)]">
                    Not a resume. A trail of evidence.
                  </h1>
                  <p className="mt-6 max-w-[42ch] text-sm leading-6 text-[var(--journey-body)] md:text-base">
                    This first pass establishes the canvas, timeline, spacing, and scroll behavior. The real story comes next.
                  </p>
                </div>
              </div>

              {milestones.map((milestone) => (
                <JourneyMilestone key={milestone.id} milestone={milestone} />
              ))}

              <div className={styles.outroPanel}>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--journey-mute)] md:text-xs">
                    End / For now
                  </p>
                  <p className="mt-4 max-w-[10ch] text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--journey-ink)] md:text-6xl">
                    The track keeps extending.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-8 md:pb-7">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--journey-faint)] md:text-xs">
                Start
              </span>
              <div className={styles.progressRail}>
                <div ref={progressRef} className={styles.progressFill} />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--journey-faint)] md:text-xs">
                Now
              </span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
