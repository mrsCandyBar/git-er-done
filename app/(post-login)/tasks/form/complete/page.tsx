"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, ConfettiButton, Form, Modal } from "@/components/index";
import { FormFieldConfig } from "@/components/Form";
import { countCompletedTasks } from "@/models/task";
import { buildTaskCompleteForm, parseCompleteTaskPayload } from "@/models/task";
import { getPropFromUrl, closeModal } from "@/utilities/helper";
import { taskStore, userStore } from "../../../../../stores";
import styles from "./page.module.scss";

function CompleteTaskPageContent() {
  const router = useRouter();
  const taskId = getPropFromUrl("id");
  const [recur, setRecur] = useState(false);

  const fields: FormFieldConfig[] = buildTaskCompleteForm({});
  const handleSubmit = async (formData: Record<string, FormDataEntryValue>) => {
    if (!taskId) return;


    // Parse and validate the form data,
    // then build the payload for completing the task.

    const payload = parseCompleteTaskPayload({ id: taskId }, formData, recur);
    if (!payload) {
      router.push("/tasks/task?id=not-found");
      return;
    }

    try {
      await taskStore.completeTask(taskId, payload);
    } catch {
      router.push("/tasks/task?id=not-found");
      return;
    }


    // After marking the task as complete, 
    // check if we need to redirect the user view
    // based on completed tasks count.

    let shouldRedirectToProfile = false;
    try {

      const profile = await userStore.getCurrentProfile();
      if (profile.status === "friend") {
        shouldRedirectToProfile = true;
      }
      
      
      // After completing this task, 
      // check if we need to update the user's profile status 
      // based on completed tasks count.

      if (profile.status === "friend_new") {
        const completeCount = countCompletedTasks(profile);
        if (completeCount >= 4) {
          const updatedProfile = {
            status: "friend_dear" as const,
            updatedDate: new Date().toISOString().slice(0, 10),
          };

          await userStore.updateCurrentProfile(updatedProfile);
          userStore.setSelectedUser({ ...profile, ...updatedProfile }, "me");
          shouldRedirectToProfile = true;
        }
      }

      if (shouldRedirectToProfile) {
        router.push("/profile");
        return;
      }
      router.push("/tasks/task?id=" + taskId);

    } catch {}
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => closeModal(router)} 
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
