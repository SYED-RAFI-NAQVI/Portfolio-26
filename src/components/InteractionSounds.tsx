"use client";

import { useEffect, useState } from "react";
import { sound } from "../sounds";
import styles from "./InteractionSounds.module.css";

export function InteractionSounds() {
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    async function unlock() {
      const success = await sound.unlock();
      if (!success) return;

      setUnlocked(true);

      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    }

    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);

    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, []);

  useEffect(() => {
    let lastPlayed = 0;
    
    const handleMouseOver = (e: MouseEvent) => {
      if (!unlocked || muted) return;
      const target = e.target as HTMLElement;
      const el = target.closest("[data-hover-sound]");
      
      if (el && !el.contains(e.relatedTarget as Node)) {
        const sfx = el.getAttribute("data-hover-sound");
        const now = Date.now();
        
        if (now - lastPlayed > 100) {
          if (sfx === "ambient") sound.ambient();
          lastPlayed = now;
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [unlocked, muted]);

  const handleToggle = () => {
    const nextMuted = !muted;
    sound.setEnabled(!nextMuted);
    setMuted(nextMuted);
    if (!nextMuted) sound.toggle();
  };

  return (
    <>
      <div
        className={`${styles.soundPrompt} ${unlocked ? styles.hidden : ""}`}
        aria-hidden="true"
      >
        <span className={styles.desktop}>CLICK ANYWHERE FOR SOUND</span>
        <span className={styles.mobile}>TAP ANYWHERE FOR SOUND</span>
      </div>

      <button
        className={`${styles.soundToggle} ${unlocked ? styles.visible : ""}`}
        onClick={handleToggle}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        <span>SOUND</span>
        <span className={`${styles.icon} ${muted ? styles.iconOff : styles.iconOn}`} />
      </button>
    </>
  );
}
