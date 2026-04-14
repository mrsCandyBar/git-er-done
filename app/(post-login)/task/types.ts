export type Task = { id?: string; label: string; checked?: boolean };

export type Mood = "love" | "happy" | "not-sure" | "confused" | "not-for-me";

export type Column = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  tasks: Task[];
  updatedAt?: string;
  completedAt?: string;
  finalNote?: string;
  mood?: Mood;
  recur?: boolean;
  keepsakeUrl?: string;
  status: "waiting" | "busy" | "complete";
};
