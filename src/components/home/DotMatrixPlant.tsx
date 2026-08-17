import React, { useMemo } from "react";
import styles from "./DotMatrixPlant.module.css";

const COLS = 31;
const ROWS = 39;

export type DotMatrixPlantProps = {
  className?: string;
  interactive?: boolean;
  onHover?: () => void;
};

export function DotMatrixPlant({
  className,
  interactive = true,
  onHover,
}: DotMatrixPlantProps) {
  // We use useMemo to only compute the grid once.
  const grid = useMemo(() => {
    const flower = new Set<string>();
    const active = new Set<string>();
    const soft = new Set<string>();

    const key = (x: number, y: number) => `${x},${y}`;

    // --- flower: 5 petals + center ---
    const petals = [
      [15, 3], [14, 3], [16, 3],
      [12, 5], [11, 5], [12, 4],
      [18, 5], [19, 5], [18, 4],
      [13, 8], [12, 8], [13, 7],
      [17, 8], [18, 8], [17, 7],
      [15, 6],
    ];

    petals.forEach(([x, y]) => {
      active.add(key(x, y));
      flower.add(key(x, y));
    });

    // inner flower detail
    [
      [14, 5], [15, 5], [16, 5],
      [14, 6], [16, 6],
      [15, 7],
    ].forEach(([x, y]) => {
      active.add(key(x, y));
      flower.add(key(x, y));
    });

    // --- stem ---
    [
      [15, 8], [15, 9], [15, 10], [15, 11], [15, 12],
      [15, 13], [15, 14], [15, 15], [15, 16], [15, 17],
      [15, 18], [15, 19], [15, 20], [15, 21], [15, 22],
      [15, 23], [15, 24], [15, 25], [15, 26], [15, 27],
      [15, 28], [15, 29], [15, 30], [15, 31],
    ].forEach(([x, y]) => active.add(key(x, y)));

    // slight stem thickness / irregularity
    [
      [14, 11], [16, 14], [14, 18], [16, 22], [14, 26], [16, 30],
    ].forEach(([x, y]) => soft.add(key(x, y)));

    // --- left leaf ---
    [
      [14, 15], [13, 15], [12, 15], [11, 16], [10, 16], [9, 17],
      [8, 17], [7, 18], [8, 19], [9, 20], [10, 20], [11, 20],
      [12, 19], [13, 18], [14, 17],
    ].forEach(([x, y]) => active.add(key(x, y)));

    [
      [9, 18], [10, 18], [11, 18], [12, 17], [13, 17],
      [10, 19], [11, 19], [12, 18],
    ].forEach(([x, y]) => soft.add(key(x, y)));

    // --- right leaf ---
    [
      [16, 21], [17, 20], [18, 20], [19, 19], [20, 19], [21, 19],
      [22, 20], [23, 20], [24, 21], [23, 22], [22, 23], [21, 23],
      [20, 23], [19, 22], [18, 22], [17, 22],
    ].forEach(([x, y]) => active.add(key(x, y)));

    [
      [18, 21], [19, 21], [20, 21], [21, 21], [22, 21],
      [19, 22], [20, 22], [21, 22],
    ].forEach(([x, y]) => soft.add(key(x, y)));

    // --- soil / pot rim ---
    for (let x = 11; x <= 19; x++) {
      active.add(key(x, 31));
    }
    for (let x = 10; x <= 20; x++) {
      active.add(key(x, 32));
    }

    // --- pot sides ---
    [
      [10, 33], [20, 33],
      [10, 34], [20, 34],
      [11, 35], [19, 35],
      [11, 36], [19, 36],
      [12, 37], [18, 37],
    ].forEach(([x, y]) => active.add(key(x, y)));

    for (let x = 12; x <= 18; x++) {
      active.add(key(x, 38));
    }

    // subtle pot fill
    for (let y = 33; y <= 37; y++) {
      for (let x = 12; x <= 18; x++) {
        if ((x + y) % 2 === 0) soft.add(key(x, y));
      }
    }

    // generate grid elements
    const dots = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const k = key(x, y);
        let classNames = styles.dot;

        if (active.has(k)) {
          classNames += ` ${styles.dotOn}`;
        } else if (soft.has(k)) {
          classNames += ` ${styles.dotSoft}`;
        }

        if (flower.has(k)) {
          classNames += ` ${styles.flower}`;
        }

        dots.push(<span key={k} className={classNames} />);
      }
    }

    return dots;
  }, []);

  return (
    <div
      className={`${styles.plantWrap} ${
        interactive ? styles.interactive : ""
      }${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      onMouseEnter={onHover}
      data-sfx={interactive ? "plant" : undefined}
    >
      <div className={styles.plant}>{grid}</div>
    </div>
  );
}
