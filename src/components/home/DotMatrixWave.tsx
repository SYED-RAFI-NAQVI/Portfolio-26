import React, { useMemo } from "react";
import styles from "./DotMatrixEnvironment.module.css";

const COLS = 45;
const ROWS = 17;

export type DotMatrixWaveProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
};

export function DotMatrixWave({ className, width = 340, height = 140 }: DotMatrixWaveProps) {
  const grid = useMemo(() => {
    const on = new Set<string>();
    const mid = new Set<string>();
    const dim = new Set<string>();

    const k = (x: number, y: number) => `${x},${y}`;

    for (let x = 0; x < 45; x++) {
      const y = Math.round(8 + Math.sin(x * 0.43) * 1.6);
      on.add(k(x, y));
      if (x % 3 === 0) mid.add(k(x, y + 2));
      if (x % 5 === 0) dim.add(k(x, y + 4));
    }
    for (let x = 0; x < 45; x += 2) {
      dim.add(k(x, 13));
    }

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
    <div className={`${styles.wrap} ${styles.waveWrap} ${className || ""}`} aria-hidden="true">
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
