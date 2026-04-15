import styles from "./TaskTable.module.scss";

export type TaskTableItem = {
  id?: string;
  label: string;
  checked?: boolean;
};

type TaskTableProps = {
  tasks: TaskTableItem[];
  onToggleTask?: (taskIndex: number) => void;
  showCheckbox?: boolean;
  useIcons?: boolean;
  taskHeader?: string;
  statusHeader?: string;
  completedLabel?: string;
  pendingLabel?: string;
  className?: string;
};

export default function TaskTable({
  tasks,
  onToggleTask,
  showCheckbox = false,
  useIcons = false,
  taskHeader = "Goal",
  statusHeader = "Status",
  completedLabel = "Completed",
  pendingLabel = "Pending",
  className,
}: TaskTableProps) {
  const tableClassName = className ? `${styles.table} ${className}` : styles.table;
  const resolvedCompletedLabel = useIcons ? "✔️" : completedLabel;
  const resolvedPendingLabel = useIcons ? "" : pendingLabel;

  return (
    <table className={tableClassName}>
      <thead>
        <tr>
          <th>{taskHeader}</th>
          <th>{statusHeader}</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, taskIndex) => {
          const isChecked = Boolean(task.checked);
          const checkedClassName = isChecked
            ? useIcons
              ? styles.iconCheckedRow
              : styles.checkedRow
            : useIcons
              ? styles.iconUnCheckedRow
              : "";
          const rowClassName = `${styles.row}${task.id ? ` ${styles.targetRow}` : ""}${checkedClassName ? ` ${checkedClassName}` : ""}`;
          const statusText = isChecked ? resolvedCompletedLabel : resolvedPendingLabel;

          return (
            <tr key={task.id ?? `${task.label}-${taskIndex}`} id={task.id} className={rowClassName}>
              <td className={styles.nameCell}>{task.label}</td>
              <td className={styles.statusCell}>
                {showCheckbox && onToggleTask ? (
                  <label className={styles.statusLabel}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleTask(taskIndex)}
                      className={styles.checkbox}
                    />
                    <span>{statusText}</span>
                  </label>
                ) : (
                  <span className={styles.statusText}>{statusText}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
