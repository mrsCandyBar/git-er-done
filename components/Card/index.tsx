'use client';

import type { MouseEventHandler, ReactNode } from "react";
import Button from "../Button";
import Text from "../Text";
import styles from "./Card.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type CardProps = {
  children?: ReactNode;
  eyebrow?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  imageUrl?: string;
  imageDescription?: string;
  minHeight?: number | string | false;
  fullWidth?: boolean;
  bare?: boolean;
  showCloseButton?: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: MouseEventHandler<HTMLButtonElement>;

  cta2Label?: string;
  cta2Href?: string;
  onCta2Click?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export default function Card({
  children,
  eyebrow,
  icon,
  title,
  description,
  actions,
  imageUrl,
  imageDescription,
  minHeight = 360,
  fullWidth = true,
  bare = false,
  showCloseButton = false,
  onClose,
  ctaLabel,
  ctaHref,
  onCtaClick,
  cta2Label,
  cta2Href,
  onCta2Click,
  className = "",
}: CardProps) {
  const cardClassName = `${styles.card} ${fullWidth ? styles.fullWidth : ""} ${bare ? styles.bare : ""} ${className}`.trim();
  const cardStyle = {
    minHeight: minHeight === false ? undefined : minHeight,
  };

  return (
    <article className={cardClassName} style={cardStyle}>
      {showCloseButton && (
        <Button
          type="button"
          variant="ghost"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close card"
        >
          <FontAwesomeIcon icon={faClose} />
        </Button>
      )}

      {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
      {icon && <span className={`${styles.icon} icon color`} aria-hidden="true">{icon}</span>}

      {title && (
        <div className={styles.title}>
          {typeof title === "string" ? <Text as="h3">{title}</Text> : title}
        </div>
      )}

      {description && (
        <div className={styles.description}>
          {typeof description === "string" ? <Text as="p" tone="secondary">{description}</Text> : description}
        </div>
      )}

      {imageUrl && (
        <figure className={styles.figure}>
          <img
            src={imageUrl}
            alt={imageDescription || (typeof title === "string" ? title : "Card image")}
            className={styles.image}
            loading="lazy"
          />
          {imageDescription && (
            <Text as="p" tone="secondary" className={styles.imageDescription}>
              {imageDescription}
            </Text>
          )}
        </figure>
      )}

      {children}

      {actions ? (
        <div className={styles.actions}>{actions}</div>
      ) : (
        <>
          {ctaLabel && (
            <div className={styles.actions}>
              {ctaHref ? (
                <Button href={ctaHref} variant="filled">
                  {ctaLabel}
                </Button>
              ) : (
                <Button type="button" variant="filled" onClick={onCtaClick}>
                  {ctaLabel}
                </Button>
              )}
            </div>
          )}
          {cta2Label && (
            <div className={styles.actions}>
              {cta2Href ? (
                <Button href={cta2Href} variant="filled">
                  {cta2Label}
                </Button>
              ) : (
                <Button type="button" variant="filled" onClick={onCta2Click}>
                  {cta2Label}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
