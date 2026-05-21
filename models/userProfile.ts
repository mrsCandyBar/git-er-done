export type UserStatusType = "friend" | "friend_new" | "friend_dear" | "friend_close";

export type TaskCategory = "new" | "fun" | "quest";
export type TaskCategoryModel = {
  _id?: string;
  name: string;
  description: string;
};

export type CategoryBuckets = Record<TaskCategory, string[]>;

export type UserInspiration = {
  inspirations: string;
  reason: string;
  url: string;
};

export type UserAchievement = {
  completed: CategoryBuckets;
  completedAt?: string;
  recognised: string[];
};

export type UserProfile = {
  _id: string;
  about?: string;
  achievements: UserAchievement[];
  aspirations: CategoryBuckets;
  dob?: string | null;
  email: string;
  googleId: string;
  authProvider: string;
  inspirations: UserInspiration[];
  lastLoginDate: string;
  name: string;
  profilePicture: string;
  progressUpdatePush?: {
    schedule?: "daily" | "weekly" | "monthly";
    lastUpdatedDate?: string;
    lastUpdateSent?: string;
    updatedDate?: string;
  };
  startedDate: string;
  status: UserStatusType;
  updatedDate: string;
};

export type loginResponse = {
  message?: string;
  isNewUser?: boolean;
  user: {
    _id: string;
    about?: string;
    achievements: UserAchievement[];
    aspirations: CategoryBuckets;
    dob?: string;
    email: string;
    googleid: string;
    inspirations: UserInspiration[];
    lastLoginDate: string;
    name: string;
    profilePicture: string;
    progressUpdatePush?: {
      schedule?: "daily" | "weekly" | "monthly";
      lastUpdatedDate?: string;
      lastUpdateSent?: string;
      updatedDate?: string;
    };
    startedDate: string;
    status: UserStatusType;
    updatedDate: string;
  }
};

export const USER_PROFILE_STORAGE_KEY = "brioh-user-profile";