"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./WorkExplorer.module.css";
import { SlotMachine } from "./SlotMachine";
import { WorkGallery } from "./WorkGallery";
import { FOCUS_LABEL, isFocus, type SpinResult } from "../../data/slot";

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
   * `?focus=` floats one slice of the archive to the top — the home page's
   * four entry points are the only things that set it. Nothing is removed; the
   * rest stays below. Held in state rather than read from the URL on every
   * render so dismissing it does not depend on the navigation landing first.
   */
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("focus");
  const [focus, setFocus] = useState(isFocus(initial) ? initial : null);

  const clearFocus = useCallback(() => {
    setFocus(null);
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

  /* Small screens only — the dock slides off to the right and leaves its tab
     at the edge. Above the breakpoint the machine is in the flow and the tab
     is not rendered visible, so this stays false and costs nothing. */
  const [machineHidden, setMachineHidden] = useState(false);

  /**
   * Easy mode drops the machine and lays the archive out as a plain two-up
   * grid. Switching clears the spin and remounts the machine: the machine
   * keeps its landed faces in internal state and in DOM transforms written
   * outside React, so leaving it mounted-but-hidden would hand its
   * ResizeObserver a zero width and park the drums between faces. Coming back
   * to a blank machine and an unranked gallery is at least consistent.
   */
  const [easy, setEasy] = useState(false);

  const toggleMode = useCallback(() => {
    setEasy((on) => !on);
    setResult(null);
    setSpinning(false);
    setMachineKey((n) => n + 1);
  }, []);

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
          <div className={styles.topBar}>
            <Link className={styles.back} href="/">
              <span className={styles.backArrow} aria-hidden="true">←</span>
              Back
            </Link>

            <button
              type="button"
              className={styles.modeToggle}
              onClick={toggleMode}
              data-easy={easy ? "true" : "false"}
              aria-pressed={easy}
            >
              {easy ? "Slot mode" : "Easy mode"}
            </button>
          </div>

          <h1 className={styles.title}>
            Everything I&apos;ve shipped since 2017.{" "}
            <span className={styles.titleNext}>
              The billion-dollar one is ahead.
            </span>
          </h1>

          {/* Wrapped so the machine can leave the flow on small screens and
              dock to the bottom edge, letting the collection own the scroll.
              On desktop this div is inert — the aside still lays out as it
              always did. */}
          {!easy && (
            <div
              className={styles.machineDock}
              data-hidden={machineHidden ? "true" : "false"}
            >
              <button
                type="button"
                className={styles.dockToggle}
                onClick={() => setMachineHidden((h) => !h)}
                aria-expanded={!machineHidden}
                aria-label={
                  machineHidden ? "Show the machine" : "Hide the machine"
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={machineHidden ? "M15 5L8 12l7 7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>

              <SlotMachine
                key={machineKey}
                onResolve={onResolve}
                onSpinStart={onSpinStart}
                onReset={onReset}
                canReset={result !== null}
              />
            </div>
          )}

          {focus && (
            <button
              type="button"
              className={styles.gamesChip}
              onClick={clearFocus}
            >
              <span className={styles.gamesDot} aria-hidden="true" />
              {FOCUS_LABEL[focus]}
              <span className={styles.gamesClear} aria-hidden="true">×</span>
            </button>
          )}

          {!easy && <p className={styles.foot}>DRAG THE KNOB DOWN</p>}
        </div>
      </aside>

      <WorkGallery
        result={result}
        spinning={spinning}
        focus={focus}
        easy={easy}
      />
    </div>
  );
}
