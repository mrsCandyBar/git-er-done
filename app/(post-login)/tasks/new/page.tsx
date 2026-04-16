"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldConfig } from "../../../../components/Form";
import { useToastSystem } from "../../../../components/Toast/useToast";
import { taskStore, userStore } from "../../../../stores";
import CreateTaskModal, { CreateTaskSubmitPayload, CreateTaskSubmitResult } from "./CreateTaskModal";
import SlowDownModal from "./SlowDownModal";

const MAX_TASKS_ALLOWED = 5;

type Category = "fun" | "new" | "quest";

const categoryOptions: Array<{ value: Category; label: string }> = [
  { value: "new", label: "Something New" },
  { value: "fun", label: "Just for Fun" },
  { value: "quest", label: "Quest!" },
];

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

  const closeSlowDownModal = () => {
    setIsSlowDownOpen(false);
    router.push("/tasks");
  };

  const closeModal = () => {
    setIsCreateTaskModalOpen(false);
    router.push("/tasks");
  };

  const openSlowDownFlow = () => {
    setCreatedTaskCount(MAX_TASKS_ALLOWED);
    setIsCreateTaskModalOpen(false);
    setIsSlowDownOpen(true);
  };

  const fields: FormFieldConfig[] = [
    {
      label: "Tag it!",
      name: "category",
      type: "radio",
      hideLabel: true,
      options: categoryOptions,
      required: true,
    },
    {
      name: "title",
      label: "Name it!",
      type: "text",
      hideLabel: true,
      placeholder: "What do you want to do?",
      required: true,
    },
    {
      name: "description",
      label: "Describe it!",
      type: "textarea",
      rows: 4,
      hideLabel: true,
      placeholder: "What will you do? Where? When?",
      required: true,
    }
  ];

  const handleSubmit = async ({ formData, checklist, submitIntent }: CreateTaskSubmitPayload): Promise<CreateTaskSubmitResult> => {
    if (isTaskCreationBlocked) {
      return "noop";
    }

    const title = String(formData.title ?? "").trim();
    const description = String(formData.description ?? "").trim();
    const rawCategory = String(formData.category ?? "fun");
    const category: Category = rawCategory === "new" || rawCategory === "quest" ? rawCategory : "fun";

    if (!title || !description) return "noop";

    try {
      await taskStore.createTask({
        category,
        title,
        description,
        tasks: checklist.map((label, index) => ({
          id: `${category}-${index}-${Date.now()}`,
          label,
          checked: false,
        })),
      });
    } catch {
      pushToast({
        title: "Unable to create task",
        description: "Please try again in a moment.",
        variant: "error",
      });
      return "noop";
    }

    const nextCreatedTaskCount = createdTaskCount + 1;
    setCreatedTaskCount(nextCreatedTaskCount);

    if (submitIntent === "saveAndMakeAnother") {
      if (nextCreatedTaskCount >= MAX_TASKS_ALLOWED) {
        openSlowDownFlow();
        return "noop";
      }

      pushToast({ title: "Quest Created!", description: "Your quest has been successfully created.", variant: "success" });
      return "reset";

    } else if (submitIntent === "save") {
      pushToast({ title: "Quest Created!", description: "Your quest has been successfully created.", variant: "success" });
      closeModal();
      return "noop";
    }

    if (nextCreatedTaskCount >= MAX_TASKS_ALLOWED) {
      openSlowDownFlow();
      return "noop";
    }

    return "noop";

  };

  return (
    <>
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen && !isSlowDownOpen}
        onClose={closeModal}
        fields={fields}
        onSubmit={handleSubmit}
        footnote={!canCreateMultipleTasks ? "psssst, you can update your quest anytime 🦄" : undefined}
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
