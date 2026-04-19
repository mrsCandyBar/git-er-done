"use client";

import { Card, Text } from "@/components/index";
import styles from "./page.module.scss";

const recurringQuotes = [
  "Small steps still move the story forward.",
  "Consistency beats intensity when you're building a life you love.",
  "Progress is not perfection. Progress is showing up again.",
  "Give yourself credit for every time you came back.",
  "You are allowed to grow at your own pace.",
];

export default function RecurringTasksPage() {
  return (
    <div className={styles.page}>
      <Card
        title="Recurring Progress"
        description="A little motivation for the quests you are choosing again and again."
      >
        <div className={styles.quoteList}>
          {recurringQuotes.map((quote) => (
            <Text key={quote} as="p" tone="quote" className={styles.quoteItem}>
              {quote}
            </Text>
          ))}
        </div>
      </Card>
    </div>
  );
}
