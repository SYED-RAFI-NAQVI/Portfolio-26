"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./GamePlayer.module.css";
import { sound } from "../../sounds";

/** The loader creeps toward this but never reaches it on its own. */
const CEILING = 99;
/** Percent per second the bar moves at minimum, so it never looks hung. */
const CREEP = 1.6;
/** Blocks in the meter. Coarse on purpose — it should tick, not glide. */
const SEGMENTS = 24;

export type PlayableGame = {
  /** Deployed game, embedded in an iframe. Must not send X-Frame-Options. */
  url: string;
  title: string;
};

/**
 * Full-bleed player for a game deployed elsewhere.
 *
 * The game is a third-party origin in an iframe, so nothing here can reach
 * into it — no score, no state, no pause. The overlay owns exactly two things:
 * getting out (Escape, the close button, the backdrop) and not letting the
 * page behind it scroll while it is up.
 */
export function GamePlayer({
  game,
  onClose,
}: {
  game: PlayableGame | null;
  onClose: () => void;
}) {
  // Keyed on the URL so each open is a fresh mount: the entry transition and
  // the iframe both reset without any state to unwind on close.
  if (!game) return null;
  return <Stage key={game.url} game={game} onClose={onClose} />;
}

function Stage({
  game,
  onClose,
}: {
  game: PlayableGame;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(false);
  const frameDone = useRef<() => void>(() => {});

  // Mount at rest, then flip on the next frame so the transition has two
  // distinct states to interpolate between.
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /**
   * A cross-origin iframe reports nothing but `load`, so this curve is a
   * fiction — but a disciplined one. It decelerates toward the ceiling while
   * keeping a floor under its own velocity, so it always creeps rather than
   * parking at some round number and looking hung.
   */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      setProgress((p) => {
        if (doneRef.current) return 100;
        const eased = (CEILING - p) * 3.2 * dt;
        return Math.min(p + Math.max(eased, CREEP * dt), CEILING);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // Nothing fires for a frame that never loads, so don't trap the player
    // behind the loader forever.
    const failsafe = window.setTimeout(finish, 15000);

    function finish() {
      doneRef.current = true;
      setProgress(100);
      window.setTimeout(() => setReady(true), 280);
    }

    frameDone.current = finish;

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Once focus is inside the iframe the game owns the keyboard, so this
      // only fires while focus is still on the overlay chrome. The close
      // button is the reliable way out and is focused on open for that reason.
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={styles.shell}
      data-visible={visible ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-label={`${game.title} — playable`}
    >
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <div className={styles.stage}>
        <header className={styles.bar}>
          <div className={styles.ident}>
            <span className={styles.title}>{game.title}</span>
          </div>

          <div className={styles.barActions}>
            <a
              className={styles.openOut}
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
            >
              <span className={styles.openOutLabel}>NEW TAB</span>
              <span aria-hidden="true">↗</span>
            </a>
            <button
              ref={closeRef}
              className={styles.close}
              onClick={onClose}
              aria-label="Close game"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3L13 13M13 3L3 13" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.frameWrap}>
          <iframe
            className={styles.frame}
            src={game.url}
            title={game.title}
            onLoad={() => frameDone.current()}
            allow="autoplay; fullscreen; gamepad; pointer-lock"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
          />

          {!ready && (
            <div className={styles.loader} data-done={progress >= 100 ? "true" : "false"}>
              <Image
                src="/logo1.png"
                alt=""
                width={44}
                height={44}
                className={styles.loaderMark}
                priority
              />

              <div className={styles.loaderText}>
                <span className={styles.loaderGame}>{game.title}</span>
              </div>

              {/* Coarse blocks rather than a smooth fill — the bar should
                  advance in visible steps, the way a cartridge-era loader did. */}
              <div
                className={styles.meter}
                role="progressbar"
                aria-valuenow={Math.floor(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <span
                    key={i}
                    className={styles.segment}
                    data-on={
                      i < Math.round((progress / 100) * SEGMENTS) ? "true" : "false"
                    }
                  />
                ))}
              </div>

              <div className={styles.percent}>
                <span className={styles.percentWord}>LOADING</span>
                <span className={styles.percentNum}>
                  {String(Math.floor(progress)).padStart(2, "0")}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Rounded, gently pulsing entry point. Sits above the card's stretched link. */
export function PlayButton({
  onPlay,
  label = "Play",
}: {
  onPlay: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={styles.playButton}
      onClick={(e) => {
        e.stopPropagation();
        sound.page();
        onPlay();
      }}
    >
      <span className={styles.playGlyph} aria-hidden="true">▶</span>
      {label}
    </button>
  );
}
