"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Text } from "@/components/index";
import MultiTaskCompletionInsights from "./achievement/multiTaskCompletion";
import { closeProfileActionContent } from "../../../models/actionContent";
import type { UserProfile } from "../../../models/userProfile";
import { userStore } from "../../../stores";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();
  const [isHydrated, setIsHydrated] = useState(false);
  const card = closeProfileActionContent;

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
          setCurrentUserProfile(undefined);
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

    if (currentUserProfile?.status !== "friend_close") {
      router.replace("/profile/friend");
    }
    
  }, [currentUserProfile?.status, isHydrated, router]);

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {currentUserProfile?.status === "friend_close" && (
          <Card
            eyebrow={<Text as="h4">{card.eyebrow()}</Text>}
            icon={card.profileImage(currentUserProfile.profilePicture)}
            title={<Text as="h3">{card.title(currentUserProfile.name)}</Text>}
          >
            <MultiTaskCompletionInsights currentUserProfile={currentUserProfile} />
          </Card>
        )}
      </section>
    </div>
  );
}
