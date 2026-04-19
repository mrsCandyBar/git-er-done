import { Badge, Button, Card, Text } from "@/components/index";
import { getTaskMoodLabel } from "@/models/taskMood";
import type { detailCard } from "@/models/task";
import styles from "../page.module.scss";

type TaskCompletePageProps = {
  task: detailCard;
};

export default function TaskCompletePage({ task }: TaskCompletePageProps) {
  return (
    <Card
      eyebrow={<Text as="h4">{task.eyebrow}</Text>}
      icon={task.icon}
      title={<Text as="h2" fullWidth>{task.title}</Text>}
      description={<Text as="p">{task.description}</Text>}
      actions={(
        <>
          <div className={styles.stickerStackFloat}>
            <Badge
              label="You did it!"
              subtitle={task.updatedAt ? `Started ${task.updatedAt}` : undefined}
              variant="mint"
            />
            {task.mood && <Badge label={getTaskMoodLabel(task.mood)} variant="coral" />}
            {task.recur && (
              <>
                <Badge label="We're doing this one again!" variant="sky" />
                <Button href="/tasks/recurring" variant="ghost" className={styles.recurProgressLink}>
                  Track your progress
                </Button>
              </>
            )}
          </div>
          <br/>
        </>
      )}
    >
      <br/>
      <div className={styles.completedMeta}>
        {task.completedAt && (
          <Text as="p" tone="secondary" className={styles.completedDate}>
            Completed {task.completedAt}
          </Text>
        )}
        {task.finalNote && (
          <Text as="p" tone="quote" className={styles.finalNote}>
            {task.finalNote}
          </Text>
        )}
        {task.keepsakeUrl && (
            <>
                <br/>
                <Button href={task.keepsakeUrl} target="_blank" rel="noreferrer noopener" variant="outline">
                    Relive the journey!
                </Button>
            </>
        )}

        <br/>
        <Button href="/tasks" variant="filled">
          How about another one? 🎴
        </Button>
      </div>
    </Card>
  );
}
