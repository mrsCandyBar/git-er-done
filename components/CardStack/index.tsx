'use client';

import { useState, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
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
};

type CardStackProps = {
  cards: CardStackItem[];
  emptyLabel?: string;
  emptyDescription?: string;
};

// Pre-defined positions: index = position in stack (0 = top/front)
const POSITIONS: Array<{ y: number; rotate: number }> = [
  { y: 0,  rotate: 0 },
  { y: 18, rotate: -2.4 },
  { y: 34, rotate: 2.8 },
  { y: 48, rotate: -1.8 },
];

// How long the flick-out animation runs before the order swaps
const FLICK_MS = 180;
const DISMISS_THRESHOLD = 120;

// Fixed height so the container never resizes as cards are removed
const STACK_HEIGHT = 480;

type FlickDirection = "left" | "right";

export default function CardStack({
  cards,
  emptyLabel = "Bring Back Cards",
  emptyDescription = "You've gone through all the cards.",
}: CardStackProps) {
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [flicking, setFlicking] = useState<{ index: number; direction: FlickDirection } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isAnimating = useRef(false);
  const activePointerId = useRef<number | null>(null);
  const dragStartX = useRef(0);

  // Empty once the last card has finished flying off
  const isEmpty = order.length === 0 && flicking === null;

  const flick = (direction: FlickDirection = "right") => {
    if (isAnimating.current || order.length === 0) return;
    isAnimating.current = true;
    setIsDragging(false);
    setDragX(0);
    const topCardIndex = order[0];
    const remaining = order.slice(1); // permanently drop the top card
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
    setOrder(cards.map((_, i) => i));
    setDragX(0);
    setIsDragging(false);
    activePointerId.current = null;
  };

  if (isEmpty) {
    return (
      <div className={styles.emptyState}>
        <Text as="p" tone="secondary">{emptyDescription}</Text>
        <Button type="button" variant="outline" onClick={restore}>
          {emptyLabel}
        </Button>
      </div>
    );
  }

  const total = order.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.stack} style={{ height: STACK_HEIGHT } as CSSProperties}>
        {order.map((cardIndex, position) => {
          const pos = POSITIONS[Math.min(position, POSITIONS.length - 1)];
          const isTop = position === 0;
          const isFlicking = flicking?.index === cardIndex;

          const transform = isFlicking
            ? flicking.direction === "left"
              ? `translateX(-160%) translateY(-90px) rotate(-28deg)`
              : `translateX(160%) translateY(-90px) rotate(28deg)`
            : isTop && isDragging
              ? `translateX(${dragX}px) rotate(${dragX / 16}deg)`
            : `translateY(${pos.y}px) rotate(${pos.rotate}deg)`;

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
