import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { AboutDrawer } from "../../components/about/AboutDrawer";

export default function SkillsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.avatarWrap}>
          <a href="#about">
            <Image 
              src="/rafi_hi.png" 
              alt="Rafi" 
              width={64} 
              height={64} 
              className={styles.avatar} 
            />
          </a>
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-home.svg')", WebkitMaskImage: "url('/nav-home.svg')" }} />
            Home
          </Link>
          <Link href="/work">
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-work.svg')", WebkitMaskImage: "url('/nav-work.svg')" }} />
            Work
          </Link>
          <Link href="/journey">
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-journey.svg')", WebkitMaskImage: "url('/nav-journey.svg')" }} />
            Journey
          </Link>
          <Link href="/skills" className={styles.active}>
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-skills.svg')", WebkitMaskImage: "url('/nav-skills.svg')" }} />
            Skills
          </Link>
          <a href="#about">
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-about.svg')", WebkitMaskImage: "url('/nav-about.svg')" }} />
            About
          </a>
        </nav>

        <Link className={styles.resume} href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          <span className={styles.navIcon} style={{ maskImage: "url('/nav-resume.svg')", WebkitMaskImage: "url('/nav-resume.svg')" }} />
          Resume
        </Link>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.title}>Capabilities.</h1>
        <p className={styles.subtitle}>
          The technical, AI, and personality traits that power the products I build.
        </p>

        <div className={styles.filterBar}>
          <button className={`${styles.filterBtn} ${styles.active}`}>All</button>
          <button className={styles.filterBtn}>Tech</button>
          <button className={styles.filterBtn}>AI Skills</button>
          <button className={styles.filterBtn}>Personality</button>
        </div>
      </section>

      <section className={styles.grid}>
        {/* We will populate these with actual data later */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Tech</div>
          <div className={styles.cardBody}>
            <h3>Next.js App Router</h3>
            <p>Building high-performance, server-rendered React applications with fluid layouts.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>AI Skills</div>
          <div className={styles.cardBody}>
            <h3>Agentic Workflows</h3>
            <p>Designing multi-agent LLM systems for autonomous task resolution and synthesis.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>Personality</div>
          <div className={styles.cardBody}>
            <h3>Relentless Builder</h3>
            <p>I don't just architect; I ship. Obsessed with the final 10% of polish.</p>
          </div>
        </div>
      </section>

      <AboutDrawer />
    </main>
  );
}
