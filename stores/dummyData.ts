import { UserProfile } from "@/models/userProfile";
import { TaskRecord } from "./taskStore";

export const dummyTasks: TaskRecord[] = [
    {
        id: "dummy-dance-class",
        category: "fun",
        name: "Dance Class for Beginners",
        description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
        status: "waiting",
        checklist: [
            { id: "dummy-dance-class-1", label: "Book an appointment", checked: true },
            { id: "dummy-dance-class-2", label: "Arrange transportation", checked: true },
            { id: "dummy-dance-class-3", label: "Take a keepsake photo", checked: false },
        ],
        updatedDate: new Date().toISOString(),
    },
];

export const dummyCurrentUser: UserProfile = { 
  status: "friend",
  name: "Candice Bar",
  profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKkfePBiQdfVEcR5NV5NfNhOAEx91qvQtyibO0NITg6-yc-4LPR=s96-c",
  dob: "1987-07-04",
  about: "Curious, reflective, and always chasing wonder.",
  progressUpdatePush: {
    schedule: "monthly",
    lastUpdateSent: "2026-10-03T22:00:00.000+00:00",
    lastUpdatedDate: "2026-10-03T22:00:00.000+00:00",
    updatedDate: "2026-10-03T22:00:00.000+00:00"
  },
  startedDate: "2026-04-14",
  updatedDate: "2026-04-14",
  lastLoginDate: "2026-04-14",
  inspirations: [
    {
      inspiration: "Vivienne Westwood, Yoshitaka Amano, Sephiroth",
      reason: "To be more bold!",
      url: "",
    },
  ],
  achievements: [
    {
      completed: {
        new: ["1","2","3","4","5"],
        fun: ["6","7","8"],
        quest: ["9"],
      },
      recognized: ["11","12"],
    },
  ],
  aspirations: {
    new: ["1","2","3","4","5"],
    fun: ["6","7","8"],
    quest: ["9"],
  },
};