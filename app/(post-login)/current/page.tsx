"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import PostLoginCard from "../../../components/PostLoginCard";
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
};

const initialColumns: Column[] = [
  {
    id: "dance-class-for-beginners",
    eyebrow: "FUN",
    icon: "💃",
    title: "Dance Class for Beginners",
    description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun and learn some new moves. Whether you're a seasoned dancer or just starting out, our experienced instructors will guide you through a variety of dance styles, from salsa to hip-hop. Join us for a lively and energetic session that will leave you feeling confident on the dance floor!",
    tasks: [
      { label: "Book an appointment", checked: false },
      { label: "Make arrangements for alternative transportation", checked: true },
      { label: "Take a picture for memory", checked: true },
    ],
  }
];

export default function Current() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const router = useRouter();

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {columns.map((col, i) => (
          <PostLoginCard
            key={col.id}
            className={i === 0 ? "" : styles.secondary}
            eyebrow={<Text as="h4">{col.eyebrow}</Text>}
            icon={col.icon}
            title={<Text as="h2">{col.title}</Text>}
            description={<Text as="p">{col.description}</Text>}
            actions={(
              <>
                <Button
                  variant="filled"
                  disabled={!col.tasks.every((task) => Boolean(task.checked))}
                  onClick={() => router.push("/profile")}
                >
                  We&apos;ve done it! 🚀
                </Button>
                <Button href="/dashboard" variant="ghost">
                  Raincheck?
                </Button>
              </>
            )}
          >
            <br/>
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
          </PostLoginCard>
        ))}
      </section>
    </div>
  );
}
