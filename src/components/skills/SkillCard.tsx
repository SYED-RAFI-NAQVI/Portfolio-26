"use client";

import Image from "next/image";
import styles from "./SkillCard.module.css";
import { Foil, useFoil } from "./Foil";

/**
 * A holographic skill face in the grid. Tracking and the foil layers live in
 * `useFoil`/`Foil`, shared with the expanded card so the two stay identical.
 */
export function SkillCard({
  name,
  art,
  onOpen,
  pulled = false,
}: {
  name: string;
  art: string;
  onOpen?: (name: string, from: DOMRect) => void;
  /** This card is currently out on the stage — leave its slot empty. */
  pulled?: boolean;
}) {
  const { ref, onPointerMove, onPointerLeave } = useFoil<HTMLElement>();

  return (
    <article
      ref={ref}
      className={styles.card}
      data-pulled={pulled ? "true" : "false"}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={() => {
        const el = ref.current;
        if (el && onOpen) onOpen(name, el.getBoundingClientRect());
      }}
    >
      <Image
        src={art}
        alt=""
        fill
        sizes="(max-width: 480px) 92vw, (max-width: 800px) 46vw, (max-width: 1080px) 31vw, 260px"
        className={styles.art}
      />

      <Foil />

      {/* Label is DOM text over a scrim rather than baked into the artwork —
          the images run from near-black to bright, and a plain caption is
          legible on some and invisible on others. Same treatment the reel
          faces use. It sits above the foil so the light never eats the name. */}
      <h2 className={styles.name}>{name}</h2>
    </article>
  );
}
