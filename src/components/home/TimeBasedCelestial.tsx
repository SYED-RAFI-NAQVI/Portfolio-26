"use client";

import React, { useEffect, useState } from "react";
import { DotMatrixSun } from "./DotMatrixSun";
import { DotMatrixMoon } from "./DotMatrixMoon";

export type TimeBasedCelestialProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function TimeBasedCelestial({ className, width = 160, height = 160 }: TimeBasedCelestialProps) {
  const [isDay, setIsDay] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    // 6 AM to 6 PM is considered Day
    setIsDay(hour >= 6 && hour < 18);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ width, height }} aria-hidden="true" />;
  }

  return isDay ? (
    <DotMatrixSun className={className} width={width} height={height} />
  ) : (
    <DotMatrixMoon className={className} width={width} height={height} />
  );
}
