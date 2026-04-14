"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Text from "../../../../components/Text";
import UpdateProfile from "../update-profile";
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
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(userProfile);
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
        {(currentUserProfile.status != "friend_close") ? (
          <>
            <Card
              eyebrow={<Text as="h4">{card.eyebrow(currentUserProfile.name)}</Text>}
              icon={card.icon}
              title={<Text as="h2">{card.title}</Text>}
              actions={(
                <>
                <br/>
                {currentUserProfile.status === "friend_new" ? (
                  <Button variant="filled" onClick={() => setIsUpdateProfileOpen(true)}>
                    {card.primaryLabel(currentUserProfile.name)}
                  </Button>
                ) : currentUserProfile.status === "friend_dear" ? (
                  <>
                    <Text as="p" tone="secondary">
                      It's not easy to be this open and vulnerable, but you did it! <br/>
                      This 🎁 is to show you the impact of your journey thus far.<br/>
                      We're honored to be a part of your story.
                    </Text>
                    
                    <br/>
                    <Button variant="filled" onClick={handleAcceptGift}>
                      {card.primaryLabel(currentUserProfile.name)}
                    </Button>
                  </>

                ) : (
                  <Button href={card.primaryHref()} variant="filled">
                    {card.primaryLabel(currentUserProfile.name)}
                  </Button>
                )}
                <br/>
                </>
              )}
            />

            {currentUserProfile.status === "friend" && (
              <>
                <Card
                  bare
                  title={
                    <>
                      <br/>
                      <Text as="h3" fullWidth>We're not doing <i>'tasking'</i> here</Text>
                    </>
                  }
                  description={<Text as="p" tone="secondary">This space is for you to explore your passions and dreams</Text>}
                  actions={(
                    <>
                    <Button href={card.primaryHref()} variant="filled">
                      Let's make it happen! 🎉
                    </Button>
                    <br/>
                    </>
                  )}
                >
                  <Text as="h1">💃🏰🚞</Text>
                  <Text as="h3">Inspiration & Aspirations</Text>
                  <Text as="p" tone="secondary">Make space for what lights you up, what gets you going, what makes you feel accomplished.</Text>
                </Card>
              </>
            )}

            {currentUserProfile.status === "friend_new" && (
              <>
                <Card bare>
                  <Text as="h3">Is Brioh a task manager?</Text>
                  <Text as="h1">🙈🙉🙊</Text>
                  <Text as="p"><b>Absolutely not!</b> because 🫵 don't need one. <br/>This is a space to explore 👏<b><u>your</u></b>👏 aspirations 🦄</Text>
                </Card>
              </>
            )}
          </>
        ) : null}
      </section>

      <UpdateProfile
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
        onSaveInspiration={handleSaveInspiration}
      />
    </div>
  );
}
