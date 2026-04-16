'use client';

import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import Button from "../Button";
import Text from "../Text";
import styles from "./Modal.module.scss";

const MODAL_COUNT_ATTR = "data-modal-count";
const MODAL_OPEN_ATTR = "data-modal-open";
const MODAL_OVERFLOW_ATTR = "data-modal-overflow";

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

    const body = document.body;
    const activeCount = Number.parseInt(body.getAttribute(MODAL_COUNT_ATTR) ?? "0", 10) || 0;

    if (activeCount === 0) {
      body.setAttribute(MODAL_OVERFLOW_ATTR, body.style.overflow ?? "");
      body.style.overflow = "hidden";
    }

    body.setAttribute(MODAL_COUNT_ATTR, String(activeCount + 1));
    body.setAttribute(MODAL_OPEN_ATTR, "true");

    const onKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      const nextCount = Math.max(
        0,
        (Number.parseInt(body.getAttribute(MODAL_COUNT_ATTR) ?? "1", 10) || 1) - 1
      );

      if (nextCount === 0) {
        const previousOverflow = body.getAttribute(MODAL_OVERFLOW_ATTR) ?? "";
        body.style.overflow = previousOverflow;
        body.removeAttribute(MODAL_COUNT_ATTR);
        body.removeAttribute(MODAL_OPEN_ATTR);
        body.removeAttribute(MODAL_OVERFLOW_ATTR);
      } else {
        body.setAttribute(MODAL_COUNT_ATTR, String(nextCount));
      }

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
