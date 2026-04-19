"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, ConfettiButton, Form, Modal, Text } from "@/components/index";
import { FormFieldConfig } from "../../../../../components/Form";
import { TASK_MOOD_OPTIONS, isTaskMood, type TaskMood } from "../../../../../models/taskMood";
import { taskStore, userStore } from "../../../../../stores";
import styles from "./page.module.scss";

type DraftTask = {
  mood: TaskMood;
  finalNotes: string;
  keepsake?: string;
  recur: boolean;
  checklist: string[];
};

type CompleteTaskPayload = {
  id?: string;
  startedAt?: string;
};

function CompleteTaskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payload = useMemo<CompleteTaskPayload | null>(() => {
    const raw = searchParams.get("task");
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as CompleteTaskPayload;
    } catch {
      return null;
    }
  }, [searchParams]);
  const [recur, setRecur] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<DraftTask | null>(null);

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/tasks");
  };

  const fields: FormFieldConfig[] = [
    {
      name: "mood",
      label: (
        <Text as="span" align="center">
          How did this task make you feel?
        </Text>
      ),
      type: "radio",
      options: TASK_MOOD_OPTIONS,
      required: true,
    },
    {
      name: "finalNotes",
      label: (
        <Text as="span" align="center">
          Final Notes
        </Text>
      ),
      type: "textarea",
      hideLabel: true,
      placeholder: "(optional) Any last words about this adventure? How did it go? What was the highlight? Would you do it again?",
    },
    {
      name: "keepsake",
      label: (
        <Text as="span" align="center">
          Add a link to a post, photo, journal entry, or anything else that helps you remember the journey!
        </Text>
      ),
      type: "text",
      placeholder: "(optional) Paste a keepsake URL",
    }
  ];

  const handleSubmit = async (formData: Record<string, FormDataEntryValue>) => {
    const rawMood = String(formData.mood ?? "").trim();
    const finalNotes = String(formData.finalNotes ?? "").trim();
    const keepsake = String(formData.keepsake ?? "").trim();
    const completedAt = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const mood: TaskMood = isTaskMood(rawMood) ? rawMood : "happy";

    setSubmittedTask({
      mood,
      finalNotes,
      keepsake: keepsake || undefined,
      recur,
      checklist: [],
    });

    if (!payload?.id) {
      router.push("/tasks/task");
      return;
    }

    try {
      await taskStore.completeTask(payload.id, {
        completedAt: new Date().toISOString(),
        mood,
        finalNotes,
        recur,
        keepsakeUrl: keepsake || undefined,
      });
    } catch {
      router.push("/tasks/task");
      return;
    }

    let shouldRedirectToProfile = false;
    try {
      const parsedProfile = await userStore.getCurrentProfile();
        const completedTasksCount = Array.isArray(parsedProfile.achievements)
          ? parsedProfile.achievements.reduce((acc, achievement) => {
              const completed = achievement?.completed;
              const completedCount =
                (completed?.new?.length ?? 0) +
                (completed?.fun?.length ?? 0) +
                (completed?.quest?.length ?? 0);
              return acc + completedCount;
            }, 0)
          : 0;

        const completedTasksAfterSubmit = completedTasksCount + 1;
        if (completedTasksAfterSubmit >= 4 && parsedProfile.status === "friend_new") {
          const updatedProfile = {
            ...parsedProfile,
            status: "friend_dear" as const,
            updatedDate: new Date().toISOString().slice(0, 10),
          };

          await userStore.updateCurrentProfile({
            status: "friend_dear",
            updatedDate: updatedProfile.updatedDate,
          });
          userStore.setSelectedUser(updatedProfile, "me");
          shouldRedirectToProfile = true;
        }
    } catch {
      // Ignore profile update failures and continue default redirect.
    }

    if (shouldRedirectToProfile) {
      router.push("/profile");
      return;
    }

    router.push("/tasks/task");
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={closeModal} 
      showFooterCloseButton={false}
      title="Victory!!! 👑 You have emerged victorious!">
      <Card bare minHeight={false}>
        <Form
          fields={fields}
          showSubmitButton={false}
          requireValidUpdates={false}
          renderSubmitButton={({ disabled }) => (
            <div className={styles.submitRow}>
              <ConfettiButton type="submit" label="Completed, let's party! 🎉" disabled={disabled} />
            </div>
          )}
          onSubmit={handleSubmit}
        >
        <div className={styles.recurToggle}>
          <input
            id="recur"
            name="recur"
            type="checkbox"
            checked={recur}
            onChange={(event) => setRecur(event.target.checked)}
          />
          <label htmlFor="recur">Let's do this again!</label>
        </div>
        </Form>
      </Card>
    </Modal>
  );
}

export default function CompleteTaskPage() {
  return (
    <Suspense fallback={null}>
      <CompleteTaskPageContent />
    </Suspense>
  );
}
