"use client";

import { Badge, Button, Card, TaskTable, Text } from "@/components/index";
import type { detailCard } from "@/models/task";
import styles from "../page.module.scss";

type TaskBusyPageProps = {
  task: detailCard;
  onOpenCompleteTask: (task: any) => void;
  onSetWaiting: (task: detailCard) => void;
  onToggleTask: (taskIndex: number) => void;
};

export default function TaskBusyPage({
  task,
  onOpenCompleteTask,
  onSetWaiting,
  onToggleTask,
}: TaskBusyPageProps) {
  return (
    <Card
      eyebrow={<Text as="h4">{task.eyebrow}</Text>}
      icon={task.icon}
      title={<Text as="h2" fullWidth>{task.title}</Text>}
      description={<Text as="p">{task.description}</Text>}
      actions={(
        <>
          <div className={styles.stickerStackFloat}>
            {/* Example badges, replace with dynamic badges based on task completion details 
            <Badge label="You got this" variant="sunshine" />*/}
          </div>
          <Button variant="filled" onClick={() => onOpenCompleteTask(task)}>
            I've done it! 💪
          </Button>
          <Button variant="ghost" onClick={() => onSetWaiting(task)}>
            Raincheck? Let's return to the roadmap
          </Button>
          <br/>
        </>
      )}
    >
      {task.checklist && task.checklist.length > 0 && (
        <>
          <br/>
          <Text as="h3" fullWidth>Guides: make it memorable</Text>
          <TaskTable
            tasks={task.checklist}
            showCheckbox
            taskHeader="Task"
            onToggleTask={(taskIndex) => onToggleTask(taskIndex)}
          />
          <br/>
        </>
      )}
    </Card>
  );
}
