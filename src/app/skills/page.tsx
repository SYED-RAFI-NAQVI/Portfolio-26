import type { Metadata } from "next";
import styles from "./page.module.css";
import { AboutDrawer } from "../../components/about/AboutDrawer";
import { SiteNav } from "../../components/SiteNav";
import { SkillShelf } from "../../components/skills/SkillShelf";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "The stack behind six years of shipping — frontend, backend, AI systems, and the things that hold them together.",
};

export default function SkillsPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      {/* The page is the grid — no lede, no filters. The heading stays in the
          document outline for screen readers and the tab title, just not on
          screen. */}
      <h1 className={styles.srOnly}>Skills</h1>

      <section className={styles.grid}>
        <SkillShelf />
      </section>

      <AboutDrawer />
    </main>
  );
}
