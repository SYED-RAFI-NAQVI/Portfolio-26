import React, { useMemo } from "react";
import styles from "./DotMatrixEnvironment.module.css";

const COLS = 41;
const ROWS = 23;

export type DotMatrixMountainsProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function DotMatrixMountains({ className, width = 330, height = 190 }: DotMatrixMountainsProps) {
  const grid = useMemo(() => {
    const on = new Set<string>();
    const mid = new Set<string>();
    const dim = new Set<string>();

    const k = (x: number, y: number) => `${x},${y}`;

    function line(x1: number, y1: number, x2: number, y2: number) {
      const dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
      const dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
      let err = dx + dy;
      while (true) {
        on.add(k(x1, y1));
        if (x1 === x2 && y1 === y2) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x1 += sx; }
        if (e2 <= dx) { err += dx; y1 += sy; }
      }
    }

    line(1, 20, 10, 8);
    line(10, 8, 18, 20);
    line(13, 20, 24, 4);
    line(24, 4, 38, 20);
    line(27, 20, 33, 11);
    line(33, 11, 40, 20);

    for (let y = 12; y <= 20; y++) {
      for (let x = 4; x <= 36; x++) {
        if ((x + y) % 5 === 0) dim.add(k(x, y));
      }
    }

    [
      [8, 11], [9, 10], [10, 9], [11, 10], [12, 11],
      [21, 8], [22, 7], [23, 6], [24, 5], [25, 6], [26, 7], [27, 8],
      [31, 14], [32, 13], [33, 12], [34, 13], [35, 14]
    ].forEach(([x, y]) => mid.add(k(x, y)));

    for (let x = 0; x < 41; x++) on.add(k(x, 21));

    const dots = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const key = k(x, y);
        let classNames = styles.dot;
        if (on.has(key)) classNames += ` ${styles.dotOn}`;
        else if (mid.has(key)) classNames += ` ${styles.dotMid}`;
        else if (dim.has(key)) classNames += ` ${styles.dotDim}`;

        dots.push(<span key={key} className={classNames} />);
      }
    }
    return dots;
  }, []);

  return (
    <div className={`${styles.wrap} ${styles.mountainsWrap} ${className || ""}`} aria-hidden="true">
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
