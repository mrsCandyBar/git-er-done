'use client';

import confetti from "canvas-confetti";
import type { MouseEventHandler } from "react";
import Button from "../Button";
import styles from "./ConfettiButton.module.scss";

type ConfettiButtonProps = {
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  burstCount?: number;
  minBurstDelayMs?: number;
  maxBurstDelayMs?: number;
  burstPattern?: "standard" | "finale";
  minOriginY?: number;
  maxOriginY?: number;
};

export default function ConfettiButton({
  label = "Celebrate Success",
  className = "",
  onClick,
  disabled = false,
  burstCount = 1,
  minBurstDelayMs = 40,
  maxBurstDelayMs = 170,
  burstPattern = "standard",
  minOriginY = 1.04,
  maxOriginY = 1.34,
}: ConfettiButtonProps) {
  const MAX_ORIGIN_Y = 1.6;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const randomCenterOffset = () => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const magnitude = 0.1 + Math.random() * 0.08; // 10% to 18% offset from center
    return 0.5 + direction * magnitude;
  };

  const normalizedMinOriginY = Number.isFinite(minOriginY)
    ? clamp(minOriginY, 0, MAX_ORIGIN_Y)
    : 1.04;
  const normalizedMaxOriginY = Number.isFinite(maxOriginY)
    ? clamp(maxOriginY, normalizedMinOriginY, MAX_ORIGIN_Y)
    : 1.34;
  const randomVerticalOffset =
    () => normalizedMinOriginY + Math.random() * (normalizedMaxOriginY - normalizedMinOriginY);
  const randomScalar = (min: number, max: number) => min + Math.random() * (max - min);

  const shoot = (particleRatio: number, options: confetti.Options) => {
    confetti({
      ...options,
      particleCount: Math.floor(360 * particleRatio),
      spread: 95,
      startVelocity: 72,
      ticks: 320,
      gravity: 0.72,
      scalar: randomScalar(1.4, 2.9),
      zIndex: 2000,
      origin: { y: 1, ...(options.origin ?? {}) },
    });
  };

  const triggerBurst = () => {
    const centerX = randomCenterOffset();
    const centerY = randomVerticalOffset();
    const tiltDrift = (Math.random() < 0.5 ? -1 : 1) * (0.14 + Math.random() * 0.14);

    // Layered bursts for a punchy but short celebration.
    shoot(0.25, {
      angle: 58,
      origin: { x: 0.08, y: centerY },
      startVelocity: 92,
      gravity: 0.95,
      decay: 0.88,
      drift: tiltDrift,
    });
    shoot(0.25, {
      angle: 122,
      origin: { x: 0.92, y: centerY },
      startVelocity: 86,
      gravity: 0.9,
      decay: 0.89,
      drift: tiltDrift,
    });
    shoot(0.2, {
      angle: 90,
      origin: { x: centerX, y: centerY },
      spread: 85,
      startVelocity: 82,
      gravity: 0.72,
      decay: 0.92,
      drift: tiltDrift,
    });
    shoot(0.15, {
      origin: { x: centerX, y: centerY },
      spread: 130,
      startVelocity: 68,
      gravity: 0.55,
      decay: 0.94,
      drift: tiltDrift * 1.15,
    });
    shoot(0.15, {
      origin: { x: centerX, y: centerY },
      spread: 110,
      startVelocity: 54,
      gravity: 0.46,
      decay: 0.96,
      drift: tiltDrift * 1.25,
    });
  };

  const triggerSmallDirectionalBurst = () => {
    const fromLeft = Math.random() < 0.5;
    const centerY = randomVerticalOffset();
    const centerX = randomCenterOffset();
    const directionAngle = fromLeft
      ? 45 + Math.floor(Math.random() * 35)
      : 100 + Math.floor(Math.random() * 35);

    shoot(0.12, {
      angle: directionAngle,
      origin: { x: fromLeft ? 0.08 : 0.92, y: centerY },
      spread: 45 + Math.floor(Math.random() * 30),
      startVelocity: 48 + Math.floor(Math.random() * 18),
      gravity: 0.84,
      decay: 0.92,
      drift: (Math.random() < 0.5 ? -1 : 1) * (0.08 + Math.random() * 0.16),
      scalar: randomScalar(0.95, 1.35),
    });

    shoot(0.08, {
      angle: 90,
      origin: { x: centerX, y: centerY },
      spread: 38 + Math.floor(Math.random() * 24),
      startVelocity: 42 + Math.floor(Math.random() * 16),
      gravity: 0.9,
      decay: 0.93,
      scalar: randomScalar(0.9, 1.25),
    });
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);

    // Respect canceled actions so this can behave like a normal CTA button.
    if (event.defaultPrevented) {
      return;
    }

    const normalizedBurstCount = Number.isFinite(burstCount)
      ? Math.max(1, Math.floor(burstCount))
      : 1;
    const normalizedMinDelay = Number.isFinite(minBurstDelayMs)
      ? Math.max(0, Math.floor(minBurstDelayMs))
      : 40;
    const normalizedMaxDelay = Number.isFinite(maxBurstDelayMs)
      ? Math.max(normalizedMinDelay, Math.floor(maxBurstDelayMs))
      : 170;

    if (normalizedBurstCount === 1) {
      triggerBurst();
      return;
    }

    let elapsedDelay = 0;

    for (let i = 0; i < normalizedBurstCount; i += 1) {
      if (i > 0) {
        // Keep spacing short but variable so each rapid-fire click feels less scripted.
        elapsedDelay += Math.floor(
          normalizedMinDelay + Math.random() * (normalizedMaxDelay - normalizedMinDelay),
        );
      }

      window.setTimeout(() => {
        const isFinalBurst = i === normalizedBurstCount - 1;

        if (burstPattern === "finale" && !isFinalBurst) {
          triggerSmallDirectionalBurst();
          return;
        }

        triggerBurst();
      }, elapsedDelay);
    }
  };

  return (
    <Button
      type="button"
      variant="filled"
      className={`${styles.button} ${className}`.trim()}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
