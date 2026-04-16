"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateProfile from "../update-profile";
import SingleTaskCompletionInsights from "../SingleTaskCompletionInsights";
import { FriendDearView, FriendNewView, FriendView } from "./status-views";
import { friendStatusActionContent } from "../../../../models/actionContent";
import { defaultUserProfile } from "../../../../models/userProfile";
import type { UserProfile } from "../../../../models/userProfile";
import { taskStore, userStore } from "../../../../stores";
import styles from "./page.module.scss";

type SingleCompletedTask = Parameters<typeof SingleTaskCompletionInsights>[0]["task"];

const taskIconByCategory = {
  new: "🌱",
  fun: "🎉",
  quest: "🗺️",
} as const;

function toDisplayDate(value?: string) {
  if (!value) {
    return new Date().toLocaleDateString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [singleCompletedTask, setSingleCompletedTask] = useState<SingleCompletedTask | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = friendStatusActionContent[currentUserProfile.status];
  const completedTasksCount = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      return acc + completedCount;
    },
    0
  );
  const hasCompletedTask = completedTasksCount > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [profile, completedTasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.listTasks({ status: "complete", limit: 1 }),
        ]);

        if (!isMounted) {
          return;
        }

        setCurrentUserProfile(profile);

        const latestTask = completedTasks[0];
        if (!latestTask) {
          setSingleCompletedTask(null);
          return;
        }

        setSingleCompletedTask({
          id: latestTask.id,
          icon: taskIconByCategory[latestTask.category],
          status: latestTask.status,
          title: latestTask.title,
          description: latestTask.description,
          tasks: latestTask.tasks.map((task, index) => ({
            label: task.label,
            checked: Boolean(task.checked),
            id: task.id ?? `${latestTask.id}-${index}`,
          })),
          category: latestTask.category,
          createdDate: toDisplayDate(latestTask.updatedAt),
          startedDate: toDisplayDate(latestTask.startedAt),
          startedAt: latestTask.startedAt,
          updatedDate: toDisplayDate(latestTask.updatedAt),
          completed: {
            completedDate: toDisplayDate(latestTask.completedAt),
            completedAt: latestTask.completedAt,
            mood: latestTask.mood ?? "happy",
            finalNotes: latestTask.finalNotes,
            recur: Boolean(latestTask.recur),
            keepsakeUrl: latestTask.keepsakeUrl,
          },
        });
      } catch {
        if (isMounted) {
          setCurrentUserProfile(defaultUserProfile);
          setSingleCompletedTask(null);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (currentUserProfile.status === "friend_close") {
      router.replace("/profile");
    }
  }, [currentUserProfile.status, isHydrated, router]);

  const handleSaveInspiration = async (formData: Record<string, FormDataEntryValue>) => {
    const about = String(formData.about ?? "").trim();
    const inspiration = String(formData.inspiration ?? "").trim();
    const reason = String(formData["inspiration-why"] ?? "").trim();
    const url = String(formData["inspiration-url"] ?? "").trim();

    const nextProfile: UserProfile = {
      ...currentUserProfile,
      status: "friend_new",
      updatedDate: new Date().toISOString().slice(0, 10),
      about: about || currentUserProfile.about,
      inspirations: inspiration
        ? [{ inspiration, reason, url }]
        : currentUserProfile.inspirations,
    };

    setCurrentUserProfile(nextProfile);
    setIsUpdateProfileOpen(false);

    try {
      await userStore.updateCurrentProfile({
        status: nextProfile.status,
        updatedDate: nextProfile.updatedDate,
        about: nextProfile.about,
        inspirations: nextProfile.inspirations,
      });
      userStore.setSelectedUser(nextProfile, "me");
    } catch {
      // Keep local optimistic state for responsiveness if network update fails.
    }
  };

  const handleAcceptGift = async () => {
    const nextProfile: UserProfile = {
      ...currentUserProfile,
      status: "friend_close",
      updatedDate: new Date().toISOString().slice(0, 10),
    };

    setCurrentUserProfile(nextProfile);

    try {
      await userStore.updateCurrentProfile({
        status: "friend_close",
        updatedDate: nextProfile.updatedDate,
      });
      userStore.setSelectedUser(nextProfile, "me");
    } catch {
      setCurrentUserProfile((prev) => ({
      ...prev,
      status: "friend",
      updatedDate: nextProfile.updatedDate,
    }));
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {currentUserProfile.status === "friend" && (
          hasCompletedTask && singleCompletedTask
            ? (
              <SingleTaskCompletionInsights
                task={singleCompletedTask}
                profileName={currentUserProfile.name}
                profilePicture={currentUserProfile.profilePicture}
                onOpenUpdateProfile={() => setIsUpdateProfileOpen(true)}
              />
            )
            : <FriendView profileName={currentUserProfile.name} card={card} />
        )}

        {currentUserProfile.status === "friend_new" && (
          <FriendNewView
            profileName={currentUserProfile.name}
            card={card}
          />
        )}

        {currentUserProfile.status === "friend_dear" && (
          <FriendDearView
            profileName={currentUserProfile.name}
            card={card}
            onAcceptGift={handleAcceptGift}
          />
        )}
      </section>

      <UpdateProfile
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
        onSaveInspiration={handleSaveInspiration}
      />
    </div>
  );
}
