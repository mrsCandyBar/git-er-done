import Card from "../../../components/Card";
import Button from "../../../components/Button";
import TaskTable from "../../../components/TaskTable";
import Text from "../../../components/Text";
import type { Column } from "./types";
import styles from "./page.module.scss";

type TaskWaitingPageProps = {
  column: Column;
  isSecondary: boolean;
  onStartTask: (columnId: string) => void;
  onOpenUpdateTask: (column: Column) => void;
  onToggleTask: (columnId: string, taskIndex: number) => void;
};

export default function TaskWaitingPage({
  column,
  isSecondary,
  onStartTask,
  onOpenUpdateTask,
  onToggleTask,
}: TaskWaitingPageProps) {
  return (
    <Card
      className={isSecondary ? styles.secondary : ""}
      eyebrow={<Text as="h4">{column.eyebrow}</Text>}
      icon={column.icon}
      title={<Text as="h2" fullWidth>{column.title}</Text>}
      description={<Text as="p">{column.description}</Text>}
      actions={(
        <>
          <Button variant="filled" onClick={() => onStartTask(column.id)}>
            Let's do this! 🚀
          </Button>
          <Button variant="ghost" onClick={() => onOpenUpdateTask(column)}>
            Hmmmm... let's rework this plot
          </Button>
          <br/>
        </>
      )}
    >
      {column.tasks.length > 0 && (
        <>
          <br/>
          <Text as="h3" fullWidth>Guides: make it memorable</Text>
          <TaskTable
            tasks={column.tasks}
            taskHeader="Task"
            onToggleTask={(taskIndex) => onToggleTask(column.id, taskIndex)}
          />
          <br/>
        </>
      )}
    </Card>
  );
}
