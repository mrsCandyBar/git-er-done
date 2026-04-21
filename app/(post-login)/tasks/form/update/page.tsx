"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, InfoChip, Modal, Text } from "@/components/index";
import { buildTaskForm, parseTaskPayload, UpdateTaskPayload } from "@/models/task";
import { closeModal } from "@/utilities/helper";
import { taskStore } from "../../../../../stores";
import styles from "./page.module.scss";


function UpdateTaskPageContent() {
  const router = useRouter();
  const selectedTask = taskStore.getSelectedTask();
  const payload = selectedTask ? (selectedTask as UpdateTaskPayload) : null;


  // Use local state for 
  // checklist management 
  // within the form

      const [checklistEnabled, setChecklistEnabled] = useState(Boolean(payload?.checklist?.length));
      const [checklistDraft, setChecklistDraft] = useState("");
      const [checklist, setChecklist] = useState<any[]>(payload?.checklist ?? []);

      useEffect(() => {
        setChecklist(payload?.checklist ?? []);
        setChecklistEnabled(Boolean(payload?.checklist?.length));
      }, [payload]);

      const fields = buildTaskForm(payload);

      const addChecklistItem = () => {
        const nextItem = checklistDraft.trim();
        if (!nextItem) return; 
        setChecklist((prev) => [...prev, { label: nextItem, checked: false }]);
        setChecklistDraft("");
      };

      const removeChecklistItem = (indexToRemove: number) => {
        setChecklist((prev) => prev.filter((_, index) => index !== indexToRemove));
      };


  // Handle form submission
  /////////////////////////

  const handleSubmit = async (formData: Record<string, FormDataEntryValue>) => {
    if (!payload?.id) return;
    
    const payloadData = parseTaskPayload(payload, formData, checklist);
    if (!payloadData) return;
    if (!checklistEnabled && checklist.length > 0) {
      payloadData.checklist = [];
    }

    try {
      await taskStore.updateTask(payload.id, payloadData);
      router.push("/tasks/task?id=" + payload.id);
    } catch {}
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={() => closeModal(router)} 
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
                  <li key={`${item.label}-${index}`} className={styles.checklistItem}>
                    <InfoChip label={item.label} variant="outline" onClose={() => removeChecklistItem(index)} />
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
