"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../../../../../components/Button";
import Card from "../../../../../components/Card";
import Form, { FormFieldConfig } from "../../../../../components/Form";
import InfoChip from "../../../../../components/InfoChip";
import Modal from "../../../../../components/Modal";
import Text from "../../../../../components/Text";
import { taskStore } from "../../../../../stores";
import styles from "./page.module.scss";

type Category = "fun" | "new" | "quest";

type DraftTask = {
  title: string;
  description: string;
  category: Category;
  checklist: string[];
};

type UpdateTaskPayload = {
  id?: string;
  title?: string;
  description?: string;
  checklist?: string[];
};

const categoryOptions: Array<{ value: Category; label: string }> = [
  { value: "new", label: "Something New" },
  { value: "fun", label: "Just for Fun" },
  { value: "quest", label: "Quest!" },
];

function UpdateTaskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payload = useMemo<UpdateTaskPayload | null>(() => {
    const raw = searchParams.get("task");
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as UpdateTaskPayload;
      return parsed;
    } catch {
      return null;
    }
  }, [searchParams]);
  const [checklistEnabled, setChecklistEnabled] = useState(Boolean(payload?.checklist?.length));
  const [checklistDraft, setChecklistDraft] = useState("");
  const [checklist, setChecklist] = useState<string[]>(payload?.checklist ?? []);
  const [submittedTask, setSubmittedTask] = useState<DraftTask | null>(null);

  useEffect(() => {
    setChecklist(payload?.checklist ?? []);
    setChecklistEnabled(Boolean(payload?.checklist?.length));
  }, [payload]);

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
      defaultValue: "fun",
      required: true,
    },
    {
      name: "title",
      label: "Let's give your quest a title! 🏷️",
      hideLabel: true,
      type: "text",
      defaultValue: payload?.title ?? "",
      placeholder: "What do you want to do?",
      required: true,
    },
    {
      name: "description",
      label: "Describe your quest! 📝",
      hideLabel: true,
      type: "textarea",
      rows: 4,
      defaultValue: payload?.description ?? "",
      placeholder: "What will you do? Where? When?",
      required: true,
    },
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

  const handleSubmit = async (formData: Record<string, FormDataEntryValue>) => {
    const title = String(formData.title ?? "").trim();
    const description = String(formData.description ?? "").trim();
    const rawCategory = String(formData.category ?? "fun");
    const category: Category = rawCategory === "new" || rawCategory === "quest" ? rawCategory : "fun";

    if (!title || !description || !payload?.id) return;

    setSubmittedTask({
      title,
      description,
      category,
      checklist,
    });

    try {
      await taskStore.updateTask(payload.id, {
        title,
        description,
        category,
        tasks: checklist.map((label, index) => ({
          label,
          checked: false,
          id: `${payload.id}-${index}`,
        })),
      });
    } catch {
      // Keep UX simple; users can retry from the task page.
    }

    router.push("/tasks/task?#" + payload.id);
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={closeModal} 
      showFooterCloseButton={false}
      title="Hmmm... something's not quite right here... 🚞">
      <Card bare minHeight={false}>
        <Form
          fields={fields}
          submitLabel="Update our quest 🪅"
          onSubmit={handleSubmit}
        >

        <div className={styles.fieldGroup}>
          {!checklistEnabled && <Text as="p" fullWidth>This next step is <b><u>optional</u></b>.</Text>}
          <Text as="p" fullWidth><input
            type="checkbox"
            checked={checklistEnabled}
            onChange={(e) => setChecklistEnabled(e.target.checked)}
          />&nbsp;&nbsp;Add some guides?<br/></Text>
          {!checklistEnabled && <Text as="p" fullWidth tone="secondary">
              <small><br/>Break down your quest into smaller steps, <br/>or helpful tips to recall this quest later on ✨</small>
          </Text>}  
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

export default function UpdateTaskPage() {
  return (
    <Suspense fallback={null}>
      <UpdateTaskPageContent />
    </Suspense>
  );
}
