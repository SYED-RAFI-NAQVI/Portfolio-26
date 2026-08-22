"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import styles from "./WorkExplorer.module.css";
import { SlotMachine } from "./SlotMachine";
import { WorkGallery } from "./WorkGallery";
import type { SpinResult } from "../../data/slot";

/**
 * Two-column Work page.
 *
 * Left is the control surface — heading, copy, and the machine — pinned while
 * the collection scrolls on the right. The machine owns no results UI of its
 * own; it hands each spin up here and the gallery re-ranks in place.
 */
export function WorkExplorer() {
  const [result, setResult] = useState<SpinResult | null>(null);
  const [spinning, setSpinning] = useState(false);

  const onSpinStart = useCallback(() => setSpinning(true), []);

  const onResolve = useCallback((res: SpinResult) => {
    setSpinning(false);
    setResult(res);
  }, []);

  return (
    <div className={styles.split}>
      <aside className={styles.control}>
        <div className={styles.controlInner}>
          <Link className={styles.back} href="/">
            <span className={styles.backArrow} aria-hidden="true">←</span>
            Back
          </Link>

          <h1 className={styles.title}>
            Everything I&apos;ve shipped since 2017.{" "}
            <span className={styles.titleNext}>
              The billion-dollar one is ahead.
            </span>
          </h1>

          <SlotMachine onResolve={onResolve} onSpinStart={onSpinStart} />

          <p className={styles.foot}>DRAG THE KNOB DOWN</p>
        </div>
      </aside>

      <WorkGallery result={result} spinning={spinning} />
    </div>
  );
}
