"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Text } from "@/components/index";
import type { detailCard } from "@/models/task";
import { badgesStore, type BadgeRecord } from "@/stores/badgesStore";
import styles from "../page.module.scss";
import moment from "moment";

type TaskCompletePageProps = {
  task: detailCard;
};

export default function TaskCompletePage({ task }: TaskCompletePageProps) {
  const [startedBadge, setStartedBadge] = useState<BadgeRecord | null>(null);
  const [completedBadge, setCompletedBadge] = useState<BadgeRecord | null>(null);
  const [recurBadge, setRecurBadge] = useState<BadgeRecord | null>(null);
  const startedBadgeId = task.badges?.started?.badgeId;
  const completedBadgeId = task.badges?.completed?.badgeId;
  const recurBadgeId = task.badges?.recur?.badgeId;

  useEffect(() => {
    if (startedBadgeId) {
      badgesStore.getBadgeById(startedBadgeId).then((badge) => {
        setStartedBadge(badge ?? null);
      });
    }
    if (completedBadgeId) {
      badgesStore.getBadgeById(completedBadgeId).then((badge) => {
        setCompletedBadge(badge ?? null);
      });
    }
    if (recurBadgeId) {
      badgesStore.getBadgeById(recurBadgeId).then((badge) => {
        setRecurBadge(badge ?? null);
      });
    }
  }, [startedBadgeId, completedBadgeId, recurBadgeId]);

  return (
    task.completed && (
      <Card
        eyebrow={<Text as="h4">{task.eyebrow}</Text>}
        icon={task.icon}
        title={<Text as="h2" fullWidth>{task.title}</Text>}
        description={<Text as="p">{task.description}</Text>}
        actions={(
          <>
            <div className={styles.stickerStackFloat}>
              {startedBadge && startedBadge.physicalTrait && (
                <Badge
                  variant={startedBadgeId}
                  icon={startedBadge.physicalTrait.icon}
                  label={startedBadge.physicalTrait.label}
                  subtitle={startedBadge.physicalTrait.subtitle}
                  color={startedBadge.physicalTrait.color}
                />
              )}
              {completedBadgeId && completedBadge && completedBadge.physicalTrait && (
                <Badge
                  variant={completedBadgeId}
                  icon={completedBadge.physicalTrait.icon}
                  label={completedBadge.physicalTrait.label}
                  subtitle={completedBadge.physicalTrait.subtitle}
                  color={completedBadge.physicalTrait.color}
                />
              )}
              {recurBadgeId && recurBadge && recurBadge.physicalTrait && (
                <Badge
                  variant={recurBadgeId}
                  icon={recurBadge.physicalTrait.icon}
                  label={recurBadge.physicalTrait.label}
                  subtitle={recurBadge.physicalTrait.subtitle}
                  color={recurBadge.physicalTrait.color}
                />
              )}
            </div>
            <br/>
          </>
        )}
      >

      <br/>
      <div className={styles.completedMeta}>
        {task.completed && (
          <>
            {task.completed.completedDate && (
              <Text as="p" tone="secondary" className={styles.completedDate}>
                Completed {moment(task.completed.completedDate).format("MMMM Do, YYYY")}
              </Text>
            )}
            {task.completed.finalNotes && (
              <Text as="p" tone="quote" className={styles.finalNotes}>
                {task.completed.finalNotes}
              </Text>
            )}
            {task.completed.keepsakeUrl && (
                <>
                    <br/>
                    <Button href={task.completed.keepsakeUrl} target="_blank" rel="noreferrer noopener" variant="outline">
                        Relive the journey!
                    </Button>
                </>
            )}
          </>
        )}

        <br/>
        <Button href="/tasks" variant="filled">
          How about another one? 🎴
        </Button>
      </div>
    </Card>
    )
  );
}
