'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleInfo,
  faTriangleExclamation,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { ToastItem } from "./useToast";
import Button from "../Button";
import Text from "../Text";
import styles from "./Toast.module.scss";

type ToastRegionProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

export default function ToastRegion({ toasts, onDismiss }: ToastRegionProps) {
  return (
    <div className={styles.region} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const variantClass = styles[toast.variant];
        const icon =
          toast.variant === "success"
            ? faCircleCheck
            : toast.variant === "warning"
              ? faTriangleExclamation
              : toast.variant === "error"
                ? faCircleXmark
                : faCircleInfo;

        return (
          <div key={toast.id} className={`${styles.toast} ${variantClass}`} role="status">
            <div className={styles.iconWrap}>
              <FontAwesomeIcon icon={icon} className={styles.icon} />
            </div>
            <div className={styles.content}>
              <Text as="strong" className={styles.title}>{toast.title}</Text>
              {toast.description && (
                <Text as="p" tone="secondary" className={styles.description}>{toast.description}</Text>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              className={styles.dismiss}
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              x
            </Button>
          </div>
        );
      })}
    </div>
  );
}
