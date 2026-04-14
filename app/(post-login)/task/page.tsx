"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import styles from "./page.module.scss";

type Task = { id?: string; label: string; checked?: boolean };

type Column = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  tasks: Task[];
  status: "waiting" | "busy" | "complete";
};

type UpdatedTaskPayload = {
  id?: string;
  title?: string;
  description?: string;
  checklist?: string[];
};

const initialColumns: Column[] = [
  {
    id: "dance-class-for-beginners",
    eyebrow: "FUN",
    icon: "💃",
    status: "waiting", // "waiting" | "busy" | "complete"
    title: "Dance Class for Beginners",
    description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
    tasks: [
      { label: "Book an appointment", checked: true },
      { label: "Make arrangements for alternative transportation", checked: true },
      { label: "Take a picture for memory", checked: false },
    ],
  }
];

export default function Task() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const router = useRouter();
  const searchParams = useSearchParams();

  const setColumnStatus = (columnId: string, status: Column["status"]) => {
    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        return {
          ...column,
          status,
        };
      })
    );
  };

  useEffect(() => {
    const shouldMarkComplete = searchParams.get("status") === "complete";
    const rawUpdatedTask = searchParams.get("updatedTask");

    let updatedTask: UpdatedTaskPayload | null = null;

    if (rawUpdatedTask) {
      try {
        updatedTask = JSON.parse(rawUpdatedTask) as UpdatedTaskPayload;
      } catch {
        updatedTask = null;
      }
    }

    if (!shouldMarkComplete && !updatedTask) {
      return;
    }

    setColumns((prev) =>
      prev.map((column, index) => {
        const matchesUpdatedTask = updatedTask && (updatedTask.id ? column.id === updatedTask.id : index === 0);

        const nextTasks = matchesUpdatedTask && updatedTask?.checklist
          ? updatedTask.checklist.map((label) => {
              const existingTask = column.tasks.find((task) => task.label === label);
              return {
                label,
                checked: existingTask?.checked ?? false,
              };
            })
          : column.tasks;

        return {
          ...column,
          title: matchesUpdatedTask && updatedTask?.title ? updatedTask.title : column.title,
          description: matchesUpdatedTask && updatedTask?.description ? updatedTask.description : column.description,
          tasks: nextTasks,
          status: shouldMarkComplete ? "complete" : column.status,
        };
      })
    );

    router.replace("/task");
  }, [searchParams, router]);

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {columns.map((col, i) => (
          <Card
            key={col.id}
            className={i === 0 ? "" : styles.secondary}
            eyebrow={<Text as="h4">{col.eyebrow}</Text>}
            icon={col.icon}
            title={<Text as="h2" fullWidth>{col.title}</Text>}
            description={<Text as="p">{col.description}</Text>}
            actions={(
              <>
                {col.status === "waiting" && (
                  <>
                    <Button variant="filled" onClick={() => setColumnStatus(col.id, "busy")}>
                      Let's do this! 🚀
                    </Button>
                      <Button variant="ghost" onClick={() => {
                        const taskPayload = {
                          id: col.id,
                          title: col.title,
                          description: col.description,
                          checklist: col.tasks.map((task) => task.label),
                        };
                        const params = new URLSearchParams({ task: JSON.stringify(taskPayload) });
                        router.push(`/tasks/update-task?${params.toString()}`);
                      }}>
                        Hmmmm... let's rework this plot
                      </Button>
                  </>
                )}
                {col.status === "busy" && (
                  <>
                    <Button variant="filled" onClick={() => router.push("/tasks/complete-task")}>
                      I've done it! 💪
                    </Button>
                    <Button variant="ghost" onClick={() => setColumnStatus(col.id, "waiting")}>
                      Raincheck? Let's return to the roadmap
                    </Button>
                  </>
                )}
                {col.status === "complete" && (
                  <>
                    <Button href="/tasks" variant="ghost">
                      Great Questing! Wanna go on another adventure?
                    </Button>
                  </>
                )}
                <br/>
              </>
            )}
          >
            <br/>
            <Text as="h3" fullWidth>Roadmap, do it for the plot! 🚒</Text>
            <ul className={styles.taskList}>
              {col.tasks.map((task, taskIndex) => (
                <li
                  key={task.label}
                  id={task.id}
                  className={`${styles.taskItem}${task.id ? ` ${styles.taskTarget}` : ""}${task.checked ? ` ${styles.taskChecked}` : ""}`}
                >
                  <label className={styles.taskLabel}>
                    <input
                      type="checkbox"
                      checked={Boolean(task.checked)}
                      onChange={() => {
                        setColumns((prev) =>
                          prev.map((existingCol, colIndex) => {
                            if (colIndex !== i) {
                              return existingCol;
                            }

                            return {
                              ...existingCol,
                              tasks: existingCol.tasks.map((existingTask, existingTaskIndex) => {
                                if (existingTaskIndex !== taskIndex) {
                                  return existingTask;
                                }

                                return {
                                  ...existingTask,
                                  checked: !existingTask.checked,
                                };
                              }),
                            };
                          })
                        );
                      }}
                      className={styles.taskCheckbox}
                    />
                    <span>{task.label}</span>
                  </label>
                </li>
              ))}
            </ul>

            <br/>
          </Card>
        ))}
      </section>
    </div>
  );
}
