"use client";

import { useState } from "react";
import CardStack from "../../../components/CardStack";
import type { CardStackItem } from "../../../components/CardStack";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Modal from "../../../components/Modal";
import Tabs from "../../../components/Tabs";
import Text from "../../../components/Text";
import styles from "./page.module.scss";

type TaskCard = {
  id: string;
  title: string;
  description: string;
};

const taskCardsByTab: Record<"fun" | "new" | "quest", TaskCard[]> = {
  fun: [
    {
      id: "dance-class-for-beginners",
      title: "Dance Class for Beginners",
      description: "Start simple and stay playful. Build confidence one small rhythm at a time.",
    },
    {
      id: "learn-pottery",
      title: "Weekend Pottery Session",
      description: "Get your hands messy and make something real. Perfection is not required.",
    },
    {
      id: "karaoke-night",
      title: "Karaoke Night",
      description: "Pick one song, show up, and have fun with it. No perfect notes needed.",
    },
    {
      id: "street-food-crawl",
      title: "Street Food Crawl",
      description: "Try two spots you have never visited and rate your favorites.",
    },
    {
      id: "board-game-night",
      title: "Board Game Night",
      description: "Host a low-key evening with one new game and close friends.",
    },
  ],
  new: [
    {
      id: "hike-sunrise-trail",
      title: "Sunrise Trail Hike",
      description: "Start your day with momentum. A short trail is enough to reset your headspace.",
    },
    {
      id: "first-climbing-gym",
      title: "First Climbing Gym Session",
      description: "Learn the basics and complete one route that challenges you.",
    },
    {
      id: "language-exchange",
      title: "Language Exchange Meetup",
      description: "Join a beginner-friendly meetup and introduce yourself in a new language.",
    },
    {
      id: "coding-kata",
      title: "Try a Coding Kata",
      description: "Solve one short coding challenge in a language you do not use daily.",
    },
    {
      id: "museum-day",
      title: "Museum Discovery Day",
      description: "Visit one exhibit outside your normal interests and capture one takeaway.",
    },
  ],
  quest: [
    {
      id: "write-5k-plan",
      title: "Build a 5K Training Plan",
      description: "Create a realistic weekly plan and schedule your first run.",
    },
    {
      id: "portfolio-refresh",
      title: "Refresh Your Portfolio",
      description: "Update your headline, one project case study, and contact section.",
    },
    {
      id: "public-speaking-goal",
      title: "Public Speaking Sprint",
      description: "Draft and practice a three-minute talk for a small audience.",
    },
    {
      id: "financial-checkin",
      title: "Monthly Financial Check-in",
      description: "Review spending trends and choose one improvement for next month.",
    },
    {
      id: "creative-30-day",
      title: "30-Day Creative Challenge",
      description: "Pick one medium and commit to a short daily output streak.",
    },
  ],
};

function createStackCards(cards: TaskCard[]): CardStackItem[] {
  return cards.map((card) => ({
    title: card.title,
    description: card.description,
    ctaLabel: "Start! 🚀",
    ctaHref: `/task#${card.id}`,
  }));
}

export default function TasksPage() {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);

  const tabs = [
    {
      id: "fun",
      label: "Do something Fun",
      content: (
        <div className={styles.stackArea}>
          <CardStack
            cards={createStackCards(taskCardsByTab.fun)}
            emptyLabel="More fun, please!"
            emptyDescription="Oh no... Where has all the fun gone?"
          />
        </div>
      ),
    },
    {
      id: "new",
      label: "Let's Try Something New",
      content: (
        <div className={styles.stackArea}>
          <CardStack
            cards={createStackCards(taskCardsByTab.new)}
            emptyLabel="More new things, please!"
            emptyDescription="The cards have blown away..."
          />
        </div>
      ),
    },
    {
      id: "quest",
      label: "Embark on a Quest",
      content: (
        <div className={styles.stackArea}>
          <CardStack
            cards={createStackCards(taskCardsByTab.quest)}
            emptyLabel="More quests, please!"
            emptyDescription="No more quests in sight... Time to forge new ones!"
          />
        </div>
      ),
    },
  ];

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

    
      <Tabs items={tabs} defaultActiveId="fun" />

      <Card
        bare
        className={styles.newQuestCard}
        title="Ready for a new adventure"
        actions={(
          <Button href="/tasks/new" variant="outline">
            Create New Quest
          </Button>
        )}
      />
    </div>
  );
}
