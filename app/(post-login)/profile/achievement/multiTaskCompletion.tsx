"use client";

import { Button, Badge, Card, TaskTable, Text } from "@/components/index";
import type { UserProfile } from "@/models/userProfile";
import styles from "../page.module.scss";
import { taskStore } from "@/stores/taskStore";
import { useEffect, useState } from "react";

type MultiTaskCompletionInsightsProps = {
  currentUserProfile: UserProfile;
};

export default function MultiTaskCompletionInsights({
  currentUserProfile,
}: MultiTaskCompletionInsightsProps) {
  const [userTasks, setUserTasks] = useState([]);
  
  const aspirationCounts = {
    new: currentUserProfile.aspirations.new.length,
    fun: currentUserProfile.aspirations.fun.length,
    task: currentUserProfile.aspirations.task.length,
  };

  const achievementTotals = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.task.length;
      const recognisedCount = entry.recognised.length;

      return {
        completed: acc.completed + completedCount,
        recognised: acc.recognised + recognisedCount,
      };
    },
    { completed: 0, recognised: 0 }
  );

  if (achievementTotals.completed < 2) {
    return null;
  }

  const dominantAspirationCategory =
    aspirationCounts.new >= aspirationCounts.fun && aspirationCounts.new >= aspirationCounts.task
      ? "new"
      : aspirationCounts.task >= aspirationCounts.fun
        ? "task"
        : "fun";

  const mindsetSummary =
    dominantAspirationCategory === "new"
      ? "You are leaning into growth and choosing fresh experiences to motivate positive change."
      : dominantAspirationCategory === "task"
        ? "You are in momentum, focused on getting ahead of your day-to-day commitments."
        : "You are signaling a healthy need for personal time, joy, and restorative space.";

  const primaryInspiration = currentUserProfile.inspirations[0];

  const startedAt = new Date(currentUserProfile.startedDate).getTime();
  const updatedAt = new Date(currentUserProfile.updatedDate).getTime();
  const elapsedHours = Number.isFinite(startedAt) && Number.isFinite(updatedAt)
    ? Math.max(0, Math.ceil((updatedAt - startedAt) / (1000 * 60 * 60)))
    : 0;

  useEffect(() => {
    async function loadTasks() {
      const allTasks:any = await taskStore.getAllTasks();
      const tasksForTable = allTasks.map((task:any) => {
        return {
          label: task.name,
          description: task.description,
          checked: task.state == "complete",
        }
      });
      setUserTasks(tasksForTable);
    }
    loadTasks();
  }, []);


  return (
    <>
      <Text as="p" tone="secondary">
        Your current aspirations are mapped across <br/>
        <b>new</b> ({aspirationCounts.new}), <b>fun</b> ({aspirationCounts.fun}), and <b>quest</b> ({aspirationCounts.task}). <br/>
      </Text>

      <Text as="h4" align="center" fullWidth>Progress & Wins</Text>
      <Text as="p" tone="secondary">
        You have completed <b>{achievementTotals.completed}</b> self-prioritized time slots<br/>
        within the timespan of {elapsedHours} hours, <br/>
        and earned <b>{achievementTotals.recognised}</b> badges of recognition so far.
      </Text>

      <div className={styles.badgeRow}>
        <Badge label="Level up" subtitle="Reward unlocked" variant="sky" />
        <Badge label="Focus mode" variant="slate" />
      </div>

      <Text as="p" tone="secondary">
        These wins are proof that a little dedicated time<br/>
        can create meaningful progress.
      </Text>

      <br />
      <br />
      <Text as="h3" align="center" fullWidth>
        How well do your aspirations compare <br/>
        against the inspiration you gave us?
      </Text>
      <br/>
      <Card
        title={<Text as="h2" align="center" fullWidth>Let's take a closer look 👀</Text>}
        description={
          <>
            <Text as="p" tone="secondary">
              You are inspired by <b>{primaryInspiration?.inspiration ?? "still being defined"}</b>,
              because you want <b>{primaryInspiration?.reason ?? "still being defined"}</b>
            </Text>
          </>}
      >
        <br/>
        <Text as="p">
          The type of quests you create counts, it tells us:
        </Text>
        <Text as="blockquote" tone="secondary">
          {mindsetSummary}
        </Text>

        <TaskTable
          tasks={userTasks}
          taskHeader="The Quests You have Acknowledged"
          statusHeader="Status"
          useIcons
          completedLabel="Completed"
          pendingLabel=""
        />

        <br/>
        <Text as="p" tone="secondary">
          When you look at the titles of these quests,<br/>
          do they feel like something your inspiration would say?
        </Text>
        <br/>

      </Card>

      <br/>
      <Card
        bare
        title={<Text as="h3" align="center" fullWidth>Incredible work so far, so now... <br/>we can finally answer <u>What is Brioh?</u></Text>}
        description={
          <>
            <Text as="p" tone="secondary">
              Brioh is designed to help 🫵 reconnect with yourself.
            </Text>
            <br/>
            <Text as="h1" align="center" fullWidth> 🧙‍♀️🚞🤴🏰💂</Text>
            <br/>
            <Text as="p" tone="secondary">
              You have achieved all this since we met<br/>
              Let's turn 🫵 aspirations & goals into reality!
            </Text>
          </>
        }
        actions={(
          <>
            <br/>
            <Button href="/profile/account" variant="filled">
              Shall we continue questing together?
            </Button>
            <br/>
          </>
        )}
      />
    </>
  );
}