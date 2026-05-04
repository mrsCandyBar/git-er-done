"use client";

import { useEffect, useState } from "react";
import { CardStack, Text } from "@/components/index";
import type { CardStackItem } from "@/components/CardStack";
import { createStackCards } from "@/models/task";
import { getPropFromUrl } from "@/utilities/helper";
import { taskStore } from "../../../../stores";
import styles from "../page.module.scss";
import { Column } from "../task/types";

export default function TasksPage() {
  const [cards, setCards] = useState<CardStackItem[]>(createStackCards([]));

  useEffect(() => {
    let isMounted = true;
    async function loadPageData() {
      try {
        const [tasks]:any = await Promise.all([
          taskStore.getAllTasks({ state: getPropFromUrl("state") as Column["state"] ?? undefined }),
        ]);

        if (!isMounted) { return; }

        const hasTasks = tasks && (tasks.length > 0);
        const dynamicCards = hasTasks ? createStackCards(tasks, getPropFromUrl("state")) : createStackCards([], getPropFromUrl("state"));
        setCards(dynamicCards);

      } catch {
        if (isMounted) { setCards(createStackCards([])); }
      }
    }

    loadPageData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.stackArea}>
        {cards && cards.length > 0 ? (
          <CardStack
            cards={cards}
            emptyLabel="Reshuffle!"
            emptyDescription="Oh no, looks like you've swiped through all the cards!"
          />
        ) : (
          <Text tone="secondary">No tasks found</Text>
        )}
      </div>
    </div>
  );
}
