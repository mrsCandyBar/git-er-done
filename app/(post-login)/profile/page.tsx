"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import MultiTaskCompletionInsights from "./achievement/multiTaskCompletion";
import { closeProfileActionContent } from "../../../models/actionContent";
import { defaultUserProfile } from "../../../models/userProfile";
import type { UserProfile } from "../../../models/userProfile";
import { userStore } from "../../../stores";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = closeProfileActionContent;
  const completedTasksCount = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      return acc + completedCount;
    },
    0
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await userStore.getCurrentProfile();
        if (isMounted) {
          setCurrentUserProfile(profile);
        }
      } catch {
        if (isMounted) {
          setCurrentUserProfile(defaultUserProfile);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
          <Card
            eyebrow={<Text as="h4">{card.eyebrow()}</Text>}
            icon={card.profileImage(currentUserProfile.profilePicture)}
            title={<Text as="h2">{card.title(currentUserProfile.name)}</Text>}
          >
            <MultiTaskCompletionInsights currentUserProfile={currentUserProfile} />
          </Card>
        )}
      </section>
    </div>
  );
}
