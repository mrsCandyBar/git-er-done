import type { TaskMood } from "../../../../models/taskMood";

export type Task = { id?: string; label: string; checked?: boolean };

export type Mood = TaskMood;

export type Column = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  checklist: Task[];
  updatedDate?: string;
  completedDate?: string;
  finalNotes?: string;
  mood?: Mood;
  recur?: boolean;
  keepsakeUrl?: string;
  status: "waiting" | "busy" | "complete";
};
