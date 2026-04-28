"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateProfile from "../form/update";
import SingleTaskCompletionInsights from "../achievement/singleTaskCompletion";
import { FriendDearView, FriendNewView, FriendView } from "./status-views";
import { friendStatusActionContent } from "../../../../models/actionContent";
import type { UserProfile } from "../../../../models/userProfile";
import { taskStore, userStore } from "../../../../stores";
import styles from "./page.module.scss";
import { TaskRecord } from "@/stores/taskStore";

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
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();
  const [singleCompletedTask, setSingleCompletedTask] = useState<SingleCompletedTask | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = currentUserProfile ? friendStatusActionContent[currentUserProfile.status] : undefined;
  const completedTasksCount = currentUserProfile ? currentUserProfile?.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      return acc + completedCount;
    },
    0
  ) : 0;
  const hasCompletedTask = completedTasksCount > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [profile, completedTasks] = await Promise.all([
          userStore.getCurrentProfile(),
          taskStore.getAllTasks({ status: "complete", limit: 1 }),
        ]);

        if (!isMounted) {
          return;
        }

        setCurrentUserProfile(profile);
        if (!completedTasks || completedTasks.length === 0) {
          setSingleCompletedTask(null);
          return;
        }

        const latestTask:TaskRecord = completedTasks[0];
        if (!latestTask) {
          setSingleCompletedTask(null);
          return;
        }

        setSingleCompletedTask({
          id: latestTask.id,
          icon: taskIconByCategory[latestTask.category],
          status: latestTask.status,
          title: latestTask.name,
          description: latestTask.description,
          checklist: latestTask.checklist?.map((task, index) => ({
            label: task.label,
            checked: Boolean(task.checked),
            id: task.id ?? `${latestTask.id}-${index}`,
          })),
          category: latestTask.category,
          createdDate: toDisplayDate(latestTask.updatedDate),
          startedDate: toDisplayDate(latestTask.startedDate),
          updatedDate: toDisplayDate(latestTask.updatedDate),
          completed: latestTask.completed
        });

      } catch {
        if (isMounted) {
          setCurrentUserProfile(undefined);
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

    if (currentUserProfile?.status === "friend_close") {
      router.replace("/profile");
    }
  }, [currentUserProfile?.status, isHydrated, router]);

  const handleSaveInspiration = async (formData: Record<string, FormDataEntryValue>) => {
    const about = String(formData.about ?? "").trim();
    const inspiration = String(formData.inspiration ?? "").trim();
    const reason = String(formData["inspiration-why"] ?? "").trim();
    const url = String(formData["inspiration-url"] ?? "").trim();

    if (!currentUserProfile) {
      alert("Profile data is not loaded yet. Please try again.");
      return;
    }

    const userUpdate: UserProfile = {
      ...currentUserProfile,
      status: "friend_new",
      about: about ? about : currentUserProfile?.about ?? "",
      inspirations: inspiration
        ? [{ inspiration, reason, url }]
        : currentUserProfile?.inspirations ?? [],
    };

    try {
      await userStore.updateCurrentProfile(userUpdate).then((update) => {
        setCurrentUserProfile(update);
        setIsUpdateProfileOpen(false);
      });
    } catch {
      // Keep local optimistic state for responsiveness if network update fails.
    }
  };

  const handleAcceptGift = async () => {
    try {
      const userUpdate = await userStore.updateStatus("friend_close");
      setCurrentUserProfile(userUpdate);
    } catch {
      alert("Sorry, something went wrong accepting the gift. Please try again.");
    }
  };

  return (
    currentUserProfile ? (
      <div className={styles.page}>
        <section className={styles.cards}>
          {currentUserProfile?.status === "friend" && (
            hasCompletedTask && singleCompletedTask
              ? (
                <SingleTaskCompletionInsights
                  task={singleCompletedTask}
                  profileName={currentUserProfile.name}
                  profilePicture={currentUserProfile.profilePicture}
                  onOpenUpdateProfile={() => setIsUpdateProfileOpen(true)}
                />
              )
              : card && <FriendView profileName={currentUserProfile.name} card={card} />
          )}

          {currentUserProfile.status === "friend_new" && card && (
            <FriendNewView
              profileName={currentUserProfile.name}
              card={card}
            />
          )}

          {currentUserProfile.status === "friend_dear" && card && (
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
    ) : null
  );
}
