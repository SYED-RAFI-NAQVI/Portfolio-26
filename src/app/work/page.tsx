import type { Metadata } from "next";
import styles from "./page.module.css";
import { WorkExplorer } from "../../components/slot/WorkExplorer";
import { InteractionSounds } from "../../components/InteractionSounds";
import { AboutDrawer } from "../../components/about/AboutDrawer";

export const metadata: Metadata = {
  title: "Project Hunter — Rafi Naqvi",
  description:
    "Pull the lever. Three reels — type, domain, skill — land on a combination and the machine surfaces the matching work.",
};

export default function SlotPage() {
  return (
    <main className={styles.page}>
      <InteractionSounds />

      <WorkExplorer />

      <AboutDrawer />
    </main>
  );
}
