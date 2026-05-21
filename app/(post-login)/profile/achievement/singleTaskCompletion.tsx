"use client";

import type { ReactNode } from "react";
import { Button, TaskTable, Text, Card, Badge } from "@/components/index";
import { getTaskMoodLabel, type TaskMood } from "@/models/taskMood";
import { closeProfileActionContent } from "../../../../models/actionContent";
import moment from "moment";
import { taskStore } from "@/stores/taskStore";

type TaskChecklistItem = {
  label: string;
  checked: boolean;
};

type SingleCompletedTask = {
  _id: string;
  icon: string;
  state: "waiting" | "busy" | "complete";
  title: string;
  description: string;
  checklist?: TaskChecklistItem[];
  category: string;
  createdDate: string;
  startedDate: string;
  startedAt?: string;
  updatedDate: string;
  completed?: {
    completedDate?: string;
    mood?: TaskMood;
    finalNotes?: string;
    recur?: boolean;
    keepsakeUrl?: string;
  };
};

type SingleTaskCompletionInsightsProps = {
  task: SingleCompletedTask;
  profileName: string;
  profilePicture: string;
  onOpenUpdateProfile?: () => void;
  showSingleTaskInsights?: boolean;
  children?: ReactNode;
};

export default function SingleTaskCompletionInsights({
  task,
  profileName,
  profilePicture,
  onOpenUpdateProfile,
  showSingleTaskInsights = true,
  children,
}: SingleTaskCompletionInsightsProps) {
  const card = closeProfileActionContent;
  const completedChecklistCount = task.checklist?.filter((item) => item.checked).length ?? 0;

  return (
    <Card
      eyebrow={<Text as="h4">{card.eyebrow()}</Text>}
      icon={card.profileImage(profilePicture)}
      title={<Text as="h3">{card.title(profileName)}</Text>}
      description={
        <>
          {showSingleTaskInsights && (
            <>
              <Text as="h3" align="center" fullWidth>
                Congratulations on having <br/>
                completed your first quest! 🎉
              </Text>

              <br/>
              <br/>
              <Card
                title={task.title}
                description={task.description}
                icon={task.icon}
              >
                <>
                  {/* Example badges, replace with dynamic badges based on task completion details
                  <Badge label="Mission Complete!" variant="sunshine" />
                  */}
                  <Text as="p">
                    This was: <b>{taskStore.getTaskCategoryName(task.category)}</b>, {task?.checklist? "and had a list of goals that could be achieved" : "and easy to accomplish"}<br/><br/>
                  </Text>

                  
                  <Text as="h3" align="center" fullWidth>What 🫵 have achieved</Text>
                  <Text as="p" tone="secondary">
                    You did this on <b>{moment(task.completed?.completedDate).format("MMMM Do, YYYY")}</b>{task.startedDate ? <> over <b>{moment(task.completed?.completedDate).diff(moment(task.startedDate), "hours")} hours</b></> : null}.<br/>
                    it made you feel <b>{task.completed && task.completed.mood && getTaskMoodLabel(task.completed.mood)}</b><br/>
                  </Text>
                  {/* Example badges, replace with dynamic badges based on task completion details
                  <Badge label="Mood Check" variant="sunshine" />
                  */}

                  {task.checklist && task.checklist.length > 0 && (
                    <>
                      <Text as="h4">
                        🫵 completed {completedChecklistCount} out of {task.checklist.length} goals
                      </Text>

                      <TaskTable tasks={task.checklist} useIcons />
                      {/* Example badges, replace with dynamic badges based on task completion details
                      <Badge label={`${Math.floor((completedChecklistCount / task.checklist.length) * 100)}% complete!`} variant="sunshine" />
                      */}
                    </>
                  )}
                  

                  {task.completed && task.completed.finalNotes && (
                    <>
                      <br/>
                      <Text as="blockquote" tone="quote">
                        {task.completed.finalNotes}
                      </Text>
                    </>
                  )}
                  {task.completed && task.completed.keepsakeUrl && (
                    <>
                      <Text as="h4">
                        Relive that moment
                      </Text>
                      <Button href={task.completed.keepsakeUrl} target="_blank" rel="noreferrer noopener" variant="outline">
                        Open keepsake
                      </Button>
                    </>
                  )}
                </>
              </Card>
            </>
          )}

          {children}

          <Card
            bare
            title={<Text as="h3" align="center" fullWidth>So... what is Brioh again?</Text>}
            description={
              <>
                <Text as="p" tone="secondary">
                  Brioh is designed to help 🫵 reconnect with 🫵.
                </Text>
                  <br/>
                <Text as="h2" align="center" fullWidth> 🧙‍♀️🚞🤴🏰💂</Text>
              </>
            }
            actions={(
              <>
                <br/>
                <Button variant="filled" onClick={onOpenUpdateProfile}>
                  Make meaningful progress 🪄
                </Button>
              </>
            )}
          />
        </>
      }
    />
  );
}