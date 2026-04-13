import type { ReactNode } from "react";
import styles from "./PostLoginCard.module.scss";

type PostLoginCardProps = {
  children?: ReactNode;
  eyebrow?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  bare?: boolean;
};

export default function PostLoginCard({
  children,
  eyebrow,
  icon,
  title,
  description,
  actions,
  className = "",
  fullWidth = true,
  bare = false,
}: PostLoginCardProps) {
  const cardClassName = `${styles.card} ${fullWidth ? styles.fullWidth : ""} ${bare ? styles.bare : ""} ${className}`.trim();

  return (
    <article className={cardClassName}>
      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {title && <div className={styles.title}>{title}</div>}
      {description && <div className={styles.description}>{description}</div>}
      {children}
      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
}
