"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import UpdateProfile from "./update-profile";
import styles from "./page.module.scss";

type UserStatusType = "friend" | "friend_new" | "friend_dear" | "friend_close";

type UserProfile = {
  status: UserStatusType;
  name: string;
  profilePicture: string;
  dob: string;
  about: string;
  progressUpdatePush: boolean;
  startedDate: string;
  updatedDate: string;
  lastLoginDate: string;
  inspirations: string[];
};

const USER_PROFILE_STORAGE_KEY = "brioh-user-profile";

const userProfile: UserProfile = {
  status: "friend_dear",
  name: "Candice Bar",
  profilePicture: "",
  dob: "1994-08-18",
  about: "Curious, reflective, and always chasing wonder.",
  progressUpdatePush: true,
  startedDate: "2026-04-14",
  updatedDate: "2026-04-14",
  lastLoginDate: "2026-04-14",
  inspirations: ["Architecture", "Travel", "Live music"],
};

const actionContent: {
    eyebrow: (profileName?: string) => ReactNode;
    icon: string;
    title: string;
    description?: (profileName: string) => ReactNode;
    primaryLabel: (profileName: string) => string;
    primaryHref: () => string;
    secondaryLabel?: string;
    secondaryHref?: string;
  } = {
  eyebrow: () => <p>You're a close friend! 💖</p>,
  icon: "🌟",
  title: "Your profile journey is complete.",
  primaryLabel: () => "Keep Exploring 🌍",
  primaryHref: () => "/tasks/new",
};

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(userProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = actionContent;

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

  const handleSaveInspiration = () => {
    setCurrentUserProfile((prev) => ({
      ...prev,
      status: "friend_dear",
      updatedDate: new Date().toISOString().slice(0, 10),
    }));
    setIsUpdateProfileOpen(false);
  };

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {currentUserProfile.status === "friend_close" && (
          <>
            <Card
              eyebrow={<Text as="h4">{card.eyebrow(currentUserProfile.name)}</Text>}
              icon={card.icon}
              title={<Text as="h2">{card.title}</Text>}
              actions={(
                <>
                  <Button href={card.primaryHref()} variant="filled">
                    {card.primaryLabel(currentUserProfile.name)}
                  </Button>
                  <br/>
                </>
              )}
            />
          </>
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
