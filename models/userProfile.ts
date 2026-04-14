export type UserStatusType = "friend" | "friend_new" | "friend_dear" | "friend_close";

export type TaskCategory = "new" | "fun" | "quest";

export type CategoryBuckets = Record<TaskCategory, string[]>;

export type UserInspiration = {
  inspiration: string;
  reason: string;
  url: string;
};

export type UserAchievement = {
  completed: CategoryBuckets;
  recognized: string[];
};

export type UserProfile = {
  status: UserStatusType;
  name: string;
  profilePicture: string;
  dob: string;
  about: string;
  progressUpdatePush: boolean;
  startedDate: string;
  updatedDate: string;
  lastLoginDate: string;
  inspirations: UserInspiration[];
  achievements: UserAchievement[];
  aspirations: CategoryBuckets;
};

export const USER_PROFILE_STORAGE_KEY = "brioh-user-profile";

export const defaultUserProfile: UserProfile = {
  status: "friend_dear",
  name: "Candice Bar",
  profilePicture: "https://lh3.googleusercontent.com/a/ACg8ocKkfePBiQdfVEcR5NV5NfNhOAEx91qvQtyibO0NITg6-yc-4LPR=s96-c",
  dob: "1987-07-04",
  about: "Curious, reflective, and always chasing wonder.",
  progressUpdatePush: true,
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
        quest: ["9","10"],
      },
      recognized: ["11","12"],
    },
  ],
  aspirations: {
    new: ["1","2","3","4","5"],
    fun: ["6","7","8"],
    quest: ["9","10"],
  },
};