import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";
import { WorkExplorer } from "../../components/slot/WorkExplorer";
import { InteractionSounds } from "../../components/InteractionSounds";
import { AboutDrawer } from "../../components/about/AboutDrawer";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Pull the lever. Three reels — type, domain, skill — land on a combination and the machine surfaces the matching work.",
};

export default function SlotPage() {
  return (
    <main className={styles.page}>
      <InteractionSounds />

      {/* WorkExplorer reads `?games=1` via useSearchParams, which bails out of
          prerendering up to the nearest boundary. Suspense keeps the rest of
          the page in the static HTML. */}
      <Suspense>
        <WorkExplorer />
      </Suspense>

      <AboutDrawer />
    </main>
  );
}
