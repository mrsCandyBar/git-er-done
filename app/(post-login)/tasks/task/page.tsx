"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Text } from "@/components/index";
import TaskBusyPage from "./state/busy";
import TaskCompletePage from "./state/complete";
import TaskWaitingPage from "./state/waiting";
import type { Column, Mood } from "./types";
import type { TaskRecord } from "../../../../stores/taskStore";
import { taskStore, userStore } from "../../../../stores";
import styles from "./page.module.scss";

const taskIconByCategory = {
  new: "🌱",
  fun: "🎉",
  quest: "🗺️",
} as const;

function toColumn(task: TaskRecord): Column {
  return {
    id: task.id,
    eyebrow: task.category.toUpperCase(),
    icon: taskIconByCategory[task.category],
    status: task.status,
    title: task.title,
    description: task.description,
    tasks: task.tasks,
    updatedAt: task.updatedAt,
    completedAt: task.completedAt,
    mood: task.mood,
    finalNote: task.finalNotes,
    recur: task.recur,
    keepsakeUrl: task.keepsakeUrl,
  };
}

export default function Task() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskNotFound, setIsTaskNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncSelectedTaskFromHash = () => {
      const hashValue = window.location.hash.replace(/^#/, "").trim();
      setSelectedTaskId(hashValue || null);
    };

    syncSelectedTaskFromHash();
    window.addEventListener("hashchange", syncSelectedTaskFromHash);

    return () => {
      window.removeEventListener("hashchange", syncSelectedTaskFromHash);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const tasks = await taskStore.listTasks();
        const mappedColumns = tasks.map(toColumn);

        if (selectedTaskId) {
          const hashSelectedColumn = mappedColumns.find((column) => column.id === selectedTaskId) ?? null;
          if (isMounted) {
            setIsTaskNotFound(!hashSelectedColumn);
            setColumns(hashSelectedColumn ? [hashSelectedColumn] : []);
          }
          return;
        }

        let resolvedColumn: Column | null = null;

        if (!resolvedColumn) {
          const cachedSelectedTask = taskStore.getSelectedTask();
          resolvedColumn = cachedSelectedTask ? toColumn(cachedSelectedTask) : null;
        }

        if (!resolvedColumn) {
          resolvedColumn = mappedColumns[0] ?? null;
        }

        if (isMounted) {
          setIsTaskNotFound(false);
          setColumns(resolvedColumn ? [resolvedColumn] : []);
        }
      } catch {
        if (isMounted) {
          setIsTaskNotFound(false);
          setColumns([]);
        }
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [selectedTaskId]);

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

    void taskStore.updateTask(columnId, { status }).catch(() => {
      // Keep optimistic local state if network update fails.
    });
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

    void taskStore.updateTask(columnId, { status: "busy", startedAt: new Date().toISOString() }).catch(() => {
      // Keep optimistic local state if network update fails.
    });
  };

  const toggleTaskCheck = (columnId: string, taskIndex: number) => {
    let nextTasks: Column["tasks"] = [];

    setColumns((prev) =>
      prev.map((column) => {
        if (column.id !== columnId) {
          return column;
        }

        nextTasks = column.tasks.map((task, existingTaskIndex) => {
          if (existingTaskIndex !== taskIndex) {
            return task;
          }

          return {
            ...task,
            checked: !task.checked,
          };
        });

        return {
          ...column,
          tasks: nextTasks,
        };
      })
    );

    void taskStore.updateTask(columnId, { tasks: nextTasks }).catch(() => {
      // Keep optimistic local state if network update fails.
    });
  };

  const openUpdateTask = (column: Column) => {
    const taskPayload = {
      id: column.id,
      title: column.title,
      description: column.description,
      checklist: column.tasks.map((task) => task.label),
    };
    router.push(`/tasks/form/update?id=${taskPayload.id}`);
  };

  const openCompleteTask = (column: Column) => {
    const completionPayload = {
      id: column.id,
      startedAt: column.updatedAt,
    };
    router.push(`/tasks/form/complete?id=${completionPayload.id}`);
  };

  useEffect(() => {
    const hasCompletedTask = columns.some((column) => column.status === "complete");
    if (!hasCompletedTask) {
      return;
    }

    void userStore.getCurrentProfile().then((profile) => {
      if (profile.status === "friend") {
        router.replace("/profile");
      }
    }).catch(() => {
      // Ignore profile fetch failures for this non-blocking redirect.
    });
  }, [columns, router]);

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {isTaskNotFound && (
          <Card
            title={<Text as="h2" fullWidth>Oh no, the quest is lost!</Text>}
            description={<Text as="p">We could not find the map 🗺️ <br/>Try another, we'll track this one down.</Text>}
            actions={(
              <>
                <br/>
                <Button href="/tasks" variant="filled">Back to quests</Button>
              </>
            )}
          />
        )}

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
