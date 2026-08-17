import styles from "./BrandIcon.module.css";

interface BrandIconProps {
  src?: string;
  fallback: string;
  alt?: string;
}

export function BrandIcon({ src, fallback, alt = "Company Icon" }: BrandIconProps) {
  return (
    <div className={styles.container}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} onError={(e) => {
          e.currentTarget.style.display = "none";
          if (e.currentTarget.nextElementSibling) {
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
          }
        }} />
      ) : null}
      <div className={styles.fallback} style={{ display: src ? "none" : "flex" }}>
        {fallback}
      </div>
    </div>
  );
}
