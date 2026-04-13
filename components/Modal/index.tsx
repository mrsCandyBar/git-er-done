'use client';

import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import Button from "../Button";
import Text from "../Text";
import styles from "./Modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  closeLabel?: string;
  showCloseButton?: boolean;
  showFooterCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryActionLabel,
  onPrimaryAction,
  closeLabel = "Close",
  showCloseButton = true,
  showFooterCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        {showCloseButton && (
          <button type="button" className={styles.iconClose} onClick={onClose} aria-label="Close modal">
            x
          </button>
        )}

        <div className={styles.body}>
          {title && (
            <Text as="h3" className={styles.title}>
              {title}
            </Text>
          )}
          {description && (
            <Text as="p" tone="secondary" className={styles.description}>
              {description}
            </Text>
          )}
          {children}
        </div>

        {(showFooterCloseButton || primaryActionLabel) && (
          <div className={styles.actions}>
            {showFooterCloseButton && (
              <Button type="button" variant="filled" onClick={onClose}>
                {closeLabel}
              </Button>
            )}
            {primaryActionLabel && (
              <Button type="button" variant="filled" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
