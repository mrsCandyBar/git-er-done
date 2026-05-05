'use client';

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import styles from "./Tabs.module.scss";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  defaultActiveId?: string;
};

export default function Tabs({ items, defaultActiveId }: TabsProps) {
  const initialId = useMemo(() => {
    if (!items.length) return "";
    if (defaultActiveId && items.some((item) => item.id === defaultActiveId)) return defaultActiveId;
    return items[0].id;
  }, [items, defaultActiveId]);

  const [activeId, setActiveId] = useState(initialId);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  if (!items.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList} role="tablist" aria-label="Tabs">
        {items.map((item) => {
          const isActive = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              className={`${styles.tabButton} ${isActive ? styles.active : ""}`.trim()}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        className={styles.panel}
        role="tabpanel"
        id={`panel-${activeItem.id}`}
        aria-labelledby={`tab-${activeItem.id}`}
      >
        {activeItem.content}
      </div>
    </div>
  );
}
