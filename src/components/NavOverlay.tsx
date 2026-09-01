"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "./NavOverlay.module.css";

/**
 * The phone navigation — a MENU trigger and the full-screen sheet it opens.
 *
 * `SiteNav` stays a server component; only this piece is client, because only
 * this piece has state. Both the bar and this overlay render on every page and
 * a media query decides which one is visible, so there is no layout shift and
 * no hydration mismatch to manage.
 *
 * The destinations are set in the hero's own type rather than a list of rows:
 * the menu should read as the same page continuing, not a control panel
 * arriving on top of it.
 */

type Item = {
  href: string;
  label: string;
  /** Matches the `active` prop; absent for destinations that aren't pages. */
  page?: "home" | "work";
  /** `#about` resolves locally and /resume.pdf leaves — neither wants <Link>. */
  plain?: boolean;
  external?: boolean;
};

const ITEMS: Item[] = [
  { href: "/", label: "Home", page: "home" },
  { href: "/work", label: "Work", page: "work" },
  { href: "#about", label: "About", plain: true },
  { href: "/resume.pdf", label: "Resume", plain: true, external: true },
];

export function NavOverlay({ active }: { active?: "home" | "work" }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Declared above the effect that depends on it. The same callback-below-use
  // pattern is what lint caught in AboutDrawer, and it throws on first click.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    // The sheet owns the screen while it is up; without this the page scrolls
    // underneath it on iOS and the hero is somewhere else on close.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Send the keyboard where the eye already went.
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <span className={styles.burger} aria-hidden="true">
          <span />
          <span />
        </span>
        Menu
      </button>

      <div
        id={panelId}
        ref={sheetRef}
        className={styles.sheet}
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.sheetTop}>
          <span className={styles.eyebrow}>Menu</span>
          <button type="button" className={styles.close} onClick={close}>
            Close
          </button>
        </div>

        <nav className={styles.sheetNav} aria-label="Primary">
          {ITEMS.map((item, i) => {
            const here = item.page !== undefined && item.page === active;
            const className = here ? `${styles.item} ${styles.here}` : styles.item;
            const inner = (
              <>
                <span className={styles.idx}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.word}>{item.label}</span>
                <span className={styles.rule} aria-hidden="true" />
              </>
            );

            return item.plain ? (
              <a
                key={item.href}
                href={item.href}
                className={className}
                onClick={close}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                aria-current={here ? "page" : undefined}
                onClick={close}
              >
                {inner}
              </Link>
            );
          })}
        </nav>

        <span className={styles.foot}>Syed Rafi Naqvi</span>
      </div>
    </>
  );
}
