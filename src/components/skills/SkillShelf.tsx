"use client";

import { useCallback, useState } from "react";
import { SkillCard } from "./SkillCard";
import { SkillDetail } from "./SkillDetail";
import { SKILL_ART, skillsByLevel } from "../../data/slot";

export type Pulled = { name: string; from: DOMRect };

/**
 * The wall of skills, and whichever card is currently out of it.
 *
 * The grid stays mounted and the open card's slot is only made invisible, so
 * nothing reflows while a card is out — the empty slot is what makes putting
 * it back land in the same place.
 */
export function SkillShelf() {
  /**
   * Two pieces of state, not one. `pulled` is which card is off the shelf and
   * survives the whole round trip; `open` is whether it is on its way out or
   * on its way home. Closing flips `open` and the card is only cleared once it
   * has actually landed, which is what keeps its slot empty until then.
   */
  const [pulled, setPulled] = useState<Pulled | null>(null);
  const [open, setOpen] = useState(false);

  const pull = useCallback((name: string, from: DOMRect) => {
    setPulled({ name, from });
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const landed = useCallback(() => setPulled(null), []);

  return (
    <>
      {skillsByLevel().map((skill) => (
        <SkillCard
          key={skill}
          name={skill}
          art={SKILL_ART[skill]}
          onOpen={pull}
          pulled={pulled?.name === skill}
        />
      ))}

      <SkillDetail
        pulled={pulled}
        open={open}
        onClose={close}
        onLanded={landed}
      />
    </>
  );
}
