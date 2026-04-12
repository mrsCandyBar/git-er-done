'use client';

import confetti from "canvas-confetti";
import type { MouseEventHandler } from "react";
import Button from "../Button";
import styles from "./ConfettiButton.module.scss";

type ConfettiButtonProps = {
  label?: string;
  className?: string;
};

export default function ConfettiButton({
  label = "Celebrate Success",
  className = "",
}: ConfettiButtonProps) {
  const randomCenterOffset = () => {
    const direction = Math.random() < 0.5 ? -1 : 1;
    const magnitude = 0.1 + Math.random() * 0.08; // 10% to 18% offset from center
    return 0.5 + direction * magnitude;
  };

  const randomVerticalOffset = () => 0.9 + Math.random() * 0.1; // 90% to 100% viewport height
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
      origin: { y: 1 },
    });
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
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

  return (
    <Button
      type="button"
      variant="filled"
      className={`${styles.button} ${className}`.trim()}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
