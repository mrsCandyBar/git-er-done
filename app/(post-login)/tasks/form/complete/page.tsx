"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, ConfettiButton, Form, Modal, Text } from "@/components/index";
import { FormFieldConfig } from "@/components/Form";
import { countCompletedTasks } from "@/models/task";
import { TASK_MOOD_OPTIONS, isTaskMood, type TaskMood } from "@/models/taskMood";
import { getPropFromUrl } from "@/utilities/helper";
import { taskStore, userStore } from "../../../../../stores";
import styles from "./page.module.scss";

function CompleteTaskPageContent() {
  const router = useRouter();
  const taskId = getPropFromUrl("id");
  const [recur, setRecur] = useState(false);

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
    const mood: TaskMood = isTaskMood(rawMood) ? rawMood : "happy";

    if (!taskId) {
      router.push("/tasks/task?id=not-found");
      return;
    }

    try {
      await taskStore.completeTask(taskId, {
        completedAt: new Date().toISOString(),
        mood,
        finalNotes,
        recur,
        keepsakeUrl: keepsake || undefined,
      });

    } catch {
      router.push("/tasks/task?id=not-found");
      return;
    }

    let shouldRedirectToProfile = false;
    try {

      // After completing a task, 
      // check if we need to update the user's profile status 
      // based on completed tasks count.

      const profile = await userStore.getCurrentProfile();
      if (profile.status === "friend_new") {
        const completeCount = countCompletedTasks(profile);
        const completeAfterSubmit = completeCount + 1;
        if (completeAfterSubmit >= 4) {
          const updatedProfile = {
            status: "friend_dear" as const,
            updatedDate: new Date().toISOString().slice(0, 10),
          };

          await userStore.updateCurrentProfile(updatedProfile);
          userStore.setSelectedUser({ ...profile, ...updatedProfile }, "me");
          shouldRedirectToProfile = true;
        }

        if (shouldRedirectToProfile) {
          router.push("/profile");
          return;
        }
      }

      router.push("/tasks/task?id=" + taskId);

    } catch {}
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
