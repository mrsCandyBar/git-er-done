"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, TaskTable, Text } from "@/components/index";
import type { detailCard } from "@/models/task";
import { badgesStore, type BadgeRecord } from "@/stores/badgesStore";
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
  const [startedBadge, setStartedBadge] = useState<BadgeRecord | null>(null);
  const badgeId = task.badges?.started?.badgeId;

  useEffect(() => {
    if (badgeId) {
      badgesStore.getBadgeById(badgeId).then((badge) => {
        setStartedBadge(badge ?? null);
      });
    }
  }, [badgeId]);
  return (
    <Card
      eyebrow={<Text as="h4">{task.eyebrow}</Text>}
      icon={task.icon}
      title={<Text as="h2" fullWidth>{task.title}</Text>}
      description={<Text as="p">{task.description}</Text>}
      actions={(
        <>
          <div className={styles.stickerStackFloat}>
            {badgeId && startedBadge && startedBadge.physicalTrait && (
              <Badge
                variant={badgeId}
                icon={startedBadge.physicalTrait.icon}
                label={startedBadge.physicalTrait.label}
                subtitle={startedBadge.physicalTrait.subtitle}
                color={startedBadge.physicalTrait.color}
              />
            )}
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
