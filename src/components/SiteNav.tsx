import Link from "next/link";
import Image from "next/image";
import styles from "./SiteNav.module.css";

/**
 * Primary site header — logo, nav, resume.
 *
 * Was duplicated verbatim across the home and skills pages, differing only in
 * which link carried `.active`. Kept a server component: the active page is
 * known at render time, so it is passed in rather than read from the router.
 */
export function SiteNav({ active }: { active?: "home" | "work" }) {
  return (
    <header className={styles.header}>
      <div className={styles.avatarWrap}>
        <a href="#about">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={36}
            height={36}
            className={styles.avatar}
          />
        </a>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        <Link
          href="/"
          className={active === "home" ? styles.active : undefined}
          aria-current={active === "home" ? "page" : undefined}
        >
          <span className={styles.navIcon} style={{ maskImage: "url('/nav-home.svg')", WebkitMaskImage: "url('/nav-home.svg')" }} />
          Home
        </Link>
        <Link
          href="/work"
          className={active === "work" ? styles.active : undefined}
          aria-current={active === "work" ? "page" : undefined}
        >
          <span className={styles.navIcon} style={{ maskImage: "url('/nav-work.svg')", WebkitMaskImage: "url('/nav-work.svg')" }} />
          Work
        </Link>
        {/* The About drawer opens off the hash, and every page that renders
            this also renders the drawer, so a bare fragment resolves locally
            rather than only on home. */}
        <a href="#about">
          <span className={styles.navIcon} style={{ maskImage: "url('/nav-about.svg')", WebkitMaskImage: "url('/nav-about.svg')" }} />
          About
        </a>
      </nav>

      <Link
        className={styles.resume}
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.navIcon} style={{ maskImage: "url('/nav-resume.svg')", WebkitMaskImage: "url('/nav-resume.svg')" }} />
        Resume
      </Link>
    </header>
  );
}
