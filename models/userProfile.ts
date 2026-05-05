export type UserStatusType = "friend" | "friend_new" | "friend_dear" | "friend_close";

export type TaskCategory = "new" | "fun" | "task";
export type TaskCategoryModel = {
  _id?: string;
  name: string;
  description: string;
};

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
  id?: string;
  status: UserStatusType;
  name: string;
  profilePicture: string;
  dob?: string;
  about?: string;
  progressUpdatePush?: {
    schedule?: "daily" | "weekly" | "monthly";
    lastUpdatedDate?: string;
    lastUpdateSent?: string;
    updatedDate?: string;
  };
  startedDate: string;
  updatedDate: string;
  lastLoginDate: string;
  inspirations: UserInspiration[];
  achievements: UserAchievement[];
  aspirations: CategoryBuckets;
};

export const USER_PROFILE_STORAGE_KEY = "brioh-user-profile";