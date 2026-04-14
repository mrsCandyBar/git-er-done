"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Form, { FormFieldConfig } from "../../../../components/Form";
import InfoChip from "../../../../components/InfoChip";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";
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
  const [checklistEnabled, setChecklistEnabled] = useState(false);
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
          fields={fields}
          submitLabel="Save this adventure! 💾"
          onSubmit={handleSubmit}
          footnote={!checklistEnabled ? "psssst, you can update your quest anytime 🦄" : undefined}
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
    </Modal>
  );
}
