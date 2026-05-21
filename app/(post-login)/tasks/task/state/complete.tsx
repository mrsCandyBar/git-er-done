"use client";

import { Badge, Button, Card, Text } from "@/components/index";
import { getTaskMoodLabel } from "@/models/taskMood";
import type { detailCard } from "@/models/task";
import styles from "../page.module.scss";
import moment from "moment";

type TaskCompletePageProps = {
  task: detailCard;
};

export default function TaskCompletePage({ task }: TaskCompletePageProps) {
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
              {/* Example badges, replace with dynamic badges based on task completion details
              <Badge
                label="You did it!"
                subtitle={task.updatedDate ? `Started ${task.updatedDate}` : undefined}
                variant="mint"
              />
              {task.completed.mood && <Badge label={getTaskMoodLabel(task.completed.mood)} variant="coral" />}
              {task.completed.recur && (
                <>
                  <Badge label="We're doing this one again!" variant="sky" />
                  <Button href={`/tasks/recur/task?recurId=${task.recurId}`} variant="ghost" className={styles.recurProgressLink}>
                    Track your progress
                  </Button>
                </>
              )} */}
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
