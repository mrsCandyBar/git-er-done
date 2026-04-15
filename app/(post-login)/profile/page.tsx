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
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../models/userProfile";
import type { UserProfile } from "../../../models/userProfile";
import styles from "./page.module.scss";

const actionContent: {
    eyebrow: () => ReactNode;
    profileImage: (profilePicture?: string) => ReactNode;
    title: (profileName: string) => ReactNode;
    description: (profileAbout: string) => ReactNode;
    primaryLabel: (profileName: string) => string;
    primaryHref: () => string;
    secondaryLabel?: string;
    secondaryHref?: string;
  } = {
  eyebrow: () => <p>Welcome back friend 💖</p>,
  profileImage: (profilePicture) => <img src={profilePicture} alt="Profile" />,
  title: (profileName) => <>{profileName}</>,
  description: (profileAbout) => <>{profileAbout}</>,
  primaryLabel: () => "Keep Exploring 🌍",
  primaryHref: () => "/tasks/new",
};

export default function Profile() {
  const router = useRouter();
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);
  const card = actionContent;

  const aspirationCounts = {
    new: currentUserProfile.aspirations.new.length,
    fun: currentUserProfile.aspirations.fun.length,
    quest: currentUserProfile.aspirations.quest.length,
  };

  const dominantAspirationCategory =
    aspirationCounts.new >= aspirationCounts.fun && aspirationCounts.new >= aspirationCounts.quest
      ? "new"
      : aspirationCounts.quest >= aspirationCounts.fun
        ? "quest"
        : "fun";

  const mindsetSummary =
    dominantAspirationCategory === "new"
      ? "You are leaning into growth mode and choosing fresh experiences to motivate positive change."
      : dominantAspirationCategory === "quest"
        ? "You are in momentum mode, focused on getting ahead of your day-to-day commitments."
        : "You are signaling a healthy need for personal time, joy, and restorative space."
  ;

  const achievementTotals = currentUserProfile.achievements.reduce(
    (acc, entry) => {
      const completedCount = entry.completed.new.length + entry.completed.fun.length + entry.completed.quest.length;
      const recognizedCount = entry.recognized.length;

      return {
        completed: acc.completed + completedCount,
        recognized: acc.recognized + recognizedCount,
      };
    },
    { completed: 0, recognized: 0 }
  );

  const primaryInspiration = currentUserProfile.inspirations[0];
  const totalAspirations = aspirationCounts.new + aspirationCounts.fun + aspirationCounts.quest;
  const dominantCount = aspirationCounts[dominantAspirationCategory];
  const alignmentPercent = totalAspirations > 0 ? Math.round((dominantCount / totalAspirations) * 100) : 0;

  const inspirationReason = (primaryInspiration?.reason ?? "").toLowerCase();
  const reasonTargetCategory =
    /(bold|new|learn|growth|change|challenge)/.test(inspirationReason)
      ? "new"
      : /(ahead|discipline|focus|routine|momentum|productive|progress)/.test(inspirationReason)
        ? "quest"
        : "fun";

  const reasonFitPercent = totalAspirations > 0
    ? Math.round((aspirationCounts[reasonTargetCategory] / totalAspirations) * 100)
    : 0;

  const completionProgressPercent = totalAspirations > 0
    ? Math.min(100, Math.round((achievementTotals.completed / totalAspirations) * 100))
    : 0;

  const hasCompletedSingleTask = achievementTotals.completed === 1;
  const hasCompletedMultipleTasks = achievementTotals.completed >= 2;

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

  const elapsedHours = Math.ceil(
    (new Date(currentUserProfile.updatedDate).getTime() - new Date(currentUserProfile.startedDate).getTime())
    / (1000 * 60 * 60)
  );

  const measuredAlignmentScore = Math.round((reasonFitPercent * 0.6) + (completionProgressPercent * 0.4));

  const alignmentSummary =
    dominantAspirationCategory === "new"
      ? "Most of your aspirations focus on trying new things and stretching your comfort zone."
      : dominantAspirationCategory === "quest"
        ? "By prioritizing quests, you are building structure and momentum to back your intention with action."
        : "By prioritizing fun, you are protecting personal joy and recovery.";

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
                  {hasCompletedMultipleTasks && (
                    <MultiTaskCompletionInsights
                      aspirationCounts={aspirationCounts}
                      primaryInspiration={primaryInspiration}
                      mindsetSummary={mindsetSummary}
                      achievementTotals={achievementTotals}
                      elapsedHours={elapsedHours}
                      reasonFitPercent={reasonFitPercent}
                      completionProgressPercent={completionProgressPercent}
                    />
                  )}

                  
                  
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
