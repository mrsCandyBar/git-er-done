"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TaskBusyPage from "./TaskBusyPage";
import TaskCompletePage from "./TaskCompletePage";
import TaskWaitingPage from "./TaskWaitingPage";
import type { Column, Mood } from "./types";
import styles from "./page.module.scss";

type UpdatedTaskPayload = {
  id?: string;
  title?: string;
  description?: string;
  checklist?: string[];
};

type CompletedTaskPayload = {
  id?: string;
  startedAt?: string;
  completedAt?: string;
  mood?: Mood;
  finalNotes?: string;
  recur?: boolean;
  keepsakeUrl?: string;
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

  const formatUpdatedDate = () =>
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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

  const startTask = (columnId: string) => {
    const updatedAt = formatUpdatedDate();

    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        return {
          ...column,
          status: "busy",
          updatedAt,
        };
      })
    );
  };

  const toggleTaskCheck = (columnId: string, taskIndex: number) => {
    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        return {
          ...column,
          tasks: column.tasks.map((task, existingTaskIndex) => {
            if (existingTaskIndex !== taskIndex) {
              return task;
            }

            return {
              ...task,
              checked: !task.checked,
            };
          }),
        };
      })
    );
  };

  const openUpdateTask = (column: Column) => {
    const taskPayload = {
      id: column.id,
      title: column.title,
      description: column.description,
      checklist: column.tasks.map((task) => task.label),
    };
    const params = new URLSearchParams({ task: JSON.stringify(taskPayload) });
    router.push(`/tasks/update-task?${params.toString()}`);
  };

  const openCompleteTask = (column: Column) => {
    const completionPayload = {
      id: column.id,
      startedAt: column.updatedAt,
    };
    const params = new URLSearchParams({ task: JSON.stringify(completionPayload) });
    router.push(`/tasks/complete-task?${params.toString()}`);
  };

  useEffect(() => {
    const shouldMarkComplete = searchParams.get("status") === "complete";
    const rawUpdatedTask = searchParams.get("updatedTask");
    const rawCompletedTask = searchParams.get("completedTask");

    let updatedTask: UpdatedTaskPayload | null = null;
    let completedTask: CompletedTaskPayload | null = null;

    if (rawUpdatedTask) {
      try {
        updatedTask = JSON.parse(rawUpdatedTask) as UpdatedTaskPayload;
      } catch {
        updatedTask = null;
      }
    }

    if (rawCompletedTask) {
      try {
        completedTask = JSON.parse(rawCompletedTask) as CompletedTaskPayload;
      } catch {
        completedTask = null;
      }
    }

    if (!shouldMarkComplete && !updatedTask && !completedTask) {
      return;
    }

    setColumns((prev) =>
      prev.map((column, index) => {
        const matchesUpdatedTask = updatedTask && (updatedTask.id ? column.id === updatedTask.id : index === 0);
        const matchesCompletedTask = completedTask && (completedTask.id ? column.id === completedTask.id : index === 0);

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
          updatedAt: matchesCompletedTask && completedTask?.startedAt ? completedTask.startedAt : column.updatedAt,
          completedAt: matchesCompletedTask && completedTask?.completedAt ? completedTask.completedAt : column.completedAt,
          mood: matchesCompletedTask && completedTask?.mood ? completedTask.mood : column.mood,
          finalNote: matchesCompletedTask && completedTask?.finalNotes ? completedTask.finalNotes : column.finalNote,
          recur: matchesCompletedTask ? Boolean(completedTask?.recur) : column.recur,
          keepsakeUrl: matchesCompletedTask && completedTask?.keepsakeUrl ? completedTask.keepsakeUrl : column.keepsakeUrl,
          status: shouldMarkComplete || matchesCompletedTask ? "complete" : column.status,
        };
      })
    );

    router.replace("/task");
  }, [searchParams, router]);

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {columns.map((column, index) => {
          if (column.status === "waiting") {
            return (
              <TaskWaitingPage
                key={column.id}
                column={column}
                isSecondary={index !== 0}
                onStartTask={startTask}
                onOpenUpdateTask={openUpdateTask}
                onToggleTask={toggleTaskCheck}
              />
            );
          }

          if (column.status === "busy") {
            return (
              <TaskBusyPage
                key={column.id}
                column={column}
                isSecondary={index !== 0}
                onOpenCompleteTask={openCompleteTask}
                onSetWaiting={(columnId) => setColumnStatus(columnId, "waiting")}
                onToggleTask={toggleTaskCheck}
              />
            );
          }

          return (
            <TaskCompletePage
              key={column.id}
              column={column}
              isSecondary={index !== 0}
            />
          );
        })}
      </section>
    </div>
  );
}
