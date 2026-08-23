"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./WorkGallery.module.css";
import { GamePlayer, PlayButton, type PlayableGame } from "../game/GamePlayer";
import { ART, type ArtSlot } from "./art/registry";
import Link from "next/link";
import {
  matchesFocus,
  rankProjects,
  type Focus,
  type Match,
  type ProjectLinkKind,
  type SpinResult,
} from "../../data/slot";

/**
 * The work collection.
 *
 * Every project stays mounted at all times; a spin re-orders and de-emphasises
 * rather than filtering, so the gallery never flashes empty. Reordering is
 * animated with FLIP — measure, reorder, invert, play — so cards visibly
 * travel to their new rank instead of snapping.
 */

function useFlip(order: string[]) {
  const nodes = useRef(new Map<string, HTMLElement>());
  const prev = useRef(new Map<string, DOMRect>());

  const register = (id: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el);
    else nodes.current.delete(id);
  };

  useLayoutEffect(() => {
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    nodes.current.forEach((el, id) => {
      const before = prev.current.get(id);
      const after = el.getBoundingClientRect();

      if (before && animate) {
        const dx = before.left - after.left;
        const dy = before.top - after.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 560, easing: "cubic-bezier(0.2, 0.85, 0.25, 1)" },
          );
        }
      }
      // This render's geometry is the next change's "before".
      prev.current.set(id, after);
    });
  }, [order]);

  return register;
}

/**
 * Coded card artwork, keyed by project id.
 *
 * These are flat vector layouts — brand colour, type, a logo — so drawing them
 * in SVG beats generating a PNG: exact brand values, the real logo file, crisp
 * at any card width, and editable in place.
 */

/**
 * Compose the row layout for one render.
 *
 * A row is only ever [5] or [3,2] or [2,3] — never two equal halves, never
 * more than two cards. The sequence is picked from a seed derived from the
 * landed combination, so every spin lays the grid out differently and no
 * project is locked to one width. Same combination always yields the same
 * layout, so a re-render doesn't reshuffle underneath the FLIP animation.
 */
function buildSpans(count: number, seed: number): number[] {
  let state = (seed || 1) >>> 0;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const spans: number[] = [];
  let sinceFull = 0;

  while (spans.length < count) {
    const remaining = count - spans.length;

    if (remaining === 1) {
      spans.push(5);
      break;
    }

    const roll = rand();
    // Force a full-width row if we have gone too long without one, so the
    // rhythm never flattens into an unbroken run of pairs.
    if (sinceFull >= 3 || roll < 0.2) {
      spans.push(5);
      sinceFull = 0;
    } else {
      spans.push(...(roll < 0.6 ? [3, 2] : [2, 3]));
      sinceFull += 1;
    }
  }

  return spans.slice(0, count);
}

/** Cheap string hash, so a combination maps to a stable layout seed. */
function seedFrom(parts: string[]): number {
  return parts.join("|").split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
}

const LINK_LABEL: Record<ProjectLinkKind, string> = {
  "case-study": "Case study",
  live: "Live",
  play: "Play",
};

