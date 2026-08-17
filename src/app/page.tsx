import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { DotMatrixPlant } from "../components/home/DotMatrixPlant";
import { DotMatrixCloud } from "../components/home/DotMatrixCloud";
import { TimeBasedCelestial } from "../components/home/TimeBasedCelestial";
import { InteractionSounds } from "../components/InteractionSounds";

export const metadata: Metadata = {
  title: "Rafi — AI Product Builder",
  description: "Portfolio of Rafi, building Applied AI, Software, and Products.",
};

export default function Home() {
  return (
    <main className={styles.page}>
      <InteractionSounds />
      <header className={styles.header}>
        <div className={styles.avatarWrap}>
          <Image 
            src="/rafi_hi.png" 
            alt="Rafi" 
            width={56} 
            height={56} 
            className={styles.avatar} 
          />
        </div>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/" className={styles.active}>
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
          <Link href="/skills">
            <span className={styles.navIcon} style={{ maskImage: "url('/nav-skills.svg')", WebkitMaskImage: "url('/nav-skills.svg')" }} />
            Skills
          </Link>
        </nav>

        <Link className={styles.about} href="#">
          <span className={styles.navIcon} style={{ maskImage: "url('/nav-about.svg')", WebkitMaskImage: "url('/nav-about.svg')" }} />
          About
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.cloudTopRight}>
          <DotMatrixCloud />
        </div>
        <div className={styles.celestialTopLeft}>
          <TimeBasedCelestial />
        </div>
        <h1 className={styles.bio}>
          <span className={styles.titleInline} data-hover-sound="ambient">
            <span>Rafi</span>
            <span className={styles.waveInline} aria-label="smiling">
              😊😊
            </span>
          </span>{" "}
          <span className={styles.soft}>builds</span>{" "}
          <a className={styles.bioLink} href="#" data-sfx="ai" data-hover-sound="ambient">
            <span className={styles.label}>AI products</span>
          </a>
          ,{" "}
          <a className={styles.bioLink} href="#" data-sfx="software" data-hover-sound="ambient">
            <span className={styles.label}>software</span>
          </a>
          , <span className={styles.soft}>and occasionally</span>{" "}
          <a className={styles.bioLink} href="#" data-sfx="companies" data-hover-sound="ambient">
            <span className={styles.label}>companies</span>
          </a>
          . <span className={styles.soft}>6+ years making ideas real.</span>
          <span className={styles.journeyBreak}>
            <Link
              className={`${styles.bioLink} ${styles.journey}`}
              href="/journey"
              data-sfx="journey"
              data-hover-sound="ambient"
            >
              <span className={styles.label}>&gt;&thinsp;Explore the journey.</span>
            </Link>
          </span>
        </h1>
      </section>

      <DotMatrixPlant className={styles.plantContainer} />


    </main>
  );
}
