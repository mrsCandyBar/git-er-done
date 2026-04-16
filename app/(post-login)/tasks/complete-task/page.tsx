"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import ConfettiButton from "../../../../components/ConfettiButton";
import Form, { FormFieldConfig } from "../../../../components/Form";
import InfoChip from "../../../../components/InfoChip";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";
import { USER_PROFILE_STORAGE_KEY } from "../../../../models/userProfile";
import styles from "./page.module.scss";

type Mood = "love" | "happy" | "not-sure" | "confused" | "not-for-me";

type DraftTask = {
  mood: Mood;
  finalNotes: string;
  keepsake?: string;
  recur: boolean;
  checklist: string[];
};

type CompleteTaskPayload = {
  id?: string;
  startedAt?: string;
};

type StoredProfile = {
  status?: string;
};

const moodOptions: Array<{ value: Mood; label: string }> = [
  { value: "love", label: "😍 Love" },
  { value: "happy", label: "😊 Happy" },
  { value: "not-sure", label: "🤔 Not sure" },
  { value: "confused", label: "😵 Confused" },
  { value: "not-for-me", label: "🙅 Not for me" },
];

export default function CompleteTaskPage() {
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
  const [checklistDraft, setChecklistDraft] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
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
      options: moodOptions,
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

  const addChecklistItem = () => {
    const nextItem = checklistDraft.trim();
    if (!nextItem) return;
    setChecklist((prev) => [...prev, nextItem]);
    setChecklistDraft("");
  };

  const removeChecklistItem = (indexToRemove: number) => {
    setChecklist((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (formData: Record<string, FormDataEntryValue>) => {
    const rawMood = String(formData.mood ?? "").trim();
    const finalNotes = String(formData.finalNotes ?? "").trim();
    const keepsake = String(formData.keepsake ?? "").trim();
    const completedAt = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const mood: Mood =
      rawMood === "love" ||
      rawMood === "happy" ||
      rawMood === "not-sure" ||
      rawMood === "confused" ||
      rawMood === "not-for-me"
        ? rawMood
        : "happy";

    setSubmittedTask({
      mood,
      finalNotes,
      keepsake: keepsake || undefined,
      recur,
      checklist,
    });

    const completedTaskPayload = {
      id: payload?.id,
      startedAt: payload?.startedAt,
      completedAt,
      mood,
      finalNotes,
      recur,
      keepsakeUrl: keepsake || undefined,
    };
    const params = new URLSearchParams({ completedTask: JSON.stringify(completedTaskPayload) });

    let shouldRedirectToProfile = false;
    try {
      const rawProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (rawProfile) {
        const parsedProfile = JSON.parse(rawProfile) as StoredProfile;
        shouldRedirectToProfile = parsedProfile.status === "friend";
      }
    } catch {
      // Ignore malformed local storage and use default redirect.
    }

    if (shouldRedirectToProfile) {
      router.push("/profile");
      return;
    }

    router.push(`/task?${params.toString()}`);
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
