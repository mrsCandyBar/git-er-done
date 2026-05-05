export type TaskMood = "love" | "happy" | "not-sure" | "confused" | "not-for-me";

export const TASK_MOOD_LABELS: Record<TaskMood, string> = {
  love: "😍 Love",
  happy: "😊 Happy",
  "not-sure": "🤔 Not sure",
  confused: "😵 Confused",
  "not-for-me": "🙅 Not for me",
};

export const TASK_MOOD_OPTIONS = (Object.entries(TASK_MOOD_LABELS) as Array<[TaskMood, string]>).map(
  ([value, label]) => ({ value, label })
);

export function isTaskMood(value: string): value is TaskMood {
  return value in TASK_MOOD_LABELS;
}

export function getTaskMoodLabel(mood: TaskMood): string {
  return TASK_MOOD_LABELS[mood];
}
