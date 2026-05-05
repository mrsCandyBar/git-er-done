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
import { TaskRecord } from "@/stores/taskStore";

export default function Task() {
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [selectedTaskCard, setSelectedTaskCard] = useState<detailCard | null>(null);
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
        if (!selectedTaskId) { return; }
        const task = await taskStore.getTaskById(selectedTaskId ?? "", {}, { forceRefresh: true });
        const foundTask: TaskRecord | null = task ? task : null;
        const taskDetailCard = foundTask ? toDetailCard(foundTask) : null;
        if (!foundTask) {
          if (isMounted) {
            setIsTaskNotFound(true);
          }
          return;
        }

        setSelectedTask(foundTask);
        setSelectedTaskCard(taskDetailCard);

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
    const url = updateTaskModal(method, task);
    router.push(url);
  };

  const updateTask = (state: string) => {
    if (selectedTaskId) {
      if (state === "start") {
        void taskStore.startTask(selectedTaskId).then((updatedTask) => {
        if (updatedTask) {
          setSelectedTask(updatedTask);
          setSelectedTaskCard(toDetailCard(updatedTask));
        }
      })
      } else {
        void taskStore.pauseTask(selectedTaskId).then((updatedTask) => {
          if (updatedTask) {
            setSelectedTask(updatedTask);
            setSelectedTaskCard(toDetailCard(updatedTask));
          }
        });
      }
    }
  };
  
  const updateTaskToggle = (selectedTask: TaskRecord, taskGoalIndex: number) => {
    if (selectedTask) {

      const updateTaskList = selectedTask.checklist?.map(
        (task, index) => 
          index === taskGoalIndex ? 
            { ...task, checked: !task.checked, updateDate: new Date() }
            : task);

      void taskStore.updateTask(selectedTask._id, { ...selectedTask, checklist: updateTaskList }).then((updatedTask) => {
          if (updatedTask) {
            setSelectedTask(updatedTask);
            setSelectedTaskCard(toDetailCard(updatedTask));
          }
        })
    };
  };

  useEffect(() => {
    void userStore.getCurrentProfile().then((profile) => {
      const completedTasks = profile ? countCompletedTasks(profile) : 0;

      // If user has no completed tasks, do not redirect 
      // and let them explore the task details page freely.

      if (!completedTasks || completedTasks === 0) { return; }

      // If user is a "friend" and has completed at least 1 task, 
      // redirect to profile to encourage them to update their status.

      if (profile && profile.status === "friend" && completedTasks === 1) { router.replace("/profile"); }
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

        {selectedTaskCard && (
          <>
            {selectedTaskCard.state === "waiting" && (
              <TaskWaitingPage
                task={selectedTaskCard}
                onStartTask={() => updateTask("start")}
                onOpenUpdateTask={(task) => openTaskModal("update", task)}
                onToggleTask={(taskGoalIndex) => selectedTask && updateTaskToggle(selectedTask, taskGoalIndex)}
              />
            )}

          {selectedTaskCard.state === "busy" && (
            <TaskBusyPage
                task={selectedTaskCard}
                onOpenCompleteTask={(task) => openTaskModal("complete", task)}
                onSetWaiting={() => updateTask("pause")}
                onToggleTask={(taskGoalIndex) => selectedTask && updateTaskToggle(selectedTask, taskGoalIndex)}
              />
            )}

          {selectedTaskCard.state === "complete" && (
            <TaskCompletePage
              task={selectedTaskCard}
            />
          )}
          </>
        )}
      </section>
    </div>
  );
}
