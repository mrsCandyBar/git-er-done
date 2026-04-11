'use client';

import { useMemo } from "react";
import type { CSSProperties, MouseEventHandler } from "react";
import Button from "../Button";
import Text from "../Text";
import styles from "./Card.module.scss";

type CardProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageDescription?: string;
  fullWidth?: boolean;
  stackable?: boolean;
  stackOrder?: number;
  showCloseButton?: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export default function Card({
  title,
  description,
  imageUrl,
  imageDescription,
  fullWidth = false,
  stackable = false,
  stackOrder = 0,
  showCloseButton = false,
  onClose,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className = "",
}: CardProps) {
  const tiltStyle = useMemo(() => {
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
    const rotate = randomInRange(-2.4, 2.4);
    const translateX = randomInRange(-4, 4);
    const translateY = randomInRange(-3, 3);

    return {
      "--card-rotate": `${rotate.toFixed(2)}deg`,
      "--card-translate-x": `${translateX.toFixed(2)}px`,
      "--card-translate-y": `${translateY.toFixed(2)}px`,
      "--stack-order": String(stackOrder),
    } as CSSProperties;
  }, [stackOrder]);

  const cardClassName = `${styles.card} ${fullWidth ? styles.fullWidth : ""} ${stackable ? styles.stackable : ""} ${className}`.trim();

  return (
    <article className={cardClassName} style={tiltStyle}>
      {showCloseButton && (
        <Button
          type="button"
          variant="ghost"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close card"
        >
          x
        </Button>
      )}

      {(title || description) && (
        <header className={styles.header}>
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
        </header>
      )}

      {imageUrl && (
        <figure className={styles.figure}>
          <img
            src={imageUrl}
            alt={imageDescription || title || "Card image"}
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
    </article>
  );
}
