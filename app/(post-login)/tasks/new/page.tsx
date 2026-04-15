"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form, { FormFieldConfig } from "../../../../components/Form";
import InfoChip from "../../../../components/InfoChip";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";
import ToastRegion from "../../../../components/Toast";
import { useToastSystem } from "../../../../components/Toast/useToast";
import { USER_PROFILE_STORAGE_KEY } from "../../../../models/userProfile";
import styles from "./page.module.scss";

type Category = "fun" | "new" | "quest";

type DraftTask = {
  title: string;
  description: string;
  category: Category;
  checklist: string[];
};

const categoryOptions: Array<{ value: Category; label: string }> = [
  { value: "new", label: "Something New" },
  { value: "fun", label: "Just for Fun" },
  { value: "quest", label: "Quest!" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const { toasts, pushToast, dismissToast } = useToastSystem();
  const submitIntentRef = useRef<"save" | "saveAndMakeAnother">("save");
  const [formVersion, setFormVersion] = useState(0);
  const [checklistEnabled, setChecklistEnabled] = useState(false);
  const [checklistDraft, setChecklistDraft] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [submittedTask, setSubmittedTask] = useState<DraftTask | null>(null);
  const [isFriendClose, setIsFriendClose] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as { status?: string };
        setIsFriendClose(parsedProfile.status === "friend_close");
      }
    } catch {
      // Ignore malformed local storage and continue with defaults.
    }
  }, []);

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

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
    const title = String(formData.title ?? "").trim();
    const description = String(formData.description ?? "").trim();
    const rawCategory = String(formData.category ?? "fun");
    const category: Category = rawCategory === "new" || rawCategory === "quest" ? rawCategory : "fun";

    if (!title || !description) return;

    setSubmittedTask({
      title,
      description,
      category,
      checklist,
    });

    if (submitIntentRef.current === "saveAndMakeAnother") {
      submitIntentRef.current = "save";
      setChecklistEnabled(false);
      setChecklistDraft("");
      setChecklist([]);
      setFormVersion((prev) => prev + 1);
      pushToast({ title: "Quest Created!", description: "Your quest has been successfully created.", variant: "success" });
      return;
    }

    router.push("/task");
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={closeModal} 
      showFooterCloseButton={false}
      title="Embark on a new quest 🚞">
      <Card bare minHeight={false}>
        <Form
          key={formVersion}
          fields={fields}
          onSubmit={handleSubmit}
          footnote={!checklistEnabled && !isFriendClose ? "psssst, you can update your quest anytime 🦄" : undefined}
          renderSubmitButton={({ disabled }) => (
            <div className={styles.actions}>
              <Button
                type="submit"
                variant={isFriendClose ? "outline" : "filled"}
                disabled={disabled}
                onClick={() => {
                  submitIntentRef.current = "save";
                }}
              >
                Save adventure! 💾
              </Button>
              {isFriendClose && (
                <Button
                  type="submit"
                  variant="filled"
                  disabled={disabled}
                  onClick={() => {
                    submitIntentRef.current = "saveAndMakeAnother";
                  }}
                >
                  Save and make another! 😄
                </Button>
              )}
            </div>
          )}
        >

        <div className={styles.fieldGroup}>
          {!checklistEnabled && <Text as="p" fullWidth>This next step is <b><u>optional</u></b></Text>}
          <Text as="p" fullWidth><input
            type="checkbox"
            checked={checklistEnabled}
            onChange={(e) => setChecklistEnabled(e.target.checked)}
          />&nbsp;&nbsp;Add a roadmap?<br/></Text>
        </div>

        {checklistEnabled && (
          <div className={styles.fieldGroup}>
            {checklist.length > 0 && (

              <ul className={styles.checklistList}>
                {checklist.map((item, index) => (
                  <li key={`${item}-${index}`} className={styles.checklistItem}>
                    <InfoChip label={item} variant="outline" onClose={() => removeChecklistItem(index)} />
                  </li>
                ))}
              </ul>
            )}

            <br/>
            <div className={styles.checklistAddRow}>
              <input
                id="checklist-item"
                type="text"
                className={styles.checklistInput}
                placeholder="research, buy supplies, invite friends, etc..."
                value={checklistDraft}
                onChange={(event) => setChecklistDraft(event.target.value)}
              />
              <Button type="button" variant="filled" onClick={addChecklistItem}>
                ➕Add
              </Button>
            </div>
          </div>
        )}
        </Form>
      </Card>
      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
    </Modal>
  );
}
