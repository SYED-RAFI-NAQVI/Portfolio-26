import React, { useMemo } from "react";
import styles from "./DotMatrixEnvironment.module.css";

const COLS = 33;
const ROWS = 25;

export type DotMatrixStarsProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function DotMatrixStars({ className, width = 280, height = 220 }: DotMatrixStarsProps) {
  const grid = useMemo(() => {
    const on = new Set<string>();
    const mid = new Set<string>();
    const hot = new Set<string>();

    const k = (x: number, y: number) => `${x},${y}`;

    [
      [5, 5], [5, 4], [5, 6], [4, 5], [6, 5],
      [16, 3], [16, 2], [16, 4], [15, 3], [17, 3],
      [26, 7], [26, 6], [26, 8], [25, 7], [27, 7],
      [10, 15], [10, 14], [10, 16], [9, 15], [11, 15],
      [22, 18], [22, 17], [22, 19], [21, 18], [23, 18],
      [29, 13], [29, 12], [29, 14], [28, 13], [30, 13]
    ].forEach(([x, y]) => on.add(k(x, y)));

    [
      [2, 11], [8, 9], [13, 7], [19, 11], [24, 3], [31, 20], [15, 20], [6, 21]
    ].forEach(([x, y]) => mid.add(k(x, y)));

    [
      [16, 3], [26, 7], [22, 18]
    ].forEach(([x, y]) => hot.add(k(x, y)));

    const dots = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const key = k(x, y);
        let classNames = styles.dot;
        
        if (on.has(key)) classNames += ` ${styles.dotOn}`;
        else if (mid.has(key)) classNames += ` ${styles.dotMid}`;

        if (hot.has(key)) classNames += ` ${styles.starHot}`;

        dots.push(<span key={key} className={classNames} />);
      }
    }
    return dots;
  }, []);

  return (
    <div className={`${styles.wrap} ${styles.starsWrap} ${className || ""}`} aria-hidden="true">
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
