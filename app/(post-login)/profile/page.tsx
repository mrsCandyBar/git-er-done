"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import UpdateProfile from "./update-profile";
import MultiTaskCompletionInsights from "./MultiTaskCompletionInsights";
import SingleTaskCompletionInsights from "./SingleTaskCompletionInsights";
import { closeProfileActionContent } from "../../../models/actionContent";
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../models/userProfile";
import type { UserProfile } from "../../../models/userProfile";
import styles from "./page.module.scss";

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
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
              eyebrow={<Text as="h4">{card.eyebrow()}</Text>}
              icon={card.profileImage(currentUserProfile.profilePicture)}
              title={<Text as="h2">{card.title(currentUserProfile.name)}</Text>}
              description={
                <>
                  <Text as="p">{card.description(currentUserProfile.about)}</Text>
                  {hasCompletedSingleTask && (
                    <SingleTaskCompletionInsights task={singleCompletedTask} />
                  )}
                  <MultiTaskCompletionInsights currentUserProfile={currentUserProfile} />

                  
                  
                  <Text as="h3" align="center" fullWidth>So... what is Brioh again?</Text>
                  <br/>
                  <Text as="p" tone="secondary">
                    Brioh is designed to help 🫵 reconnect with 🫵.<br/>
                    🫵 have achieved all this since we met<br/>
                    Let's turn 🫵 aspirations and goals into reality!
                  </Text>

                  <br/>
                  <Text as="h1" align="center" fullWidth> 🧙‍♀️🚞🤴🏰💂</Text>
                  <br/>
                  <Text as="h4" align="center" fullWidth>
                    One glorious quest at a time
                  </Text>
                </>
              }
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
