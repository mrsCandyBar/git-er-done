"use client";

import { useEffect, useState } from "react";
import CardStack from "@/components/CardStack";
import type { CardStackItem } from "@/components/CardStack";
import { taskCardPayloads, createStackCards } from "@/models/task";
import { getPropFromUrl } from "@/utilities/helper";
import { taskStore } from "../../../../stores";
import styles from "../page.module.scss";
import { Column } from "../task/types";

export default function TasksPage() {
  const [cards, setCards] = useState<CardStackItem[]>(createStackCards(taskCardPayloads));

  useEffect(() => {
    let isMounted = true;
    async function loadPageData() {
      try {
        const [tasks] = await Promise.all([
          taskStore.listTasks({ status: getPropFromUrl("status") as Column["status"] ?? undefined }),
        ]);

        if (!isMounted) { return; }

        const hasTasks = tasks && (tasks.length > 0);
        const dynamicCards = hasTasks ? createStackCards(tasks) : createStackCards(taskCardPayloads);
        setCards(dynamicCards);

      } catch {
        if (isMounted) { setCards(createStackCards(taskCardPayloads)); }
      }
    }

    loadPageData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.stackArea}>
        <CardStack
          cards={cards}
          emptyLabel="Reshuffle!"
          emptyDescription="Oh no, looks like you've swiped through all the cards!"
        />
      </div>
    </div>
  );
}
