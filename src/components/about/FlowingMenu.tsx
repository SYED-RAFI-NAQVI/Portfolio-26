"use client";

import { useRef } from "react";
import styles from "./FlowingMenu.module.css";
import { sound } from "../../sounds";

export type FlowingMenuItem = {
  label: string;
  href: string;
  /** Optional detail shown after the label, e.g. an address or host. */
  text?: string;
};

/** Tiles repeated inside one marquee group. Four fills a 2x-width track at drawer size. */
const REPEATS = 4;

type Edge = "top" | "bottom";

/** Which horizontal edge of the row the pointer crossed. */
function edgeFrom(clientY: number, rect: DOMRect): Edge {
  return clientY < rect.top + rect.height / 2 ? "top" : "bottom";
}

/** Offset a panel entering from, or leaving toward, the given edge. */
function offsetFor(edge: Edge, invert = false): string {
  const away = edge === "top" ? -101 : 101;
  return `translateY(${invert ? -away : away}%)`;
}

export function FlowingMenu({ items }: { items: FlowingMenuItem[] }) {
  return (
    <nav className={styles.menu}>
      {items.map((item) => (
        <Row key={item.href} item={item} />
      ))}
    </nav>
  );
}

function Row({ item }: { item: FlowingMenuItem }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const slide = (edge: Edge, direction: "in" | "out") => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    if (direction === "in") {
      // Park at the entry edge with no transition, force a reflow so the
      // browser cannot collapse both writes into one frame, then animate home.
      panel.style.transition = "none";
      inner.style.transition = "none";
      panel.style.transform = offsetFor(edge);
      inner.style.transform = offsetFor(edge, true);
      void panel.offsetHeight;
      panel.style.transition = "";
      inner.style.transition = "";
      panel.style.transform = "translateY(0)";
      inner.style.transform = "translateY(0)";
    } else {
      panel.style.transform = offsetFor(edge);
      inner.style.transform = offsetFor(edge, true);
    }
  };

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    sound.hover();
    slide(edgeFrom(e.clientY, rowRef.current.getBoundingClientRect()), "in");
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    slide(edgeFrom(e.clientY, rowRef.current.getBoundingClientRect()), "out");
  };

  const tile = (
    <span className={styles.tile}>
      <span className={styles.tileLabel}>{item.label}</span>
      <span className={styles.tileMark}>↗</span>
    </span>
  );

  return (
    <div
      className={styles.row}
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a
        className={styles.link}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.label}>{item.label}</span>
        {item.text && <span className={styles.meta}>{item.text}</span>}
        <span className={styles.arrow}>↗</span>
      </a>

      <div className={styles.panel} ref={panelRef} aria-hidden="true">
        <div className={styles.panelInner} ref={innerRef}>
          <div className={styles.track}>
            {[0, 1].map((group) => (
              <div className={styles.group} key={group}>
                {Array.from({ length: REPEATS }, (_, i) => (
                  <span key={i} className={styles.tileWrap}>
                    {tile}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
