import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import TaskTable from "../../../components/TaskTable";
import Text from "../../../components/Text";
import type { Column } from "./types";
import styles from "./page.module.scss";

type TaskBusyPageProps = {
  column: Column;
  isSecondary: boolean;
  onOpenCompleteTask: (column: Column) => void;
  onSetWaiting: (columnId: string) => void;
  onToggleTask: (columnId: string, taskIndex: number) => void;
};

export default function TaskBusyPage({
  column,
  isSecondary,
  onOpenCompleteTask,
  onSetWaiting,
  onToggleTask,
}: TaskBusyPageProps) {
  return (
    <Card
      className={isSecondary ? styles.secondary : ""}
      eyebrow={<Text as="h4">{column.eyebrow}</Text>}
      icon={column.icon}
      title={<Text as="h2" fullWidth>{column.title}</Text>}
      description={<Text as="p">{column.description}</Text>}
      actions={(
        <>
          <div className={styles.stickerStackFloat}>
            <Badge label="You got this" variant="sunshine" />
          </div>
          <Button variant="filled" onClick={() => onOpenCompleteTask(column)}>
            I've done it! 💪
          </Button>
          <Button variant="ghost" onClick={() => onSetWaiting(column.id)}>
            Raincheck? Let's return to the roadmap
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
            showCheckbox
            taskHeader="Task"
            onToggleTask={(taskIndex) => onToggleTask(column.id, taskIndex)}
          />
          <br/>
        </>
      )}
    </Card>
  );
}
