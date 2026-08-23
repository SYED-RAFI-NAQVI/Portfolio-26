"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./SkillDetail.module.css";
import { SKILL_ART, projects } from "../../data/slot";
import type { Pulled } from "./SkillShelf";
import { Foil, useFoil } from "./Foil";

const OUT_MS = 760;
const BACK_MS = 620;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * A skill taken off the shelf.
 *
 * The card is not a new element pretending to be the old one — it animates
 * from the exact rectangle the grid card occupies to its place on the stage,
 * turning a full revolution on the way. Closing runs the same animation in
 * reverse, so it lands back in the slot it left rather than near it.
 */
export function SkillDetail({
  pulled,
  open,
  onClose,
  onLanded,
}: {
  pulled: Pulled | null;
  /** False while the card is flying home; `pulled` stays set until it lands. */
  open: boolean;
  onClose: () => void;
  onLanded: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  /* Tilt rides on the wrapper, not on the card itself — the card's transform
     belongs to the fly-out animation, and a second writer on the same property
     would fight it. Nesting composes the two instead. */
  const {
    ref: foilRef,
    onPointerMove: onFoilMove,
    onPointerLeave: onFoilLeave,
  } = useFoil<HTMLDivElement>();


  // Fly out. Measured after paint, so the stage position is the real one.
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !pulled || !open) return;
    const shown = pulled;

    const to = el.getBoundingClientRect();
    const { from } = shown;
    const scale = from.width / to.width;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);

    animRef.current = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotateY(0deg)` },
        { transform: "translate(0, 0) scale(1) rotateY(360deg)" },
      ],
      { duration: OUT_MS, easing: EASE, fill: "both" },
    );
  }, [pulled, open]);

  // Fly back into the slot the card came from, then clear it.
  useEffect(() => {
    if (open || !pulled) return;

    const anim = animRef.current;
    if (!anim) {
      onLanded();
      return;
    }

    // Reverse the same animation rather than building a second one: the card
    // then retraces the exact path it flew out on and lands in its own slot,
    // not merely near it. Slightly faster going back than coming out.
    anim.updatePlaybackRate(-(OUT_MS / BACK_MS));
    anim.play();
    anim.onfinish = onLanded;
  }, [open, pulled, onLanded]);

  useEffect(() => {
    if (!pulled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pulled, onClose]);

  if (!pulled) return null;

  const using = projects.filter((p) => p.skills.includes(pulled.name as never));

  return (
    <div className={styles.stage} data-open={open ? "true" : "false"}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <aside className={styles.panel} role="dialog" aria-label={pulled.name}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3L13 13M13 3L3 13" />
          </svg>
        </button>

        <p className={styles.eyebrow}>Skill</p>
        <h2 className={styles.title}>{pulled.name}</h2>

        <p className={styles.count}>
          {using.length
            ? `${using.length} project${using.length === 1 ? "" : "s"}`
            : "No projects tagged yet"}
        </p>

        <ul className={styles.list}>
          {using.map((p) => (
            <li key={p.id}>
              <Link className={styles.row} href={`/work/${p.id}`}>
                <span className={styles.rowName}>{p.name}</span>
                <span className={styles.rowYear}>{p.period}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div
        className={styles.cardWrap}
        ref={foilRef}
        onPointerMove={onFoilMove}
        onPointerLeave={onFoilLeave}
      >
        <div className={styles.card} ref={cardRef}>
          <Image
            src={SKILL_ART[pulled.name]}
            alt=""
            fill
            sizes="420px"
            className={styles.cardArt}
            priority
          />
          <Foil />
          <span className={styles.cardScrim} aria-hidden="true" />
          <h3 className={styles.cardName}>{pulled.name}</h3>
        </div>
      </div>
    </div>
  );
}
