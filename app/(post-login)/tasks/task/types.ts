import type { TaskMood } from "../../../../models/taskMood";

export type Task = { _id?: string; label: string; checked?: boolean, updateDate?: string };

export type Mood = TaskMood;

export type Column = {
  _id: string;
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
  recurId?: string;
  keepsakeUrl?: string;
  state: "waiting" | "busy" | "complete";
};
