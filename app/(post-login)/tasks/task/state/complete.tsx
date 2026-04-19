import { Badge, Button, Card, Text } from "@/components/index";
import { getTaskMoodLabel } from "../../../../../models/taskMood";
import type { Column } from "../types";
import styles from "../page.module.scss";

type TaskCompletePageProps = {
  column: Column;
  isSecondary: boolean;
};

export default function TaskCompletePage({ column, isSecondary }: TaskCompletePageProps) {
  return (
    <Card
      className={isSecondary ? styles.secondary : ""}
      eyebrow={<Text as="h4">{column.eyebrow}</Text>}
      icon={column.icon}
      title={<Text as="h2" fullWidth>{column.title}</Text>}
      description={<Text as="p">{column.description}</Text>}
      actions={(
        <>
          <div className={styles.stickerStackFloat}>
            <Badge
              label="You did it!"
              subtitle={column.updatedAt ? `Started ${column.updatedAt}` : undefined}
              variant="mint"
            />
            {column.mood && <Badge label={getTaskMoodLabel(column.mood)} variant="coral" />}
            {column.recur && (
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
        {column.completedAt && (
          <Text as="p" tone="secondary" className={styles.completedDate}>
            Completed {column.completedAt}
          </Text>
        )}
        {column.finalNote && (
          <Text as="p" tone="quote" className={styles.finalNote}>
            {column.finalNote}
          </Text>
        )}
        {column.keepsakeUrl && (
            <>
                <br/>
                <Button href={column.keepsakeUrl} target="_blank" rel="noreferrer noopener" variant="outline">
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
