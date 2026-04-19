"use client";

import { useEffect, useState } from "react";
import CardStack from "../../../../components/CardStack";
import type { CardStackItem } from "../../../../components/CardStack";
import { taskStore, userStore } from "../../../../stores";
import styles from "./page.module.scss";
import { Column } from "../../task/types";

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
    ctaHref: `/task?#${card.id}`,
  }));
}

function getStatusFromUrl(): Column["status"] {
  const params = new URLSearchParams(window.location.search);
  return params.get("status") as Column["status"] || undefined;
}

export default function TasksPage() {
  const [cards, setCards] = useState<CardStackItem[]>(createStackCards(taskCardPayloads));

  

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      try {
        const [profile, tasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.listTasks({ status: getStatusFromUrl() ?? undefined }),
        ]);

        if (!isMounted) {
          return;
        }

        const dynamicCards = (tasks && (tasks.length > 0))
          ? tasks.map((task) => ({
              title: task.title,
              description: task.description,
              ctaLabel: "Start! 🚀",
              ctaHref: `/task?#${task.id}`,
            }))
          : createStackCards(taskCardPayloads);

        setCards(dynamicCards);

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
