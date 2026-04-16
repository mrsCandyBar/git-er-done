import type { ReactNode } from "react";
import Button from "@/components/Button";
import TaskTable from "@/components/TaskTable";
import Text from "@/components/Text";
import { getTaskMoodLabel, type TaskMood } from "@/models/taskMood";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import { closeProfileActionContent } from "../../../models/actionContent";

type TaskChecklistItem = {
  label: string;
  checked: boolean;
};

type SingleCompletedTask = {
  id: string;
  icon: string;
  status: "waiting" | "busy" | "complete";
  title: string;
  description: string;
  tasks: TaskChecklistItem[];
  category: "new" | "fun" | "quest";
  createdDate: string;
  startedDate: string;
  startedAt?: string;
  updatedDate: string;
  completed: {
    completedDate: string;
    completedAt?: string;
    mood: TaskMood;
    finalNotes?: string;
    recur: boolean;
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

function getDurationLabel(startValue?: string, endValue?: string) {
  if (!startValue || !endValue) {
    return null;
  }

  const start = new Date(startValue).getTime();
  const end = new Date(endValue).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return null;
  }

  const durationMs = end - start;
  const totalMinutes = Math.floor(durationMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days} day${days === 1 ? "" : "s"}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  }

  return parts.length > 0 ? parts.join(" ") : "less than 1 minute";
}

export default function SingleTaskCompletionInsights({
  task,
  profileName,
  profilePicture,
  onOpenUpdateProfile,
  showSingleTaskInsights = true,
  children,
}: SingleTaskCompletionInsightsProps) {
  const card = closeProfileActionContent;
  const completedChecklistCount = task.tasks.filter((item) => item.checked).length;
  const durationLabel = getDurationLabel(
    task.startedAt ?? task.startedDate,
    task.completed.completedAt ?? task.completed.completedDate
  );
    console.log("task", task);

  return (
    <Card
      eyebrow={<Text as="h4">{card.eyebrow()}</Text>}
      icon={card.profileImage(profilePicture)}
      title={<Text as="h2">{card.title(profileName)}</Text>}
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
                  <Badge label="Mission Complete!" variant="sunshine" />
                  <Text as="p">
                    This was: <b>{task.category}</b>, {task?.tasks? "and had a list of goals that could be achieved" : "and easy to accomplish"}<br/><br/>
                  </Text>

                  
                  <Text as="h3" align="center" fullWidth>What 🫵 have achieved</Text>
                  <Text as="p" tone="secondary">
                    You did this on <b>{task.completed.completedDate}</b>{durationLabel ? <> over <b>{durationLabel}</b></> : null}.<br/>
                    it made you feel <b>{getTaskMoodLabel(task.completed.mood)}</b><br/>
                  </Text>
                  <Badge label="Mood Check" variant="sunshine" />

                  {task.tasks.length > 0 && (
                    <>
                      <Text as="h4">
                        🫵 completed {completedChecklistCount} out of {task.tasks.length} goals
                      </Text>

                      <TaskTable tasks={task.tasks} useIcons />
                      <Badge label={`${Math.floor((completedChecklistCount / task.tasks.length) * 100)}% complete!`} variant="sunshine" />
                    </>
                  )}
                  

                  {task.completed.finalNotes && (
                    <>
                      <br/>
                      <Text as="blockquote" tone="quote">
                        {task.completed.finalNotes}
                      </Text>
                    </>
                  )}
                  {task.completed.keepsakeUrl && (
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
                <Text as="h1" align="center" fullWidth> 🧙‍♀️🚞🤴🏰💂</Text>
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