"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateProfile from "./update-profile";
import MultiTaskCompletionInsights from "./MultiTaskCompletionInsights";
import SingleTaskCompletionInsights from "./SingleTaskCompletionInsights";
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../models/userProfile";
import type { UserProfile } from "../../../models/userProfile";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const completedTasksCount = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      return acc + completedCount;
    },
    0
  );

  const hasCompletedSingleTask = completedTasksCount === 1;

  const singleCompletedTask = {
    id: "dance-class-for-beginners",
    icon: "💃",
    status: "waiting" as const,
    title: "Dance Class for Beginners",
    description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun.",
    tasks: [
      { label: "Book an appointment", checked: true },
      { label: "Make arrangements for alternative transportation", checked: true },
      { label: "Take a picture for memory", checked: false },
    ],
    category: "fun" as const,
    createdDate: new Date().toLocaleDateString(),
    startedDate: new Date().toLocaleDateString(),
    updatedDate: new Date().toLocaleDateString(),
    completed: {
      completedDate: new Date().toLocaleDateString(),
      mood: "Happy",
      finalNotes: "Had a great time learning new moves!",
      recur: true,
      keepsakeUrl: "https://www.test.com/keepsake/dance-class-for-beginners",
    },
  };

  useEffect(() => {
    try {
      const storedProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as UserProfile;
        setCurrentUserProfile(parsedProfile);
      }
    } catch {
      // Ignore malformed local storage and continue with defaults.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(currentUserProfile));
  }, [currentUserProfile, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (currentUserProfile.status !== "friend_close") {
      router.replace("/profile/friend");
    }
  }, [currentUserProfile.status, isHydrated, router]);

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {currentUserProfile.status === "friend_close" && (
          <SingleTaskCompletionInsights
            task={singleCompletedTask}
            profileName={currentUserProfile.name}
            profilePicture={currentUserProfile.profilePicture}
            onOpenUpdateProfile={() => setIsUpdateProfileOpen(true)}
            showSingleTaskInsights={hasCompletedSingleTask}
          >
            <MultiTaskCompletionInsights currentUserProfile={currentUserProfile} />
          </SingleTaskCompletionInsights>
        )}
      </section>
    </div>
  );
}
