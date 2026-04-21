import { CardStackItem } from "@/components/CardStack";
import { UserProfile } from "./userProfile";
import { TaskRecord } from "@/stores/taskStore";
import { isTaskMood, TASK_MOOD_OPTIONS, TaskMood } from "./taskMood";
import { FormFieldConfig } from "@/components/Form";


// SEARCH PAGE
//////////////

// This file defines the TaskCard type, which represents 
// the structure of a task card in the application.

export type TaskCard = {
  type: "fun" | "new" | "quest";
  id: string;
  title: string;
  description: string;
};

// Helper to convert TaskCard payloads to CardStackItem format

export function createStackCards(cards: { title: string; description: string; id: string }[]): CardStackItem[] {
  return cards.map((card) => ({
    title: card.title,
    description: card.description,
    ctaLabel: "Start! 🚀",
    ctaHref: `/tasks/task?id=${card.id}`,
  }));
}

// Payloads for default task cards, 
// which are shown when users have no tasks yet.

export const taskCardPayloads: TaskCard[] = [
  {
    type: "fun",
    id: "dance-class-for-beginners",
    title: "Dance Class for Beginners",
    description: "Start simple and stay playful. Build confidence one small rhythm at a time.",
  },
  {
    type: "fun",
    id: "learn-pottery",
    title: "Weekend Pottery Session",
    description: "Get your hands messy and make something real. Perfection is not required.",
  },
  {
    type: "fun",
    id: "karaoke-night",
    title: "Karaoke Night",
    description: "Pick one song, show up, and have fun with it. No perfect notes needed.",
  },
  {
    type: "new",
    id: "hike-sunrise-trail",
    title: "Sunrise Trail Hike",
    description: "Start your day with momentum. A short trail is enough to reset your headspace.",
  },
  {
    type: "new",
    id: "first-climbing-gym",
    title: "First Climbing Gym Session",
    description: "Learn the basics and complete one route that challenges you.",
  },
  {
    type: "quest",
    id: "write-5k-plan",
    title: "Build a 5K Training Plan",
    description: "Create a realistic weekly plan and schedule your first run.",
  },
  {
    type: "quest",
    id: "portfolio-refresh",
    title: "Refresh Your Portfolio",
    description: "Update your headline, one project case study, and contact section.",
  },
  {
    type: "quest",
    id: "creative-30-day",
    title: "30-Day Creative Challenge",
    description: "Pick one medium and commit to a short daily output streak.",
  },
];

// Task Helper Functions
// Cleanups for the views

export function countCompletedTasks(profile: UserProfile): number {
    const completedTasksCount = Array.isArray(profile.achievements)
    ? profile.achievements.reduce((count, achievement) => {
        const completed = achievement?.completed;
        return (
        count +
        (completed?.new?.length ?? 0) +
        (completed?.fun?.length ?? 0) +
        (completed?.quest?.length ?? 0)
        );
    }, 0)
    : 0;
    
    return completedTasksCount;
}

// END SEARCH PAGE
//////////////////


// START TASK PAGE
//////////////////

const taskIconByCategory = {
  new: "🌱",
  fun: "🎉",
  quest: "🗺️",
} as const;

export type Task = { id?: string; label: string; checked?: boolean };

export type Mood = TaskMood;

export type detailCard = {
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

export function toDetailCard(task: TaskRecord): detailCard {
  return {
    id: task.id,
    eyebrow: task.category.toUpperCase(),
    icon: taskIconByCategory[task.category],
    status: task.status,
    title: task.title,
    description: task.description,
    tasks: task.tasks,
    updatedAt: task.updatedAt,
    completedAt: task.completedAt,
    mood: task.mood,
    finalNote: task.finalNotes,
    recur: task.recur,
    keepsakeUrl: task.keepsakeUrl,
  };
}

// Actions
//////////

export function updateTaskModal(method: string, column: detailCard): any {
  if (method === "update") {
    const taskPayload = {
      id: column.id,
      title: column.title,
      description: column.description,
      checklist: column.tasks.map((task) => task.label),
    };
    return { payload: taskPayload, url: `/tasks/form/update?id=${taskPayload.id}` };
  };

  if (method === "complete") {
    const completionPayload = {
      id: column.id,
      startedAt: column.updatedAt,
    };
    return { payload: completionPayload, url: `/tasks/form/complete?id=${completionPayload.id}` };
  };
}

// FORMS
////////

export type TaskCategory = "fun" | "new" | "quest";

export type DraftUpdateTask = {
  title: string;
  description: string;
  category: TaskCategory;
  checklist: string[];
};

export type UpdateTaskPayload = {
  id?: string;
  title?: string;
  description?: string;
  checklist?: string[];
};

export const taskCategoryOptions: Array<{ value: TaskCategory; label: string }> = [
  { value: "new", label: "Something New" },
  { value: "fun", label: "Just for Fun" },
  { value: "quest", label: "Quest!" },
];


// FORM INPUTS
//////////////

export function buildTaskForm(payload: any): any {
  const fields: FormFieldConfig[] = [
    {
      label: "Tag it!",
      name: "category",
      type: "radio",
      hideLabel: true,
      options: taskCategoryOptions,
      defaultValue: payload?.category ?? undefined,
      required: true,
    },
    {
      name: "title",
      label: "Let's give your quest a title! 🏷️",
      hideLabel: true,
      type: "text",
      defaultValue: payload?.title ?? "",
      placeholder: "What do you want to do?",
      required: true,
    },
    {
      name: "description",
      label: "Describe your quest! 📝",
      hideLabel: true,
      type: "textarea",
      rows: 4,
      defaultValue: payload?.description ?? "",
      placeholder: "What will you do? Where? When?",
      required: true,
    },
  ];

  return fields;
}

export function parseTaskPayload(payload: any, formData: Record<string, FormDataEntryValue>, checklist: string[]) {
  const title = String(formData.title ?? "").trim();
  const description = String(formData.description ?? "").trim();
  const rawCategory = String(formData.category ?? "fun");
  const category: TaskCategory = rawCategory as TaskCategory;

  if (!title || !description) {
    if (payload && !payload.id) { return; }
    else if (!payload) { return; }
  }

  return {
    title,
    description,
    category,
    tasks: checklist.map((label) => ({
      label,
      checked: false
    })),
  }
}

export function buildTaskCompleteForm(payload: any): any {
  const fields: FormFieldConfig[] = [
    {
      name: "mood",
      label: "How did this task make you feel?",
      type: "radio",
      options: TASK_MOOD_OPTIONS,
      required: true,
    },
    {
      name: "finalNotes",
      label: "Final Notes",
      type: "textarea",
      hideLabel: true,
      placeholder: "(optional) Any last words about this adventure? How did it go? What was the highlight? Would you do it again?",
    },
    {
      name: "keepsake",
      label: "Add a link to a post, photo, journal entry, or anything else that helps you remember the journey!",
      type: "text",
      placeholder: "(optional) Paste a keepsake URL",
    }
  ];

  return fields;
}

export function parseCompleteTaskPayload(payload: any, formData: Record<string, FormDataEntryValue>, recur: boolean) {
  const rawMood = String(formData.mood ?? "").trim();
  const finalNotes = String(formData.finalNotes ?? "").trim();
  const keepsake = String(formData.keepsake ?? "").trim();
  const mood: TaskMood = isTaskMood(rawMood) ? rawMood : "happy";

  if (!mood || !payload?.id) return;

  return {
    completedAt: new Date().toISOString(),
    mood,
    finalNotes,
    recur,
    keepsakeUrl: keepsake || undefined,
  }
}