import React, { useMemo } from "react";
import styles from "./DotMatrixEnvironment.module.css";

const COLS = 25;
const ROWS = 25;

export type DotMatrixMoonProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function DotMatrixMoon({ className, width = 220, height = 220 }: DotMatrixMoonProps) {
  const grid = useMemo(() => {
    const on = new Set<string>();
    const mid = new Set<string>();

    const k = (x: number, y: number) => `${x},${y}`;

    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const outer = Math.hypot(x - 12, y - 12);
        const inner = Math.hypot(x - 16, y - 10.5);
        if (outer <= 8 && inner >= 6.5) {
          if ((x + y) % 3 === 0) mid.add(k(x, y));
          else on.add(k(x, y));
        }
      }
    }

    const dots = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const key = k(x, y);
        let classNames = styles.dot;
        if (on.has(key)) classNames += ` ${styles.dotOn}`;
        else if (mid.has(key)) classNames += ` ${styles.dotMid}`;

        dots.push(<span key={key} className={classNames} />);
      }
    }
    return dots;
  }, []);

  return (
    <div className={`${styles.wrap} ${styles.moonWrap} ${className || ""}`} aria-hidden="true">
      <div 
        className={styles.matrix} 
        style={{
          width, 
          height, 
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`
        }}
      >
        {grid}
      </div>
    </div>
  );
}
