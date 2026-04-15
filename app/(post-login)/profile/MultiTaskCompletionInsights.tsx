import Badge from "@/components/Badge";
import Text from "@/components/Text";
import type { UserProfile } from "@/models/userProfile";
import styles from "./page.module.scss";

type MultiTaskCompletionInsightsProps = {
  currentUserProfile: UserProfile;
};

export default function MultiTaskCompletionInsights({
  currentUserProfile,
}: MultiTaskCompletionInsightsProps) {
  const aspirationCounts = {
    new: currentUserProfile.aspirations.new.length,
    fun: currentUserProfile.aspirations.fun.length,
    quest: currentUserProfile.aspirations.quest.length,
  };

  const achievementTotals = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      const recognizedCount = entry.recognized.length;

      return {
        completed: acc.completed + completedCount,
        recognized: acc.recognized + recognizedCount,
      };
    },
    { completed: 0, recognized: 0 }
  );

  if (achievementTotals.completed < 2) {
    return null;
  }

  const dominantAspirationCategory =
    aspirationCounts.new >= aspirationCounts.fun && aspirationCounts.new >= aspirationCounts.quest
      ? "new"
      : aspirationCounts.quest >= aspirationCounts.fun
        ? "quest"
        : "fun";

  const mindsetSummary =
    dominantAspirationCategory === "new"
      ? "You are leaning into growth mode and choosing fresh experiences to motivate positive change."
      : dominantAspirationCategory === "quest"
        ? "You are in momentum mode, focused on getting ahead of your day-to-day commitments."
        : "You are signaling a healthy need for personal time, joy, and restorative space.";

  const primaryInspiration = currentUserProfile.inspirations[0];
  const totalAspirations = aspirationCounts.new + aspirationCounts.fun + aspirationCounts.quest;

  const inspirationReason = (primaryInspiration?.reason ?? "").toLowerCase();
  const reasonTargetCategory =
    /(bold|new|learn|growth|change|challenge)/.test(inspirationReason)
      ? "new"
      : /(ahead|discipline|focus|routine|momentum|productive|progress)/.test(inspirationReason)
        ? "quest"
        : "fun";

  const reasonFitPercent = totalAspirations > 0
    ? Math.round((aspirationCounts[reasonTargetCategory] / totalAspirations) * 100)
    : 0;

  const completionProgressPercent = totalAspirations > 0
    ? Math.min(100, Math.round((achievementTotals.completed / totalAspirations) * 100))
    : 0;

  const startedAt = new Date(currentUserProfile.startedDate).getTime();
  const updatedAt = new Date(currentUserProfile.updatedDate).getTime();
  const elapsedHours = Number.isFinite(startedAt) && Number.isFinite(updatedAt)
    ? Math.max(0, Math.ceil((updatedAt - startedAt) / (1000 * 60 * 60)))
    : 0;

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