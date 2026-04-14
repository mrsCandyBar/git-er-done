"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import ConfettiButton from "../../../../components/ConfettiButton";
import Form, { FormFieldConfig } from "../../../../components/Form";
import InfoChip from "../../../../components/InfoChip";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";
import styles from "./page.module.scss";

type Category = "fun" | "new" | "quest";

type DraftTask = {
  finalNotes: string;
  keepsake?: string;
  recur: boolean;
  checklist: string[];
};

const categoryOptions: Array<{ value: Category; label: string }> = [
  { value: "new", label: "Something New" },
  { value: "fun", label: "Just for Fun" },
  { value: "quest", label: "Quest!" },
];

export default function CompleteTaskPage() {
  const router = useRouter();
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
      name: "finalNotes",
      label: "Final Notes",
      type: "textarea",
      hideLabel: true,
      placeholder: "(optional) Any last words about this adventure? How did it go? What was the highlight? Would you do it again?",
    },
    {
      name: "keepsake",
      label: (
        <Text as="p" align="center">
          A keepsake is a memento from your adventure.<br />
          We suggest adding a share post to revisit later.
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
    const finalNotes = String(formData.finalNotes ?? "").trim();
    const keepsake = String(formData.keepsake ?? "").trim();

    setSubmittedTask({
      finalNotes,
      keepsake: keepsake || undefined,
      recur,
      checklist,
    });

    router.push("/task?status=complete");
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
