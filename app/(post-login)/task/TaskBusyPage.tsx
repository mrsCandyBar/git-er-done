import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
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
      <br/>
      <Text as="h3" fullWidth>Roadmap, do it for the plot! 🚒</Text>
      <ul className={styles.taskList}>
        {column.tasks.map((task, taskIndex) => (
          <li
            key={task.label}
            id={task.id}
            className={`${styles.taskItem}${task.id ? ` ${styles.taskTarget}` : ""}${task.checked ? ` ${styles.taskChecked}` : ""}`}
          >
            <label className={styles.taskLabel}>
              <input
                type="checkbox"
                checked={Boolean(task.checked)}
                onChange={() => onToggleTask(column.id, taskIndex)}
                className={styles.taskCheckbox}
              />
              <span>{task.label}</span>
            </label>
          </li>
        ))}
      </ul>
      <br/>
    </Card>
  );
}
