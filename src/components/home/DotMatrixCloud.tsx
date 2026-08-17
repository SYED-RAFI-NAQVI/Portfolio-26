import React, { useMemo } from "react";
import styles from "./DotMatrixCloud.module.css";

const COLS = 25;
const ROWS = 11;

export type DotMatrixCloudProps = {
  className?: string;
};

export function DotMatrixCloud({ className }: DotMatrixCloudProps) {
  const grid = useMemo(() => {
    const primary = new Set<string>();
    const soft = new Set<string>();

    const key = (x: number, y: number) => `${x},${y}`;

    /* CLOUD SILHOUETTE */
    [
      // upper bumps
      [7, 2], [8, 2], [9, 2],
      [13, 1], [14, 1], [15, 1], [16, 1],
      [18, 2], [19, 2],

      // second row
      [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3],
      [12, 2], [13, 2], [14, 2], [15, 2], [16, 2], [17, 2],
      [18, 3], [19, 3], [20, 3],

      // body top
      [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5],
      [11, 4], [12, 4], [13, 4], [14, 4], [15, 4], [16, 4], [17, 4],
      [18, 5], [19, 5], [20, 5], [21, 5],

      // body middle
      [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
      [11, 6], [12, 6], [13, 6], [14, 6], [15, 6], [16, 6], [17, 6], [18, 6],
      [19, 6], [20, 6], [21, 6], [22, 6],

      // base
      [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7],
      [12, 7], [13, 7], [14, 7], [15, 7], [16, 7], [17, 7], [18, 7],
      [19, 7], [20, 7],

      [7, 8], [8, 8], [9, 8], [10, 8], [11, 8], [12, 8],
      [13, 8], [14, 8], [15, 8], [16, 8], [17, 8], [18, 8],
    ].forEach(([x, y]) => primary.add(key(x, y)));

    /* internal softer dots */
    [
      [8, 3], [14, 2], [15, 2],
      [6, 5], [9, 5], [13, 4], [16, 4], [19, 5],
      [4, 6], [7, 6], [10, 6], [12, 6], [15, 6], [18, 6], [21, 6],
      [6, 7], [9, 7], [12, 7], [15, 7], [18, 7],
      [9, 8], [13, 8], [17, 8],
    ].forEach(([x, y]) => soft.add(key(x, y)));

    const dots = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const id = key(x, y);
        let classNames = styles.dot;

        if (primary.has(id)) {
          classNames += ` ${styles.dotOn}`;
        }
        if (soft.has(id)) {
          if (primary.has(id)) {
            classNames = styles.dot;
          }
          classNames += ` ${styles.dotSoft}`;
        }

        dots.push(<span key={id} className={classNames} />);
      }
    }

    return dots;
  }, []);

  return (
    <div className={`${styles.cloud} ${className || ""}`} aria-hidden="true">
      <div className={styles.cloudGrid}>{grid}</div>
    </div>
  );
}
