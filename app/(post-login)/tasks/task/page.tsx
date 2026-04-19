"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Text } from "@/components/index";
import TaskBusyPage from "./state/busy";
import TaskCompletePage from "./state/complete";
import TaskWaitingPage from "./state/waiting";
import { toDetailCard, detailCard, countCompletedTasks, updateTaskModal } from "@/models/task";
import { getPropFromUrl } from "@/utilities/helper";
import { taskStore, userStore } from "../../../../stores";
import styles from "./page.module.scss";

export default function Task() {
  const [selectedTask, setSelectedTask] = useState<detailCard | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskNotFound, setIsTaskNotFound] = useState(false);
  const router = useRouter();

  // Rewrite to use id as a param
  ///////////////////////////////

  useEffect(() => {
    setSelectedTaskId(getPropFromUrl("id") || null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const task = await taskStore.getTaskById(selectedTaskId ?? "", {}, { forceRefresh: true });
        const foundTask: detailCard | null = task ? toDetailCard(task) : null;
        if (!foundTask) {
          if (isMounted) {
            setIsTaskNotFound(true);
          }
          return;
        }

        setSelectedTask(foundTask);

      } catch {
        if (isMounted) {
          setIsTaskNotFound(false);
        }
      }
    }

    loadTasks();
    return () => { isMounted = false; };
  }, [selectedTaskId]);

  

  const openTaskModal = (method: string, task: detailCard) => {
    const { taskPayload, url } = updateTaskModal(method, task);
    router.push(url);
  };

  const updateTask = (selectedTaskId: string, payload: any) => {
    void taskStore.updateTask(selectedTaskId, payload).then((updatedTask) => {
      if (updatedTask) {
        setSelectedTask(toDetailCard(updatedTask));
      }
    })
  };
  
  const updateTaskToggle = (selectedTask: detailCard, taskGoalIndex: number) => {
    const updateTaskList = selectedTask.tasks.map(
      (task, index) => 
        index === taskGoalIndex ? 
          { ...task, checked: !task.checked } 
          : task);

    void taskStore.updateTask(
      selectedTask.id, { ...selectedTask, tasks: updateTaskList }).then((updatedTask) => {
        if (updatedTask) {
          setSelectedTask(toDetailCard(updatedTask));
        }
      })
  };

  useEffect(() => {
    void userStore.getCurrentProfile().then((profile) => {
      const completedTasks = countCompletedTasks(profile);

      // If user has no completed tasks, do not redirect 
      // and let them explore the task details page freely.

      if (!completedTasks || completedTasks === 0) { return; }

      // If user is a "friend" and has completed at least 1 task, 
      // redirect to profile to encourage them to update their status.

      if (profile.status === "friend" && completedTasks === 1) { router.replace("/profile"); }
    });
  }, [router]);

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

        {selectedTask && (
          <>
            {selectedTask.status === "waiting" && (
              <TaskWaitingPage
                task={selectedTask}
                onOpenUpdateTask={(task) => openTaskModal("update", task)}
                onUpdateTask={(task) => updateTask(task.id, { ...task, status: "busy" })}
                onToggleTask={(taskGoalIndex) => updateTaskToggle(selectedTask, taskGoalIndex)}
              />
            )}

          {selectedTask.status === "busy" && (
            <TaskBusyPage
                task={selectedTask}
                onOpenCompleteTask={(task) => openTaskModal("complete", task)}
                onSetWaiting={(task) => updateTask(task.id, { ...task, status: "waiting" })}
                onToggleTask={(taskGoalIndex) => updateTaskToggle(selectedTask, taskGoalIndex)}
              />
            )}

          {selectedTask.status === "complete" && (
            <TaskCompletePage
              task={selectedTask}
            />
          )}
          </>
        )}
      </section>
    </div>
  );
}
