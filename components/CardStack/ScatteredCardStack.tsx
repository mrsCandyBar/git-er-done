'use client';

import { useEffect, useState, useRef } from "react";
import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent } from "react";
import Card from "../Card";
import Button from "../Button";
import Text from "../Text";
import styles from "./CardStack.module.scss";

export type CardStackItem = {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageDescription?: string;
  ctaLabel?: string;
  ctaHref?: string;
  cta2Label?: string;
  cta2Href?: string;
};

type ScatteredCardStackProps = {
  cards: CardStackItem[];
  emptyLabel?: string;
  emptyDescription?: string;
  scatterWidth?: number; // px
};

const STACK_HEIGHT = 480;
const SCATTER_WIDTH = 600; // px (moderate width)
const FLICK_MS = 180;
const DISMISS_THRESHOLD = 120;

type FlickDirection = "left" | "right";

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(target.closest("button, a, input, select, textarea, label, [role='button']"));
}

export default function ScatteredCardStack({
  cards,
  emptyLabel = "Bring Back Cards",
  emptyDescription = "You've gone through all the cards.",
  scatterWidth = SCATTER_WIDTH,
}: ScatteredCardStackProps) {
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [restoring, setRestoring] = useState(false);
  const [restoreTime, setRestoreTime] = useState(Date.now());
  const [flicking, setFlicking] = useState<{ index: number; direction: FlickDirection } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isAnimating = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const dragStartX = useRef(0);
  // Generate random positions/angles for each card on mount
  const [scatter, setScatter] = useState<{ x: number; y: number; rotate: number }[]>([]);

  useEffect(() => {
    setOrder(cards.map((_, i) => i));
    setFlicking(null);
    setIsDragging(false);
    setDragX(0);
    activePointerId.current = null;
    isAnimating.current = false;
    // On mount, animate from center to scattered
    setScatter(cards.map(() => ({ x: 0, y: 0, rotate: 0 })));
    setTimeout(() => {
      setScatter(
        cards.map(() => ({
          x: Math.random() * (scatterWidth - 100) - (scatterWidth - 100) / 2,
          y: Math.random() * 220 - 60,
          rotate: Math.random() * 28 - 14,
        }))
      );
    }, 30); // short delay to trigger transition
  }, [cards, scatterWidth]);

  const isEmpty = order.length === 0 && flicking === null;

  const flick = (direction: FlickDirection = "right") => {
    if (isAnimating.current || order.length === 0) return;
    isAnimating.current = true;
    setIsDragging(false);
    setDragX(0);
    const topCardIndex = order[0];
    const remaining = order.slice(1);
    setFlicking({ index: topCardIndex, direction });
    setTimeout(() => {
      setOrder(remaining);
      requestAnimationFrame(() => {
        setFlicking(null);
        isAnimating.current = false;
      });
    }, FLICK_MS);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(e.target)) return;
    if (isAnimating.current || order.length === 0) return;
    activePointerId.current = e.pointerId;
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setDragX(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerId.current !== e.pointerId) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const handlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== e.pointerId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    activePointerId.current = null;
    const finalDragX = dragX;
    setIsDragging(false);
    if (Math.abs(finalDragX) >= DISMISS_THRESHOLD) {
      flick(finalDragX > 0 ? "right" : "left");
      return;
    }
    setDragX(0);
  };

  const restore = () => {
    setRestoring(true);
    setRestoreTime(Date.now());
    setOrder(cards.map((_, i) => i));
    setDragX(0);
    setIsDragging(false);
    activePointerId.current = null;
    // Start all cards stacked in center
    setScatter(cards.map(() => ({ x: 0, y: 0, rotate: 0 })));
    // Animate to scattered positions after a short delay
    setTimeout(() => {
      setScatter(
        cards.map(() => ({
          x: Math.random() * (scatterWidth - 100) - (scatterWidth - 100) / 2,
          y: Math.random() * 220 - 60,
          rotate: Math.random() * 28 - 14,
        }))
      );
      setRestoring(false);
    }, 30); // short delay to trigger transition
  };

  if (isEmpty) {
    return (
      <div className={styles.emptyState}>
        <Text as="p" tone="secondary">{emptyDescription}</Text>
        <Button type="button" variant="filled" onClick={restore}>
          {emptyLabel}
        </Button>
      </div>
    );
  }

  const total = order.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.stack} style={{ height: STACK_HEIGHT, width: scatterWidth } as CSSProperties}>
        {order.map((cardIndex, position) => {
          const isTop = position === 0;
          const isFlicking = flicking?.index === cardIndex;
          const scatterPos = scatter[cardIndex] || { x: 0, y: 0, rotate: 0 };
          const transform = isFlicking
            ? flicking.direction === "left"
              ? `translateX(-160%) translateY(-90px) rotate(-28deg)`
              : `translateX(160%) translateY(-90px) rotate(28deg)`
            : isTop && isDragging
              ? `translateX(${dragX}px) rotate(${dragX / 16 + scatterPos.rotate}deg) translateY(${scatterPos.y}px) translateX(${scatterPos.x}px)`
            : `translateY(${scatterPos.y}px) translateX(${scatterPos.x}px) rotate(${scatterPos.rotate}deg)`;

          const transition = isFlicking
            ? `transform ${FLICK_MS}ms cubic-bezier(0.4, 0, 1, 1)`
            : isTop && isDragging
              ? "none"
            : undefined;

          return (
            <div
              key={cardIndex}
              className={`${styles.cardWrapper} ${isTop ? styles.draggable : ""}`.trim()}
              onPointerDown={isTop ? handlePointerDown : undefined}
              onPointerMove={isTop ? handlePointerMove : undefined}
              onPointerUp={isTop ? handlePointerEnd : undefined}
              onPointerCancel={isTop ? handlePointerEnd : undefined}
              style={{
                transform,
                transition,
                zIndex: isFlicking ? total + 1 : total - position,
              } as CSSProperties}
            >
              <Card {...cards[cardIndex]} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
