import Button from "@/components/Button";
import TaskTable from "@/components/TaskTable";
import Text from "@/components/Text";
import styles from "./page.module.scss";
import Card from "../../../components/Card";
import Badge from "../../../components/Badge";

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
};

export default function SingleTaskCompletionInsights({ task }: SingleTaskCompletionInsightsProps) {
  const completedChecklistCount = task.tasks.filter((item) => item.checked).length;

  return (
    <>
      <br/>
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
            it made me feel: <b>😊 {task.completed.mood}</b><br/>
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

      <br/>
      <br />
    </>
  );
}