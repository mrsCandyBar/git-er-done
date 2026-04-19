"use client";

import { useEffect, useState } from "react";
import CardStack from "../../../components/CardStack";
import type { CardStackItem } from "../../../components/CardStack";
import Modal from "../../../components/Modal";
import Text from "../../../components/Text";
import { taskStore, userStore } from "../../../stores";
import styles from "./page.module.scss";

type TaskCard = {
  type: "fun" | "new" | "quest";
  id: string;
  title: string;
  description: string;
};

const taskCardPayloads: TaskCard[] = [
  {
    type: "fun",
    id: "dance-class-for-beginners",
    title: "Dance Class for Beginners",
    description: "Start simple and stay playful. Build confidence one small rhythm at a time.",
  },
  {
    type: "fun",
    id: "learn-pottery",
    title: "Weekend Pottery Session",
    description: "Get your hands messy and make something real. Perfection is not required.",
  },
  {
    type: "fun",
    id: "karaoke-night",
    title: "Karaoke Night",
    description: "Pick one song, show up, and have fun with it. No perfect notes needed.",
  },
  {
    type: "new",
    id: "hike-sunrise-trail",
    title: "Sunrise Trail Hike",
    description: "Start your day with momentum. A short trail is enough to reset your headspace.",
  },
  {
    type: "new",
    id: "first-climbing-gym",
    title: "First Climbing Gym Session",
    description: "Learn the basics and complete one route that challenges you.",
  },
  {
    type: "quest",
    id: "write-5k-plan",
    title: "Build a 5K Training Plan",
    description: "Create a realistic weekly plan and schedule your first run.",
  },
  {
    type: "quest",
    id: "portfolio-refresh",
    title: "Refresh Your Portfolio",
    description: "Update your headline, one project case study, and contact section.",
  },
  {
    type: "quest",
    id: "creative-30-day",
    title: "30-Day Creative Challenge",
    description: "Pick one medium and commit to a short daily output streak.",
  },
];

function createStackCards(cards: TaskCard[]): CardStackItem[] {
  return cards.map((card) => ({
    title: card.title,
    description: card.description,
    ctaLabel: "Start! 🚀",
    ctaHref: `/tasks/task?#${card.id}`,
  }));
}

export default function TasksPage() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [cards, setCards] = useState<CardStackItem[]>(createStackCards(taskCardPayloads));

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      try {
        const [profile, tasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.listTasks(),
        ]);

        if (!isMounted) {
          return;
        }

        const completedTasksCount = Array.isArray(profile.achievements)
          ? profile.achievements.reduce((count, achievement) => {
              const completed = achievement?.completed;
              return (
                count +
                (completed?.new?.length ?? 0) +
                (completed?.fun?.length ?? 0) +
                (completed?.quest?.length ?? 0)
              );
            }, 0)
          : 0;

        const dynamicCards = tasks.length > 0
          ? tasks.map((task) => ({
              title: task.title,
              description: task.description,
              ctaLabel: "Start! 🚀",
              ctaHref: `/tasks/task?#${task.id}`,
            }))
          : createStackCards(taskCardPayloads);

        setCards(dynamicCards);
        setIsWelcomeOpen(profile.status === "friend_new" && completedTasksCount === 1);
      } catch {
        if (isMounted) {
          setCards(createStackCards(taskCardPayloads));
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Modal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
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
