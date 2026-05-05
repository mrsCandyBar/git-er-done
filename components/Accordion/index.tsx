'use client';

import { useState } from "react";
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./Accordion.module.scss";

type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  allowMultiple?: boolean;
};

export default function Accordion({
  items,
  defaultOpenIds = [],
  allowMultiple = false,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);

      if (allowMultiple) {
        return isOpen ? prev.filter((openId) => openId !== id) : [...prev, id];
      }

      if (isOpen) return [];
      return [id];
    });
  };

  return (
    <div className={styles.wrapper}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-trigger-${item.id}`}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`.trim()}>
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </button>
            <div
              className={`${styles.contentWrap} ${isOpen ? styles.contentWrapOpen : ""}`.trim()}
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-trigger-${item.id}`}
              aria-hidden={!isOpen}
            >
              <div className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`.trim()}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
