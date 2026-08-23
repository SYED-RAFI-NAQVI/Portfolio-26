import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";
import { DotMatrixPlant } from "../components/home/DotMatrixPlant";
import { DotMatrixCloud } from "../components/home/DotMatrixCloud";
import { TimeBasedCelestial } from "../components/home/TimeBasedCelestial";
import { InteractionSounds } from "../components/InteractionSounds";
import { GamesBadge } from "../components/home/GamesBadge";
import { SiteNav } from "../components/SiteNav";
import { AboutDrawer } from "../components/about/AboutDrawer";

export const metadata: Metadata = {
  title: "Rafi Naqvi — Developer, Builder",
  description: "Rafi builds AI products, software, and occasionally companies.",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <InteractionSounds />
      <GamesBadge />
      <SiteNav active="home" />

      <section className={styles.hero}>
        <div className={styles.cloudTopRight}>
          <DotMatrixCloud />
        </div>
        <div className={styles.celestialTopLeft}>
          <TimeBasedCelestial />
        </div>
        <h1 className={styles.bio}>
          <span className={styles.line}>
            <a href="#about" className={styles.titleInline} data-hover-sound="ambient" style={{ textDecoration: 'none' }}>
              <span className={styles.label}>Rafi</span>
              <span className={styles.waveInline} aria-label="smiling">
                😊
              </span>
            </a>{" "}
            <span className={styles.soft}>builds</span>{" "}
            <Link className={styles.bioLink} href="/work?focus=startups" data-sfx="ai" data-hover-sound="ambient">
              <span className={styles.label}>AI startups</span>
            </Link>
            <span className={styles.logoRow} aria-hidden="true">
              <Image src="/alif-logo.svg" alt="" width={48} height={48} className={`${styles.heroLogo} ${styles.heroLogoDark}`} />
              <Image src="/beonai-logo.svg" alt="" width={48} height={48} className={`${styles.heroLogo} ${styles.heroLogoDark}`} />
              <Image src="/paperpilot-logo.png" alt="" width={48} height={48} className={`${styles.heroLogo} ${styles.heroLogoDark}`} />
              <Image src="/basketo-logo.png" alt="" width={48} height={48} className={`${styles.heroLogo} ${styles.heroLogoDark}`} />
            </span>
            ,
          </span>

          <span className={styles.line}>
            <span className={styles.soft}>ships</span>{" "}
            <Link className={styles.bioLink} href="/work?focus=software" data-sfx="software" data-hover-sound="ambient">
              <span className={styles.label}>software</span>
            </Link>
            <span className={styles.logoRow} aria-hidden="true">
              <Image src="/gutenberg-logo.png" alt="" width={48} height={48} className={`${styles.heroLogo} ${styles.heroLogoDark}`} />
              <Image src="/tecnotree-logo.jpeg" alt="" width={48} height={48} className={styles.heroLogo} />
              <Image src="/prodjar-logo.jpeg" alt="" width={48} height={48} className={styles.heroLogo} />
            </span>{" "}
            <span className={styles.soft}>for enterprises,</span>
          </span>

          <span className={styles.line}>
            <span className={styles.soft}>and wins</span>{" "}
            <Link className={styles.bioLink} href="/work?focus=hackathons" data-sfx="companies" data-hover-sound="ambient">
              <span className={styles.label}>hackathons</span>
            </Link>
            <span className={styles.soft}>, since 6+ years.</span>
          </span>
          <span className={styles.ctaBreak}>
            <Link
              className={`${styles.bioLink} ${styles.cta}`}
              href="/work"
              data-sfx="work"
              data-hover-sound="ambient"
            >
              <span className={styles.label}>&gt;&thinsp;Explore the work.</span>
            </Link>
          </span>
        </h1>
      </section>

      <DotMatrixPlant className={styles.plantContainer} />

      <AboutDrawer />
    </div>
  );
}
