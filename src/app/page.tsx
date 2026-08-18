import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { DotMatrixPlant } from "../components/home/DotMatrixPlant";
import { DotMatrixCloud } from "../components/home/DotMatrixCloud";
import { TimeBasedCelestial } from "../components/home/TimeBasedCelestial";
import { InteractionSounds } from "../components/InteractionSounds";
import { AboutDrawer } from "../components/about/AboutDrawer";

export const metadata: Metadata = {
  title: "Rafi Naqvi — Developer, Builder",
  description: "Rafi builds AI products, software, and occasionally companies.",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <InteractionSounds />
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
        <div className={styles.cloudTopRight}>
          <DotMatrixCloud />
        </div>
        <div className={styles.celestialTopLeft}>
          <TimeBasedCelestial />
        </div>
        <h1 className={styles.bio}>
          <a href="#about" className={styles.titleInline} data-hover-sound="ambient" style={{ textDecoration: 'none' }}>
            <span className={styles.label}>Rafi</span>
            <span className={styles.waveInline} aria-label="smiling">
              😊😊
            </span>
          </a>{" "}
          <span className={styles.soft}>builds</span>{" "}
          <Link className={styles.bioLink} href="/work?filter=ai" data-sfx="ai" data-hover-sound="ambient">
            <span className={styles.label}>AI products</span>
          </Link>
          ,{" "}
          <Link className={styles.bioLink} href="/work?filter=software" data-sfx="software" data-hover-sound="ambient">
            <span className={styles.label}>software</span>
          </Link>
          , <span className={styles.soft}>and occasionally</span>{" "}
          <Link className={styles.bioLink} href="/work?filter=companies" data-sfx="companies" data-hover-sound="ambient">
            <span className={styles.label}>companies</span>
          </Link>
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

      <AboutDrawer />
    </div>
  );
}
