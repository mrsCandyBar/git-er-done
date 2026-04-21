"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToastSystem } from "@/components/Toast/useToast";
import { buildTaskForm, parseTaskPayload } from "@/models/task";
import { closeModal } from "@/utilities/helper";
import { taskStore, userStore } from "../../../../../stores";
import CreateTaskModal, { CreateTaskSubmitPayload, CreateTaskSubmitResult } from "./form/createTaskModal";
import SlowDownModal from "./_special/slowDownModal";

const MAX_TASKS_ALLOWED = 5;

export default function NewTaskPage() {
  const router = useRouter();
  const { toasts, pushToast, dismissToast } = useToastSystem();
  const [canCreateMultipleTasks, setCanCreateMultipleTasks] = useState(false);
  const [isTaskCreationBlocked, setIsTaskCreationBlocked] = useState(false);
  const [createdTaskCount, setCreatedTaskCount] = useState(0);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(true);
  const [isSlowDownOpen, setIsSlowDownOpen] = useState(false);
  const isFinalAllowedCreate = createdTaskCount === MAX_TASKS_ALLOWED - 1;

  useEffect(() => {
    let isMounted = true;

    async function loadState() {
      try {
        const [profile, tasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.listTasks(),
        ]);

        if (!isMounted) {
          return;
        }

        setCanCreateMultipleTasks(profile.status !== "friend" && profile.status !== "friend_close");
        setIsTaskCreationBlocked(profile.status === "friend_close");
        setCreatedTaskCount(tasks.length);
      } catch {
        if (isMounted) {
          setCanCreateMultipleTasks(false);
          setIsTaskCreationBlocked(false);
          setCreatedTaskCount(0);
        }
      }
    }

    loadState();

    return () => {
      isMounted = false;
    };
  }, []);


  // Handlers for managing the slow down flow 
  // when user creates too many tasks.

  const closeSlowDownModal = () => {
    setIsSlowDownOpen(false);
    router.push("/tasks");
  };

  const openSlowDownFlow = () => {
    setCreatedTaskCount(MAX_TASKS_ALLOWED);
    setIsCreateTaskModalOpen(false);
    setIsSlowDownOpen(true);
  };


  // Submit handler for creating a new task.
  //////////////////////////////////////////

  const fields = buildTaskForm({});
  const handleSubmit = async ({ formData, checklist, submitIntent }: CreateTaskSubmitPayload): Promise<CreateTaskSubmitResult> => {
    if (isTaskCreationBlocked) { return "noop"; }
    const payloadData = parseTaskPayload(undefined, formData, checklist);
    if (!payloadData) return "noop";

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await taskStore.createTask(payloadData);
      pushToast({ title: "Quest Created!", description: "Your quest has been successfully created.", variant: "success" });

    } catch {
      pushToast({ title: "Unable to create task", description: "Please try again in a moment.", variant: "error", });
      return "noop";
    }
    

    // After successfully creating a task,
    // check if we need to slow down the user from creating too many tasks,
    // or if we can just reset the form for another task creation.

    const nextCreatedTaskCount = createdTaskCount + 1;
    setCreatedTaskCount(nextCreatedTaskCount);
    if (nextCreatedTaskCount >= MAX_TASKS_ALLOWED) {
      openSlowDownFlow();
      return "noop";
    }

    if (submitIntent === "saveAndMakeAnother") {
      return "reset";
    } else if (submitIntent === "save") {
      router.push("/tasks");
      return "noop";
    }

    return "noop";
  };

  return (
    <>
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen && !isSlowDownOpen}
        onClose={() => closeModal(router)}
        fields={fields}
        onSubmit={handleSubmit}
        isTaskCreationBlocked={isTaskCreationBlocked}
        canCreateMultipleTasks={canCreateMultipleTasks}
        createdTaskCount={createdTaskCount}
        maxTasksAllowed={MAX_TASKS_ALLOWED}
        isFinalAllowedCreate={isFinalAllowedCreate}
        toasts={toasts}
        onDismissToast={dismissToast}
      />

      <SlowDownModal
        isOpen={isSlowDownOpen}
        onClose={closeSlowDownModal}
        maxTasksAllowed={MAX_TASKS_ALLOWED}
      />
    </>
  );
}
