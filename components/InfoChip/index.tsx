import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InfoChip.module.scss";

type InfoChipProps = {
  label: string;
  icon?: IconProp;
  variant?: "default" | "outline" | "bright";
  className?: string;
};

export default function InfoChip({
  label,
  icon,
  variant = "default",
  className = "",
}: InfoChipProps) {
  const chipClassName = `${styles.chip} ${styles[variant]} ${className}`.trim();

  return (
    <span className={chipClassName}>
      {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
      {label}
    </span>
  );
}
