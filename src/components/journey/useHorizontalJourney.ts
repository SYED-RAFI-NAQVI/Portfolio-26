"use client";

import { type RefObject, useEffect } from "react";
import { animate, onScroll } from "animejs";

type UseHorizontalJourneyArgs = {
  sectionRef: RefObject<HTMLElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<HTMLDivElement | null>;
};

export function useHorizontalJourney({
  sectionRef,
  trackRef,
  progressRef,
}: UseHorizontalJourneyArgs) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!section || !track || !progress) return;

    let trackAnimation: ReturnType<typeof animate> | null = null;
    let progressAnimation: ReturnType<typeof animate> | null = null;
    let resizeFrame = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const build = () => {
      trackAnimation?.revert();
      progressAnimation?.revert();

      const distance = Math.max(0, track.scrollWidth - window.innerWidth);

      // The vertical scroll range mirrors the horizontal travel distance.
      // Adding one viewport height lets the sticky stage pin from start to finish.
      section.style.height = `${distance + window.innerHeight}px`;
      section.style.setProperty("--journey-distance", `${distance}px`);

      if (distance === 0) return;

      const scrollSync = reducedMotion.matches ? true : 0.12;
      const scrollSettings = {
        target: section,
        axis: "y" as const,
        enter: "top top",
        leave: "bottom bottom",
        sync: scrollSync,
      };

      trackAnimation = animate(track, {
        x: [0, -distance],
        ease: "linear",
        autoplay: onScroll(scrollSettings),
      });

      progressAnimation = animate(progress, {
        scaleX: [0, 1],
        ease: "linear",
        autoplay: onScroll(scrollSettings),
      });
    };

    const scheduleBuild = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    };

    const resizeObserver = new ResizeObserver(scheduleBuild);
    resizeObserver.observe(track);

    window.addEventListener("resize", scheduleBuild, { passive: true });
    reducedMotion.addEventListener("change", scheduleBuild);

    build();

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleBuild);
      reducedMotion.removeEventListener("change", scheduleBuild);
      trackAnimation?.revert();
      progressAnimation?.revert();
      section.style.removeProperty("height");
      section.style.removeProperty("--journey-distance");
    };
  }, [progressRef, sectionRef, trackRef]);
}
