"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  /**
   * `?games=1` floats the playable builds to the top of the collection — the
   * home page's games badge is the only thing that sets it. Nothing is removed;
   * the rest of the archive stays below. Held in state rather than read from
   * the URL on every render so dismissing it does not depend on the navigation
   * landing first.
   */
  const params = useSearchParams();
  const router = useRouter();
  const [gamesFirst, setGamesFirst] = useState(params.get("games") === "1");

  const clearGames = useCallback(() => {
    setGamesFirst(false);
    router.replace("/work", { scroll: false });
  }, [router]);

  /**
   * Remount key for the machine.
   *
   * Clearing the gallery alone would leave the drums parked on a combination
   * that no longer filters anything. The machine owns its landed faces, strip
   * offsets and rAF loop internally, so bumping its React key is the honest
   * way to put all of it back to the start — every reel returns to rest
   * together rather than being unwound piece by piece.
   */
  const [machineKey, setMachineKey] = useState(0);

  const onSpinStart = useCallback(() => setSpinning(true), []);

  const onResolve = useCallback((res: SpinResult) => {
    setSpinning(false);
    setResult(res);
  }, []);

  const onReset = useCallback(() => {
    setResult(null);
    setSpinning(false);
    setMachineKey((n) => n + 1);
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

          <SlotMachine
            key={machineKey}
            onResolve={onResolve}
            onSpinStart={onSpinStart}
            onReset={onReset}
            canReset={result !== null}
          />

          {gamesFirst && (
            <button
              type="button"
              className={styles.gamesChip}
              onClick={clearGames}
            >
              <span className={styles.gamesDot} aria-hidden="true" />
              PLAYABLE FIRST
              <span className={styles.gamesClear} aria-hidden="true">×</span>
            </button>
          )}

          <p className={styles.foot}>DRAG THE KNOB DOWN</p>
        </div>
      </aside>

      <WorkGallery result={result} spinning={spinning} gamesFirst={gamesFirst} />
    </div>
  );
}
