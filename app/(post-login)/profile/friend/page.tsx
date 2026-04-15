"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UpdateProfile from "../update-profile";
import { FriendDearView, FriendNewView, FriendView } from "./status-views";
import { friendStatusActionContent } from "../../../../models/actionContent";
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../../models/userProfile";
import type { UserProfile } from "../../../../models/userProfile";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = friendStatusActionContent[currentUserProfile.status];

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
