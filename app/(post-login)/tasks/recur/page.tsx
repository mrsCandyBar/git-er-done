"use client";

import { useEffect, useState } from "react";
import type { CardStackItem } from "@/components/CardStack";
import { taskCardPayloads, createStackCards, createRecurStackCards } from "@/models/task";
import { taskStore } from "../../../../stores";
import styles from "./page.module.scss";
import ScatteredCardStack from "@/components/CardStack/ScatteredCardStack";

export default function RecurringTasksPage() {
  const [newUser, setNewUser] = useState(false);
  const [cards, setCards] = useState<CardStackItem[]>(createRecurStackCards(taskCardPayloads));

  useEffect(() => {
    let isMounted = true;
    async function loadPageData() {
      try {
        const [tasks] = await Promise.all([
          taskStore.listTasks({ status: "waiting" }),
        ]);

        if (!isMounted) { return; }

        // SET CARDS TO TASKS
        const hasTasks = tasks && (tasks.length > 0);
        const dynamicCards = hasTasks ? createRecurStackCards(tasks) : createRecurStackCards(taskCardPayloads);
        setCards(dynamicCards);
        
      } catch {
        if (isMounted) {
          setCards(createStackCards(taskCardPayloads));
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
