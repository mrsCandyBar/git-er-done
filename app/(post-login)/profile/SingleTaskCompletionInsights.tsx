import type { ReactNode } from "react";
import Button from "@/components/Button";
import TaskTable from "@/components/TaskTable";
import Text from "@/components/Text";
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
  updatedDate: string;
  completed: {
    completedDate: string;
    mood: string;
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
                    I did this on: <b>{task.completed.completedDate}</b> for 1 hour.<br/>
                    it made you feel: <b>😊 {task.completed.mood}</b><br/>
                  </Text>
                  <Badge label="Mood Check" variant="sunshine" />

                  <Text as="h4">
                    🫵 completed {completedChecklistCount} out of {task.tasks.length} goals
                  </Text>

                  <TaskTable tasks={task.tasks} useIcons />
                  <Badge label={`${Math.floor((completedChecklistCount / task.tasks.length) * 100)}% complete!`} variant="sunshine" />

                  {task.completed.keepsakeUrl && (
                    <>
                      <br/>
                      <Text as="blockquote" tone="quote">
                        {task.completed.finalNotes}
                      </Text>

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