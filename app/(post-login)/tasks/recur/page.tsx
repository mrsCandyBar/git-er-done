"use client";

import { useEffect, useState } from "react";
import type { CardStackItem } from "@/components/CardStack";
import { createStackCards, createRecurStackCards } from "@/models/task";
import { taskStore } from "../../../../stores";
import styles from "./page.module.scss";
import ScatteredCardStack from "@/components/CardStack/ScatteredCardStack";
import { Column } from "../task/types";
import { getPropFromUrl } from "@/utilities/helper";

export default function RecurringTasksPage() {
  const [cards, setCards] = useState<CardStackItem[]>(createRecurStackCards([]));

  useEffect(() => {
    let isMounted = true;
    async function loadPageData() {
      try {
        const [tasks]:any = await Promise.all([
          taskStore.getAllTasks({ recurId: getPropFromUrl("recurId") as Column["recurId"] ?? undefined }),
        ]);

        if (!isMounted) { return; }

        // SET CARDS TO TASKS
        const hasTasks = tasks && (tasks.length > 0);
        const dynamicCards = hasTasks ? createRecurStackCards(tasks) : createRecurStackCards([]);
        setCards(dynamicCards);
        
      } catch {
        if (isMounted) {
          setCards(createStackCards([]));
        }
      }
    }

    loadPageData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.stackArea}>
        <ScatteredCardStack
          cards={cards}
          emptyLabel="Reshuffle!"
          emptyDescription="Oh no, looks like you've swiped through all the cards!"
        />
      </div>
    </div>
  );
}
