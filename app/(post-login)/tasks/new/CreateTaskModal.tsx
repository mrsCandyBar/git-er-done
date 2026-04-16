"use client";

import { useState } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import ConfettiButton from "../../../../components/ConfettiButton";
import Form, { FormFieldConfig } from "../../../../components/Form";
import InfoChip from "../../../../components/InfoChip";
import Modal from "../../../../components/Modal";
import Text from "../../../../components/Text";
import ToastRegion from "../../../../components/Toast";
import type { ToastItem } from "../../../../components/Toast/useToast";
import styles from "./page.module.scss";

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
  onSubmit: (payload: CreateTaskSubmitPayload) => CreateTaskSubmitResult;
  footnote?: string;
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

  const handleSubmit = (formData: Record<string, FormDataEntryValue>) => {
    const result = onSubmit({
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
      title="Embark on a new quest 🚞"
    >
      <Card bare minHeight={false}>
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
                disabled={disabled}
                onClick={() => setSubmitIntent("save")}
              >
                Save adventure! 💾
              </Button>
              {canCreateMultipleTasks && createdTaskCount < maxTasksAllowed && (
                isFinalAllowedCreate ? (
                  <ConfettiButton
                    type="submit"
                    label="Save and make another! 😄"
                    disabled={disabled}
                    onClick={() => setSubmitIntent("saveAndMakeAnother")}
                    burstPattern="finale"
                    burstCount={2}
                  />
                ) : (
                  <Button
                    type="submit"
                    variant="filled"
                    disabled={disabled}
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
            {!checklistEnabled && <Text as="p" fullWidth>This next step is <b><u>optional</u></b></Text>}
            <Text as="p" fullWidth><input
              type="checkbox"
              checked={checklistEnabled}
              onChange={(event) => setChecklistEnabled(event.target.checked)}
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
      <ToastRegion toasts={toasts} onDismiss={onDismissToast} />
    </Modal>
  );
}
