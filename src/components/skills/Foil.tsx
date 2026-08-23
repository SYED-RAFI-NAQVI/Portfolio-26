"use client";

import { useCallback, useRef } from "react";
import styles from "./Foil.module.css";

/** Degrees of tilt at the very edge of the card. */
const MAX_TILT = 10;
/** Short enough that the surface tracks the cursor instead of chasing it. */
const TRACK_MS = "90ms";
/** The return is the only part that should read as mass. */
const SETTLE_MS = "500ms";
/** Pixels the label drifts against the tilt, faking depth above the face. */
const LABEL_SHIFT = 7;

/**
 * Pointer tracking for a holographic card.
 *
 * Returns handlers plus the ref to attach to whatever element should tilt.
 * Every value is written as a CSS custom property straight to that node —
 * custom properties inherit, so the foil layers pick them up wherever they sit
 * inside it. Going through React state instead would mean a render per
 * pointermove, which across 35 grid cards is the whole cost of the page.
 */
export function useFoil<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();

    // Percent across the card, inverted so the foil sweeps against the cursor
    // rather than following it — light moves opposite the tilt.
    const px = 100 - ((e.clientX - left) / width) * 100;
    const py = 100 - ((e.clientY - top) / height) * 100;

    // Band tracks close to the pointer; the sparkle sheet lags well behind it.
    // That difference is the parallax that makes the light feel layered.
    const bandX = 50 + (px - 50) / 1.5;
    const bandY = 50 + (py - 50) / 1.5;
    const sparkX = 50 + (px - 50) / 7;
    const sparkY = 50 + (py - 50) / 7;

    // Distance from centre on both axes, so the foil flares at the corners and
    // all but vanishes dead centre.
    const spread = Math.abs(50 - px) + Math.abs(50 - py);
    const lit = Math.min(1, (20 + spread * 1.5) / 100);

    // −1…+1 from the centre, for the tilt itself.
    const nx = ((e.clientX - left) / width) * 2 - 1;
    const ny = ((e.clientY - top) / height) * 2 - 1;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // Positive rotateY sends the right edge back; it is *positive* rotateX
      // that sends the top back, hence the negation on the vertical only.
      el.style.setProperty("--ry", `${nx * MAX_TILT}deg`);
      el.style.setProperty("--rx", `${-ny * MAX_TILT}deg`);

      el.style.setProperty("--band-x", `${bandX}%`);
      el.style.setProperty("--band-y", `${bandY}%`);
      el.style.setProperty("--spark-x", `${sparkX}%`);
      el.style.setProperty("--spark-y", `${sparkY}%`);
      el.style.setProperty("--lit", `${lit}`);

      // The label cannot use translateZ for its depth: the card clips its
      // artwork with `overflow: hidden`, and that forces `transform-style`
      // back to flat, collapsing any 3D its children try to occupy. Shifting
      // it against the tilt in plain 2D reads as the same parallax.
      el.style.setProperty("--shift-x", `${-nx * LABEL_SHIFT}px`);
      el.style.setProperty("--shift-y", `${-ny * LABEL_SHIFT}px`);

      el.style.setProperty("--turn", TRACK_MS);
      el.style.setProperty("--fade", "0ms");
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--turn", SETTLE_MS);
    el.style.setProperty("--fade", "500ms");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lit", "0");
    el.style.setProperty("--shift-x", "0px");
    el.style.setProperty("--shift-y", "0px");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}

/** The two blended layers. Reads the custom properties set by `useFoil`. */
export function Foil() {
  return (
    <>
      <span className={styles.band} aria-hidden="true" />
      <span className={styles.spark} aria-hidden="true" />
    </>
  );
}
