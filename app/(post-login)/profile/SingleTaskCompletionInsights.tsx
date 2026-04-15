import Button from "@/components/Button";
import Text from "@/components/Text";
import styles from "./page.module.scss";

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
      <Text as="h3" align="center" fullWidth>
        Your first completed task milestone
      </Text>
      <div className={styles.insightRow}>
        <div className={styles.insightBox}>
          <Text as="h1" align="center" fullWidth>{task.icon}</Text>
          <Text as="h4" align="center" fullWidth>{task.title}</Text>
          <Text as="p" tone="secondary">{task.description}</Text>
        </div>
        <div className={styles.insightBox}>
          <Text as="p" tone="secondary">
            Category: <b>{task.category}</b><br/>
            Status: <b>complete</b><br/>
            Completed: <b>{task.completed.completedDate}</b>
          </Text>
          <Text as="p" tone="secondary">
            Checklist done: <b>{completedChecklistCount}/{task.tasks.length}</b><br/>
            Mood: <b>{task.completed.mood}</b>
          </Text>
        </div>
      </div>

      <Text as="h4" align="center" fullWidth>What you completed</Text>
      <div className={styles.insightRow}>
        <div className={styles.insightBox}>
          <Text as="p" tone="secondary">
            {task.tasks.map((item) => `${item.checked ? "[x]" : "[ ]"} ${item.label}`).join("\n")}
          </Text>
        </div>
        <div className={styles.insightBox}>
          <Text as="p" tone="secondary">
            Started: <b>{task.startedDate}</b><br/>
            Last updated: <b>{task.updatedDate}</b><br/>
            Recurs: <b>{task.completed.recur ? "Yes" : "No"}</b>
          </Text>
          {task.completed.finalNotes && (
            <Text as="p" tone="secondary">
              <b>Final notes:</b> {task.completed.finalNotes}
            </Text>
          )}
          {task.completed.keepsakeUrl && (
            <Button href={task.completed.keepsakeUrl} target="_blank" rel="noreferrer noopener" variant="outline">
              Open keepsake
            </Button>
          )}
        </div>
      </div>

      <br />
      <br />
    </>
  );
}