function Card({
  match,
  active,
  span,
  register,
  onPlay,
  easy = false,
}: {
  match: Match;
  active: boolean;
  span: number;
  register: (el: HTMLElement | null) => void;
  onPlay: (game: PlayableGame) => void;
  easy?: boolean;
}) {
  const { project, score } = match;


  const art = ART[project.id];
  const Art = art?.Component;
  /* Easy mode is one repeated shape by design — artwork on top, details
     beneath — so the per-project placement that keeps the spun grid from
     looking like a template is deliberately overridden here. */
  const slot: ArtSlot = easy ? "top" : art?.slot ?? "top";
  const bare = art?.bare === true;
  const hasArt = Boolean(Art || project.cover);


  const coverNode = hasArt ? (
    <div
      className={`${styles.cover} ${
        slot === "top" ? styles.coverBanner : styles.coverInset
      }`}
      aria-hidden={Art ? undefined : "true"}
      style={art?.ground ? { background: art.ground } : undefined}
    >
      {Art ? (
        <Art />
      ) : (
        <Image
          src={project.cover!}
          alt=""
          fill
          sizes="(max-width: 1180px) 90vw, 420px"
          className={styles.coverImg}
        />
      )}
    </div>
  ) : null;

  return (
    <article
      ref={register}
      className={styles.card}
      data-score={score}
      data-dim={active && score === 0 ? "true" : "false"}
      data-feature={score === 3 ? "true" : "false"}
      data-cover={Art || project.cover ? "true" : "false"}
      data-light-art={art?.light ? "true" : "false"}
      data-playable={project.play ? "true" : "false"}
      data-art-slot={hasArt ? slot : undefined}
      style={{ gridColumn: `span ${span}` }}
    >
      {/* The card itself is the way in. Every project has a page, so this is
          unconditional — the action buttons below are separate destinations
          and sit above this on z-index. */}
      <Link
        href={`/work/${project.id}`}
        className={styles.cardLink}
        aria-label={project.name}
      />

      {slot === "top" && coverNode}

      <div className={styles.body}>
      <div className={styles.cardHead}>
        {!bare &&
          (project.logo ? (
            <Image
              src={project.logo}
              alt=""
              width={30}
              height={30}
              className={styles.logo}
            />
          ) : (
            <span className={styles.logoFallback} aria-hidden="true">
              {project.name.slice(0, 2).toUpperCase()}
            </span>
          ))}

        <div className={styles.cardIdent}>
          <h2 className={bare ? styles.srOnly : styles.name}>{project.name}</h2>
          <p className={styles.role}>{project.role}</p>
        </div>

        <span className={styles.year}>{project.period}</span>

      </div>

      <p className={styles.blurb}>{project.blurb}</p>

      {slot === "middle" && coverNode}


      {slot === "bottom" && coverNode}

      {(project.links?.length || project.href || project.play) && (
        <footer className={styles.cardFoot}>
          {/* Playable builds lead the row — it is the only action on a card
              that keeps you here rather than sending you somewhere. */}
          {project.play && (
            <PlayButton
              onPlay={() =>
                onPlay({ url: project.play as string, title: project.name })
              }
            />
          )}

          {project.links?.map((l, n) => (
            <Link
              key={l.kind}
              className={styles.action}
              href={l.href}
              data-primary={n === 0 ? "true" : "false"}
            >
              {LINK_LABEL[l.kind]}
              <span aria-hidden="true">→</span>
            </Link>
          ))}

          {/* The project's own site. Deliberately never data-primary: the
              stretched link covers the entire card, and a whole card that
              silently navigates off-site is not what the rest of the
              gallery promises. The arrow differs from the internal one so
              the destination is legible before the click. */}
          {project.href && (
            <a
              className={`${styles.action} ${styles.actionOut}`}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              data-primary="false"
            >
              Website
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </footer>
      )}
      </div>
    </article>
  );
}

export function WorkGallery({
  result,
  spinning,
  focus = null,
  easy = false,
}: {
  result: SpinResult | null;
  spinning: boolean;
  /** Plain two-up grid with no machine driving it: every card the same width,
   *  artwork on top, details beneath. The composed row grammar and the
   *  de-emphasis both assume a spin, so neither applies here. */
  easy?: boolean;
  /** Float one slice of the archive to the top. Everything else stays mounted
   *  below in its usual order — the gallery re-ranks rather than filters, so
   *  arriving from a home-page link must not look like the archive lost
   *  thirty projects. */
  focus?: Focus | null;
}) {
  const combo = result?.combo ?? null;
  const ranked = useMemo(() => {
    const all = rankProjects(combo);
    if (!focus) return all;
    // Sort is stable, so a spin's ranking still decides the order inside each
    // group — the focused slice leads, the rest follows exactly as it would.
    return [...all].sort(
      (a, b) =>
        Number(matchesFocus(b.project, focus)) -
        Number(matchesFocus(a.project, focus)),
    );
  }, [combo, focus]);
  const order = useMemo(() => ranked.map((m) => m.project.id), [ranked]);

  // Re-composed on every spin, so widths move with the ranking.
  const spans = useMemo(
    () =>
      buildSpans(
        ranked.length,
        combo ? seedFrom([combo.type, combo.domain, combo.skill]) : 7,
      ),
    [ranked.length, combo],
  );

  const register = useFlip(order);

  const [game, setGame] = useState<PlayableGame | null>(null);
  // Stable, so a card's PlayButton is not a new callback on every re-rank.
  const closeGame = useCallback(() => setGame(null), []);

  return (
    <section className={styles.collection} aria-label="Work">
      <div
        className={`${styles.grid} ${easy ? styles.gridEasy : ""}`}
        data-spinning={spinning ? "true" : "false"}
      >
        {ranked.map((m, i) => (
          <Card
            key={m.project.id}
            match={m}
            active={!!result}
            /* Easy mode is a uniform two-up, so the composed spans are
               ignored rather than recomputed. */
            span={easy ? 1 : spans[i] ?? 3}
            register={register(m.project.id)}
            onPlay={setGame}
            easy={easy}
          />
        ))}
      </div>

      <GamePlayer game={game} onClose={closeGame} />
    </section>
  );
}
