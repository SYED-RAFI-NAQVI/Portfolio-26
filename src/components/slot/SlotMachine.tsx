"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SlotMachine.module.css";
import { slotSfx } from "../../sounds/slotSounds";
import { sound } from "../../sounds";
import {
  artFor,
  REELS,
  REEL_LABELS,
  comboIndices,
  pickSpinTarget,
  resolveCombo,
  type Combo,
  type SpinResult,
} from "../../data/slot";

/* ─── Machine constants ──────────────────────────────────────────────────── */

const CARD_RATIO = 1.95;    // portrait; taller than the artwork's native 3:2 so cards read big
const BASE_ITEM_H = 240;    // starting cell height, before the reel is measured
const MIN_ITEM_H = 150;
const MAX_ITEM_H = 480;
const VISIBLE_ROWS = 1;     // faces shown per reel
const CENTER_OFFSET = Math.floor(VISIBLE_ROWS / 2);
const STRIP_REPEATS = 3;    // copies rendered so the wrap is never visible
const SPIN_VELOCITY = 2650; // px/s at full speed
const TICK_GATE = 1450;     // only clack below this velocity — the mechanical tell
const MIN_TICK_GAP = 26;    // ms

type ReelPhase = "idle" | "spin" | "settle" | "bounce" | "locked";

type Reel = {
  n: number;
  loop: number;
  pos: number;
  vel: number;
  phase: ReelPhase;
  spinUntil: number;
  from: number;
  to: number;
  settleStart: number;
  settleDur: number;
  bounceStart: number;
  targetIndex: number;
  lastCell: number;
  lastTick: number;
  wobble: number;
};

const easeOutQuint = (p: number) => 1 - Math.pow(1 - p, 5);

/** Smallest position >= floor that centres `targetIndex` on the payline. */
function landingPosition(floorPos: number, targetIndex: number, n: number, itemH: number) {
  // centre row = item at (floor(pos / itemH) + CENTER_OFFSET) mod n
  const wantCell = (targetIndex - CENTER_OFFSET + n) % n;
  const minCell = Math.ceil(floorPos / itemH);
  const delta = (wantCell - (minCell % n) + n) % n;
  return (minCell + delta) * itemH;
}

