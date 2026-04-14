"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import UpdateProfile from "../update-profile";
import { FriendDearView, FriendNewView, FriendView } from "./status-views";
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../../models/userProfile";
import type { UserProfile, UserStatusType } from "../../../../models/userProfile";
import styles from "./page.module.scss";

const actionContent: Record<
  UserStatusType,
  {
    eyebrow: (profileName?: string) => ReactNode;
    icon: string;
    title: string;
    description?: (profileName: string) => ReactNode;
    primaryLabel: (profileName: string) => string;
    primaryHref: () => string;
    secondaryLabel?: string;
    secondaryHref?: string;
  }
> = {
  friend: {
    eyebrow: () => <p>Hello there friend!👋</p>,
    icon: "🏃",
    title: "You're new here, let's get you set up with your first milestone!",
    primaryLabel: () => "Let's Go!",
    primaryHref: () => "/tasks/new"
  },
  friend_new: {
    eyebrow: (profileName) => <p>Hello again, {profileName} ✨</p>,
    icon: "🎉",
    title: "Your profile is looking good, let's add a little more to make it shine.",
    primaryLabel: () => "Tiny step, big mood shift ✨",
    primaryHref: () => "/task",
  },
  friend_dear: {
    eyebrow: () => <p>Profile Complete! 💯!!!</p>,
    icon: "🫶",
    title: "Thank you for sharing your inspirations and aspirations with us. Here's a 🎁 for you",
    primaryLabel: () => "Accept Gift ✨",
    primaryHref: () => "/tasks/new",
  }, 
  friend_close: {
    eyebrow: () => <p>You're a close friend! 💖</p>,
    icon: "🌟",
    title: "Thank you for being with us on this journey.",
    primaryLabel: () => "Continue Exploring 🌍",
    primaryHref: () => "/tasks/new",
  }
};

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = actionContent[currentUserProfile.status];

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

    if (currentUserProfile.status === "friend_close") {
      router.replace("/profile");
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

  const handleAcceptGift = () => {
    setCurrentUserProfile((prev) => ({
      ...prev,
      status: "friend_close",
      updatedDate: new Date().toISOString().slice(0, 10),
    }));
  };

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {currentUserProfile.status === "friend" && (
          <FriendView profileName={currentUserProfile.name} card={card} />
        )}

        {currentUserProfile.status === "friend_new" && (
          <FriendNewView
            profileName={currentUserProfile.name}
            card={card}
            onOpenUpdateProfile={() => setIsUpdateProfileOpen(true)}
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
