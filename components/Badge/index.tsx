import type { ReactNode } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "sunshine" | "mint" | "coral" | "sky" | "slate";

type BadgeProps = {
  label: ReactNode;
  subtitle?: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({
  label,
  subtitle,
  variant = "sunshine",
  className = "",
}: BadgeProps) {
  return (
    <div className={`${styles.stack} ${className}`.trim()}>
      <span className={`${styles.badge} ${styles[variant]}`.trim()}>{label}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
  );
}
