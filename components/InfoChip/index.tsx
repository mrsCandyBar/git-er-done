import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./InfoChip.module.scss";

type InfoChipProps = {
  label: string;
  icon?: IconProp;
  variant?: "default" | "outline" | "bright";
  className?: string;
  onClose?: () => void;
};

export default function InfoChip({
  label,
  icon,
  variant = "default",
  className = "",
  onClose,
}: InfoChipProps) {
  const chipClassName = `${styles.chip} ${styles[variant]} ${className}`.trim();

  return (
    <span className={chipClassName}>
      {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
      <span>{label}</span>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={`Remove ${label}`}
        >
          <FontAwesomeIcon icon={faXmark} className={styles.icon} />
        </button>
      )}
    </span>
  );
}