export function SlotMachine({
  onResolve,
  onSpinStart,
}: {
  onResolve: (result: SpinResult) => void;
  onSpinStart: () => void;
}) {
  // The rAF loop closes over the first render's callbacks, so route props
  // through a ref to guarantee the gallery always gets the live handlers.
  const cb = useRef({ onResolve, onSpinStart });
  useEffect(() => {
    cb.current = { onResolve, onSpinStart };
  });

  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const windowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leverRef = useRef<HTMLButtonElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const bezelRef = useRef<HTMLDivElement | null>(null);
  const reels = useRef<Reel[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastCombo = useRef<Combo | undefined>(undefined);
  const unlocked = useRef(false);

  // Cells are square, so the height tracks the measured column width. The ref
  // feeds the animation loop; the state feeds layout and the CSS variable.
  const itemHRef = useRef(BASE_ITEM_H);
  const [itemH, setItemH] = useState(BASE_ITEM_H);

  const [phase, setPhase] = useState<"idle" | "spinning" | "resolved">("idle");
  const [landed, setLanded] = useState<(number | null)[]>([null, null, null]);

  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const paint = (i: number, r: Reel) => {
    const strip = stripRefs.current[i];
    const win = windowRefs.current[i];
    if (!strip) return;
    const y = -(((r.pos % r.loop) + r.loop) % r.loop);
    const blur = Math.min(2.8, Math.abs(r.vel) / 1350);
    strip.style.transform = `translate3d(0, ${y}px, 0)`;
    strip.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
    if (win) win.style.setProperty("--speed", String(Math.min(1, Math.abs(r.vel) / SPIN_VELOCITY)));
  };

  const finish = () => {
    const combo = lastCombo.current;
    if (!combo) return;
    const res = resolveCombo(combo);
    setPhase("resolved");
    cb.current.onResolve(res);

    window.setTimeout(() => {
      if (res.tier === 3) slotSfx.jackpot();
      else if (res.tier === 2) slotSfx.partial();
      else slotSfx.weak();
      res.matches.slice(0, 6).forEach((_, i) =>
        window.setTimeout(() => slotSfx.cardIn(i), 120 + i * 70),
      );
    }, 180);
  };

  const lockReel = (i: number, r: Reel) => {
    slotSfx.reelLock(i);
    setLanded((prev) => {
      const next = [...prev];
      next[i] = r.targetIndex;
      return next;
    });
    if (i === REELS.length - 1) finish();
  };

  /* ─── The loop ─────────────────────────────────────────────────────────── */
  const tickLoop = useCallback(() => {
    let prev = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      let allLocked = true;

      reels.current.forEach((r, i) => {
        if (r.phase === "locked" || r.phase === "idle") return;
        allLocked = false;
        const before = r.pos;

        if (r.phase === "spin") {
          r.wobble += dt * 9;
          r.vel = SPIN_VELOCITY * (1 + Math.sin(r.wobble) * 0.014);
          r.pos += r.vel * dt;
          if (now >= r.spinUntil) {
            r.from = r.pos;
            r.to = landingPosition(r.pos + r.loop * 2.2, r.targetIndex, r.n, itemHRef.current);
            r.settleStart = now;
            r.phase = "settle";
          }
        } else if (r.phase === "settle") {
          const p = Math.min(1, (now - r.settleStart) / r.settleDur);
          r.pos = r.from + (r.to - r.from) * easeOutQuint(p);
          r.vel = (r.pos - before) / dt;
          if (p >= 1) {
            r.pos = r.to;
            r.bounceStart = now;
            r.phase = reduced.current ? "locked" : "bounce";
            if (r.phase === "locked") lockReel(i, r);
          }
        } else if (r.phase === "bounce") {
          // Damped overshoot — the drum settling into its detent.
          const p = Math.min(1, (now - r.bounceStart) / 260);
          r.pos = r.to + Math.sin(p * Math.PI * 2.4) * 7 * (1 - p);
          r.vel = (r.pos - before) / dt;
          if (p >= 1) {
            r.pos = r.to;
            r.vel = 0;
            r.phase = "locked";
            lockReel(i, r);
          }
        }

        // Symbol crossings — gated by velocity so full speed is a whirr,
        // and the deceleration turns into individual clacks.
        const cell = Math.floor(r.pos / itemHRef.current);
        if (cell !== r.lastCell) {
          r.lastCell = cell;
          const v = Math.abs(r.vel);
          if (v < TICK_GATE && now - r.lastTick > MIN_TICK_GAP && r.phase !== "locked") {
            r.lastTick = now;
            slotSfx.reelTick(v / TICK_GATE);
          }
        }

        paint(i, r);
      });

      if (allLocked) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Init reels at rest ───────────────────────────────────────────────── */
  useEffect(() => {
    reels.current = REELS.map((items) => {
      const n = items.length;
      const start = Math.floor(Math.random() * n) * itemHRef.current;
      return {
        n,
        loop: n * itemHRef.current,
        pos: start,
        vel: 0,
        phase: "idle",
        spinUntil: 0,
        from: 0,
        to: 0,
        settleStart: 0,
        settleDur: 0,
        bounceStart: 0,
        targetIndex: 0,
        lastCell: Math.floor(start / itemHRef.current),
        lastTick: 0,
        wobble: Math.random() * Math.PI * 2,
      };
    });
    reels.current.forEach((r, i) => paint(i, r));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ─── Keep cells portrait ────────────────────────────────────────────────
     Columns are fluid, so the cell height is derived from the rendered
     window width at the artwork's portrait ratio. Reel positions are
     expressed in pixels, so they get
     rescaled proportionally whenever the size changes — otherwise a resize
     would leave every drum parked between two faces.
     ──────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const bezel = bezelRef.current;
    if (!bezel) return;

    const measure = () => {
      const w = windowRefs.current[0]?.clientWidth;
      if (!w) return;
      const next = Math.max(MIN_ITEM_H, Math.min(MAX_ITEM_H, Math.round(w * CARD_RATIO)));
      const prev = itemHRef.current;
      if (next === prev) return;

      itemHRef.current = next;
      reels.current.forEach((r, i) => {
        r.pos = (r.pos / prev) * next;
        r.to = (r.to / prev) * next;
        r.from = (r.from / prev) * next;
        r.loop = r.n * next;
        r.lastCell = Math.floor(r.pos / next);
        paint(i, r);
      });
      setItemH(next);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(bezel);
    measure();
    return () => ro.disconnect();
  }, []);

  /* ─── Spin ─────────────────────────────────────────────────────────────── */
  const spin = useCallback(() => {
    if (phase === "spinning") return;
    if (!unlocked.current) {
      sound.unlock();
      unlocked.current = true;
    }

    const combo = pickSpinTarget(lastCombo.current);
    lastCombo.current = combo;
    const targets = comboIndices(combo);

    setPhase("spinning");
    setLanded([null, null, null]);
    cb.current.onSpinStart();

    slotSfx.leverPull();

    const now = performance.now();
    reels.current.forEach((r, i) => {
      r.targetIndex = targets[i];
      r.phase = "spin";
      r.vel = SPIN_VELOCITY;
      r.wobble = Math.random() * Math.PI * 2;
      r.spinUntil = now + (reduced.current ? 180 + i * 90 : 1000 + i * 540);
      r.settleDur = reduced.current ? 220 : 700;
    });

    if (rafRef.current === null) tickLoop();
  }, [phase, tickLoop]);

  /* ─── Lever drag ───────────────────────────────────────────────────────── */
  const drag = useRef({ active: false, startY: 0, pull: 0, moved: 0, lastSfx: 0 });

  const setPull = (v: number) => {
    drag.current.pull = v;
    rigRef.current?.style.setProperty("--pull", v.toFixed(3));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (phase === "spinning") return;
    if (!unlocked.current) {
      sound.unlock();
      unlocked.current = true;
    }
    drag.current.active = true;
    drag.current.startY = e.clientY;
    drag.current.moved = 0;
    try {
      leverRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic or already-released pointer — dragging still works via events */
    }
    rigRef.current?.classList.add(styles.leverGrabbed);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;
    const dy = e.clientY - drag.current.startY;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dy));
    const pull = Math.max(0, Math.min(1, dy / 130));
    setPull(pull);
    const now = performance.now();
    if (now - drag.current.lastSfx > 55 && pull > 0.04) {
      drag.current.lastSfx = now;
      slotSfx.leverTravel(pull);
    }
  };

  const releaseLever = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    try {
      leverRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* capture was never granted */
    }
    rigRef.current?.classList.remove(styles.leverGrabbed);

    const committed = drag.current.pull > 0.55 || drag.current.moved < 6;
    if (committed) {
      setPull(1);
      rigRef.current?.classList.add(styles.leverFired);
      window.setTimeout(() => {
        setPull(0);
        rigRef.current?.classList.remove(styles.leverFired);
        slotSfx.leverReturn();
      }, 210);
      spin();
    } else {
      setPull(0);
      slotSfx.leverReturn();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (phase === "spinning") return;
    setPull(1);
    rigRef.current?.classList.add(styles.leverFired);
    window.setTimeout(() => {
      setPull(0);
      rigRef.current?.classList.remove(styles.leverFired);
      slotSfx.leverReturn();
    }, 210);
    spin();
  };

  const armed = phase !== "spinning";

  return (
    <div className={styles.wrap} style={{ "--item-h": `${itemH}px` } as React.CSSProperties}>
      <div className={`${styles.rig} ${phase === "spinning" ? styles.rigSpinning : ""}`}>
        {/* ─── Cabinet ─────────────────────────────────────────────────── */}
        <div className={styles.cabinet}>
          <div className={styles.screen}>
            <div className={styles.bezel} ref={bezelRef}>
              {REELS.map((items, i) => (
                <div className={styles.column} key={REEL_LABELS[i]}>
                  <div className={styles.columnLabel}>
                    <span>{REEL_LABELS[i]}</span>
                    <span className={styles.columnCount}>{items.length}</span>
                  </div>

                  <div
                    className={styles.window}
                    ref={(el) => { windowRefs.current[i] = el; }}
                    data-locked={landed[i] !== null ? "true" : "false"}
                    role="status"
                    aria-live="polite"
                    aria-label={`${REEL_LABELS[i]} reel`}
                  >
                    <div className={styles.strip} ref={(el) => { stripRefs.current[i] = el; }}>
                      {Array.from({ length: STRIP_REPEATS }).flatMap((_, rep) =>
                        items.map((v, k) => (
                          <div
                            className={`${styles.face} ${
                              landed[i] === k ? styles.faceLanded : ""
                            }`}
                            key={`${rep}-${v}`}
                            style={{ height: itemH }}
                          >
                            {artFor(i, v) ? (
                              <Image
                                src={artFor(i, v)!}
                                alt=""
                                fill
                                priority
                                sizes="200px"
                                className={styles.faceArt}
                              />
                            ) : (
                              <span className={styles.faceGlyph} aria-hidden="true" />
                            )}

                            {/* The artwork no longer carries baked-in text, so
                                the value is set here instead. */}
                            <span className={styles.faceLabel}>{v}</span>
                          </div>
                        )),
                      )}
                    </div>

                    <div className={styles.payline} aria-hidden="true" />
                    {/* <div className={styles.streaks} aria-hidden="true" /> */}
                    {/* <div className={styles.glare} aria-hidden="true" /> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ─── Lever rail — vertical throw ─────────────────────────────── */}
        <div className={styles.leverColumn}>
          <div
            className={styles.leverRig}
            ref={rigRef}
            style={{ "--pull": 0 } as React.CSSProperties}
          >
            <span className={styles.leverMount} aria-hidden="true" />
            <span className={styles.leverSlot} aria-hidden="true">
              <span className={styles.leverShaft} />
            </span>
            <button
              ref={leverRef}
              className={styles.lever}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={releaseLever}
              onPointerCancel={releaseLever}
              onKeyDown={onKeyDown}
              disabled={!armed}
              aria-label="Pull the lever down to spin the reels"
            >
              <span className={styles.leverKnob} aria-hidden="true" />
            </button>
          </div>
          <span className={styles.leverHint}>{armed ? "PULL" : "···"}</span>
        </div>
      </div>

    </div>
  );
}
