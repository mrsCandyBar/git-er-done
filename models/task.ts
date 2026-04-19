import { CardStackItem } from "@/components/CardStack";
import { UserProfile } from "./userProfile";

// This file defines the TaskCard type, which represents 
// the structure of a task card in the application.

export type TaskCard = {
  type: "fun" | "new" | "quest";
  id: string;
  title: string;
  description: string;
};

// Helper to convert TaskCard payloads to CardStackItem format

export function createStackCards(cards: { title: string; description: string; id: string }[]): CardStackItem[] {
  return cards.map((card) => ({
    title: card.title,
    description: card.description,
    ctaLabel: "Start! 🚀",
    ctaHref: `/tasks/task?#${card.id}`,
  }));
}

// Payloads for default task cards, 
// which are shown when users have no tasks yet.

export const taskCardPayloads: TaskCard[] = [
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

// Task Helper Functions
// Cleanups for the views

export function countCompletedTasks(profile: UserProfile): Number {
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
    
    return completedTasksCount;
}