"use client";

import { useEffect, useState } from "react";
import { CardStack, Modal, Text } from "@/components/index";
import type { CardStackItem } from "@/components/CardStack";
import { taskCardPayloads, createStackCards, countCompletedTasks } from "@/models/task";
import { taskStore, userStore } from "../../../stores";
import styles from "./page.module.scss";

export default function TasksPage() {
  const [newUser, setNewUser] = useState(false);
  const [cards, setCards] = useState<CardStackItem[]>(createStackCards(taskCardPayloads));

  useEffect(() => {
    let isMounted = true;
    async function loadPageData() {
      try {
        const [profile, tasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.listTasks(),
        ]);

        if (!isMounted) { return; }

        // DETERMINE IF WELCOME MODAL SHOULD BE SHOWN
        // Used to determine if we should show the welcome modal for new users. 
        // * We want to show it until they've completed their first task, which is usually the onboarding task.

        const completedTasksCount = countCompletedTasks(profile);
        setNewUser(profile.status === "friend_new" && completedTasksCount === 1);

        // SET CARDS TO TASKS

        const hasTasks = tasks && (tasks.length > 0);
        const dynamicCards = hasTasks ? createStackCards(tasks) : createStackCards(taskCardPayloads);
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
      <Modal
        isOpen={newUser}
        onClose={() => setNewUser(false)}
        closeLabel="You got this"
      >
        <div className={styles.welcomeCopy}>

            <br/>
            <Text as="h1" tone="secondary">😊🫳🎴</Text>
            <Text as="p" tone="secondary">Choose a card</Text>

            <br/>
            <Text as="h1" tone="secondary">😗🫸💨 🎴</Text>
            <Text as="p" tone="secondary">Not this one? Swipe it away.</Text>

            <br/>
            <Text as="h1" tone="secondary">🗃️🎴 👋😏</Text>
            <Text as="p" tone="secondary">All tasks can be put on pause. Don't stress</Text>

            <br/>
        </div>
      </Modal>

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
