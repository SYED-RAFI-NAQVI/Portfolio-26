import React, { useMemo } from "react";
import styles from "./DotMatrixEnvironment.module.css";

const COLS = 25;
const ROWS = 25;

export type DotMatrixSunProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function DotMatrixSun({ className, width = 220, height = 220 }: DotMatrixSunProps) {
  const grid = useMemo(() => {
    const on = new Set<string>();
    const mid = new Set<string>();

    const k = (x: number, y: number) => `${x},${y}`;
    const cx = 12, cy = 12;

    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (d >= 5.2 && d <= 7.2) on.add(k(x, y));
        else if (d > 3.2 && d < 5.2 && (x + y) % 2 === 0) mid.add(k(x, y));
      }
    }

    [
      [12, 1], [12, 2], [12, 22], [12, 23],
      [1, 12], [2, 12], [22, 12], [23, 12],
      [4, 4], [5, 5], [19, 19], [20, 20],
      [20, 4], [19, 5], [5, 19], [4, 20]
    ].forEach(([x, y]) => on.add(k(x, y)));

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
    <div className={`${styles.wrap} ${styles.sunWrap} ${className || ""}`} aria-hidden="true">
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
