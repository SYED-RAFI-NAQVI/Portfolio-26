"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./GamesBadge.module.css";
import { sound } from "../../sounds";

/** Gap between the sound controls and this badge. */
const GAP = 12;

/**
 * Entry point to the playable work, parked next to the sound control.
 *
 * The sound control is `position: fixed` and its width changes with its label,
 * so this measures it rather than guessing an offset — a hardcoded `left`
 * would drift the moment that copy changed.
 */
export function GamesBadge() {
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    // Two controls share that corner and swap: the "click for sound" prompt
    // until audio unlocks, the pill after. Both stay mounted — the hidden one
    // is only faded out — so measuring the widest would leave this cleared for
    // a control that is no longer on screen. Track whichever is actually
    // visible and follow it across the swap.
    const peers = Array.from(
      document.querySelectorAll("[data-sound-toggle], [data-sound-prompt]"),
    );
    if (!peers.length) return;

    const measure = () => {
      const visible = peers.reduce((best, el) =>
        Number(getComputedStyle(el).opacity) >
        Number(getComputedStyle(best).opacity)
          ? el
          : best,
      );
      setOffset(visible.getBoundingClientRect().width + GAP);
    };

    measure();

    const ro = new ResizeObserver(measure);
    // The swap is a class change driving an opacity transition, so watch the
    // attribute for the intent and the transition end for the settled width.
    const mo = new MutationObserver(measure);

    peers.forEach((el) => {
      ro.observe(el);
      mo.observe(el, { attributes: true, attributeFilter: ["class"] });
      el.addEventListener("transitionend", measure);
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
      peers.forEach((el) => el.removeEventListener("transitionend", measure));
    };
  }, []);

  return (
    <Link
      href="/work?focus=games"
      className={styles.badge}
      // Held back until measured, so it never paints on top of the sound
      // control for a frame and then jumps sideways.
      data-ready={offset === null ? "false" : "true"}
      style={offset === null ? undefined : { marginLeft: offset }}
      onClick={() => sound.page()}
      aria-label="Play the games"
    >
      <span className={styles.thumb} aria-hidden="true">
        <Image
          src="/work/music-balls.webp"
          alt=""
          width={92}
          height={58}
          className={styles.thumbImg}
        />
      </span>

      <span className={styles.label}>GAMES</span>
    </Link>
  );
}
