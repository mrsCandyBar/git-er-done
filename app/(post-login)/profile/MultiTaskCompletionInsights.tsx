import Badge from "@/components/Badge";
import Text from "@/components/Text";
import styles from "./page.module.scss";

type AspirationCounts = {
  new: number;
  fun: number;
  quest: number;
};

type Inspiration = {
  inspiration?: string;
  reason?: string;
};

type AchievementTotals = {
  completed: number;
  recognized: number;
};

type MultiTaskCompletionInsightsProps = {
  aspirationCounts: AspirationCounts;
  primaryInspiration?: Inspiration;
  mindsetSummary: string;
  achievementTotals: AchievementTotals;
  elapsedHours: number;
  reasonFitPercent: number;
  completionProgressPercent: number;
};

export default function MultiTaskCompletionInsights({
  aspirationCounts,
  primaryInspiration,
  mindsetSummary,
  achievementTotals,
  elapsedHours,
  reasonFitPercent,
  completionProgressPercent,
}: MultiTaskCompletionInsightsProps) {
  return (
    <>
      <Text as="p" tone="secondary">
        Your current aspirations are mapped across <br/>
        <b>new</b> ({aspirationCounts.new}), <b>fun</b> ({aspirationCounts.fun}), and <b>quest</b> ({aspirationCounts.quest}). <br/>
      </Text>

      <br />
      <br />
      <Text as="h3" align="center" fullWidth>
        How well do your aspirations compare <br/>
        against the inspiration you gave us?
      </Text>
      <div className={styles.insightRow}>
        <div className={styles.insightBox}>
          <Text as="p" tone="secondary">
            You are inspired by <b>{primaryInspiration?.inspiration ?? "still being defined"}</b>,
            because you want <b>{primaryInspiration?.reason ?? "still being defined"}</b>
          </Text>
        </div>
        <div className={styles.insightBox}>
          <br/>
          <Text as="p" tone="secondary">{mindsetSummary}</Text>
        </div>
      </div>

      <br />
      <br />
      <Text as="h4" align="center" fullWidth>Progress & Wins</Text>
      <Text as="p" tone="secondary">
        You have completed <b>{achievementTotals.completed}</b> self-prioritized time slots<br/>
        within the timespan of {elapsedHours} hours, <br/>
        and earned <b>{achievementTotals.recognized}</b> badges of recognition so far.
      </Text>

      <div className={styles.badgeRow}>
        <Badge label="Level up" subtitle="Reward unlocked" variant="sky" />
        <Badge label="Focus mode" variant="slate" />
      </div>

      <Text as="p" tone="secondary">
        These wins are proof that a little dedicated time<br/>
        can create meaningful progress.
      </Text>

      <br />
      <br />
      <Text as="h3" align="center" fullWidth>
        How well do your completed quests compare <br/>
        against the inspiration you gave us?
      </Text>
      <div className={styles.insightRow}>
        <div className={styles.insightBox}>
          <Text as="h1">⚖️</Text>
          <Text as="p"><b>{reasonFitPercent}% reason-fit</b></Text>
          <small>
            <Text as="span" tone="secondary">
              ( how well does your aspirations match <br/>
              your reason for choosing your inspiration )
            </Text>
          </small>
        </div>
        <div className={styles.insightBox}>
          <Text as="h1">🏆</Text>
          <Text as="p">
            <b>{completionProgressPercent}% quest execution</b>
          </Text>
          <small>
            <Text as="span" tone="secondary">
              (how much of what you <br/>planned you completed)
            </Text>
          </small>
        </div>
      </div>

      <br />
      <br />
    </>
  );
}