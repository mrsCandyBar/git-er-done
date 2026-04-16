"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormFieldConfig } from "../../../../components/Form";
import { useToastSystem } from "../../../../components/Toast/useToast";
import { USER_PROFILE_STORAGE_KEY } from "../../../../models/userProfile";
import CreateTaskModal, { CreateTaskSubmitPayload, CreateTaskSubmitResult } from "./CreateTaskModal";
import SlowDownModal from "./SlowDownModal";

const TASK_CREATE_COUNT_KEY = "brioh-task-create-count";
const MAX_TASKS_ALLOWED = 2;

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
  const [createdTaskCount, setCreatedTaskCount] = useState(0);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(true);
  const [isSlowDownOpen, setIsSlowDownOpen] = useState(false);
  const isFinalAllowedCreate = createdTaskCount === MAX_TASKS_ALLOWED - 1;

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as { status?: string };
        setCanCreateMultipleTasks(parsedProfile.status !== "friend");
      }

      const rawCreatedTaskCount = window.localStorage.getItem(TASK_CREATE_COUNT_KEY);
      const parsedCreatedTaskCount = Number.parseInt(rawCreatedTaskCount ?? "0", 10);
      setCreatedTaskCount(Number.isFinite(parsedCreatedTaskCount) ? parsedCreatedTaskCount : 0);
    } catch {
      // Ignore malformed local storage and continue with defaults.
    }
  }, []);

  const closeSlowDownModal = () => {
    setIsSlowDownOpen(false);
  };

  const closeModal = () => {
    setIsCreateTaskModalOpen(false);
    router.push("/tasks");
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

  const handleSubmit = ({ formData, checklist, submitIntent }: CreateTaskSubmitPayload): CreateTaskSubmitResult => {
    const title = String(formData.title ?? "").trim();
    const description = String(formData.description ?? "").trim();
    const rawCategory = String(formData.category ?? "fun");
    const category: Category = rawCategory === "new" || rawCategory === "quest" ? rawCategory : "fun";

    if (!title || !description) return "noop";

    const nextCreatedTaskCount = createdTaskCount + 1;
    setCreatedTaskCount(nextCreatedTaskCount);
    window.localStorage.setItem(TASK_CREATE_COUNT_KEY, String(nextCreatedTaskCount));

    if (submitIntent === "saveAndMakeAnother") {
      if (nextCreatedTaskCount >= MAX_TASKS_ALLOWED) {
        setCreatedTaskCount(1);
        window.localStorage.setItem(TASK_CREATE_COUNT_KEY, "1");
        setIsCreateTaskModalOpen(false);
        setIsSlowDownOpen(true);
        return "noop";
      }

      pushToast({ title: "Quest Created!", description: "Your quest has been successfully created.", variant: "success" });
      return "reset";
    }

    if (nextCreatedTaskCount >= MAX_TASKS_ALLOWED) {
      setCreatedTaskCount(1);
      window.localStorage.setItem(TASK_CREATE_COUNT_KEY, "1");
      setIsCreateTaskModalOpen(false);
      setIsSlowDownOpen(true);
      return "noop";
    }

    router.push("/task");
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
