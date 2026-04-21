"use client";

import { useState } from "react";
import { Button, Card, ConfettiButton, Form, InfoChip, Modal, Text, ToastRegion } from "@/components/index";
import { FormFieldConfig } from "@/components/Form";
import type { ToastItem } from "@/components/Toast/useToast";
import styles from "../page.module.scss";

export type CreateTaskSubmitIntent = "save" | "saveAndMakeAnother";

export type CreateTaskSubmitPayload = {
  formData: Record<string, FormDataEntryValue>;
  checklist: string[];
  submitIntent: CreateTaskSubmitIntent;
};

export type CreateTaskSubmitResult = "reset" | "noop";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fields: FormFieldConfig[];
  onSubmit: (payload: CreateTaskSubmitPayload) => CreateTaskSubmitResult | Promise<CreateTaskSubmitResult>;
  footnote?: string;
  isTaskCreationBlocked: boolean;
  canCreateMultipleTasks: boolean;
  createdTaskCount: number;
  maxTasksAllowed: number;
  isFinalAllowedCreate: boolean;
  toasts: ToastItem[];
  onDismissToast: (id: string) => void;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  fields,
  onSubmit,
  footnote,
  isTaskCreationBlocked,
  canCreateMultipleTasks,
  createdTaskCount,
  maxTasksAllowed,
  isFinalAllowedCreate,
  toasts,
  onDismissToast,
}: CreateTaskModalProps) {
  const [formVersion, setFormVersion] = useState(0);
  const [submitIntent, setSubmitIntent] = useState<CreateTaskSubmitIntent>("save");
  const [checklistEnabled, setChecklistEnabled] = useState(false);
  const [checklistDraft, setChecklistDraft] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);

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
    const result = await onSubmit({
      formData,
      checklist,
      submitIntent,
    });

    if (result !== "reset") {
      return;
    }

    setSubmitIntent("save");
    setChecklistEnabled(false);
    setChecklistDraft("");
    setChecklist([]);
    setFormVersion((prev) => prev + 1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showFooterCloseButton={false}
      title={isTaskCreationBlocked ? "A moment to reflect 🚞" : "Embark on a new quest 🚞"}
    >
      <Card bare minHeight={false}>
        {isTaskCreationBlocked ? (
            <>
                <Text as="p" tone="secondary" fullWidth>
                    You have accomplished many quests with us, and we are so proud of you!
                </Text>

                <Text as="h1" tone="secondary" fullWidth>
                    <big>💐🤗😽🥹</big>
                </Text>

                <Text as="p" tone="secondary" fullWidth>
                    To keep the magic alive, we encourage you to focus on <br/>
                    your current quests and make them truly epic.
                </Text>
                <Text as="p" tone="secondary" fullWidth>
                    In the meantime, feel free to explore your existing quests, <br/>
                    update their details, or reflect on your journey so far.
                </Text>

                <br/>
                <Text as="h1" tone="secondary" fullWidth>
                    <big>🌼🐎🚞</big>
                </Text>
                <Text as="p" tone="secondary" fullWidth>
                    We can&apos;t wait to embark on more adventures together!
                </Text>
                <Button>
                    Sign Up Today, Go Brioh!
                </Button>
            </>
        ) : (

            <Form
            key={formVersion}
            fields={fields}
            onSubmit={handleSubmit}
            footnote={!checklistEnabled ? footnote : undefined}
            renderSubmitButton={({ disabled }) => (
                <div className={styles.actions}>
                <Button
                    type="submit"
                    variant={canCreateMultipleTasks ? "outline" : "filled"}
                    disabled={disabled || isTaskCreationBlocked}
                    onClick={() => setSubmitIntent("save")}
                >
                    Save adventure! 💾
                </Button>
                {canCreateMultipleTasks && createdTaskCount < maxTasksAllowed && (
                    isFinalAllowedCreate ? (
                    <ConfettiButton
                        type="submit"
                        label="Save and make another! 😄"
                        disabled={disabled || isTaskCreationBlocked}
                        onClick={() => setSubmitIntent("saveAndMakeAnother")}
                        burstPattern="finale"
                        burstCount={2}
                    />
                    ) : (
                    <Button
                        type="submit"
                        variant="filled"
                        disabled={disabled || isTaskCreationBlocked}
                        onClick={() => setSubmitIntent("saveAndMakeAnother")}
                    >
                        Save and make another! 😄
                    </Button>
                    )
                )}
                </div>
            )}
            >
            <div className={styles.fieldGroup}>
                {!checklistEnabled && <Text as="p" fullWidth>This next step is <b><u>optional</u></b>.</Text>}
                <Text as="p" fullWidth><input
                type="checkbox"
                checked={checklistEnabled}
                onChange={(event) => setChecklistEnabled(event.target.checked)}
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
                        <li key={`checklistItem_${index}`} className={styles.checklistItem}>
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

        )}
      </Card>
      <ToastRegion toasts={toasts} onDismiss={onDismissToast} />
    </Modal>
  );
}
