"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import UpdateProfile from "./update-profile";
import { defaultUserProfile, USER_PROFILE_STORAGE_KEY } from "../../../models/userProfile";
import type { UserProfile } from "../../../models/userProfile";
import styles from "./page.module.scss";
import Badge from "@/components/Badge";

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
                  <Text as="p" tone="secondary">
                    Your current aspirations are mapped across <br/>
                    <b>new</b> ({aspirationCounts.new}), <b>fun</b> ({aspirationCounts.fun}), and <b>quest</b> ({aspirationCounts.quest}). <br/>
                  </Text>



                  <br />
                  <br />
                  <Text as="h3" align="center" fullWidth>
                    How well do your aspirations compare <br/>
                    against the inspiration you gave us?
                  </Text>
                  <div className={styles.insightRow}>
                    <div className={styles.insightBox}>
                      <Text as="p" tone="secondary">
                        You are inspired by <b>{primaryInspiration?.inspiration ?? "still being defined"}</b>, 
                        because you want <b>{primaryInspiration?.reason ?? "still being defined"}</b></Text>
                    </div>
                    <div className={styles.insightBox}>
                      <br/>
                      <Text as="p" tone="secondary">{mindsetSummary}</Text>
                    </div>
                  </div>



                  <br />
                  <br />
                  <Text as="h4" align="center" fullWidth>Progress & Wins</Text>
                  <Text as="p" tone="secondary">
                    You have completed <b>{achievementTotals.completed}</b> self-prioritized time slots<br/> 
                    within the timespan of {Math.ceil((new Date(currentUserProfile.updatedDate).getTime() - new Date(currentUserProfile.startedDate).getTime()) / (1000 * 60 * 60))} hours, <br/>
                    and earned <b>{achievementTotals.recognized}</b> badges of recognition so far.
                  </Text>

                  <div className={styles.badgeRow}>
                    <Badge label="Level up" subtitle="Reward unlocked" variant="sky" />
                    <Badge label="Focus mode" variant="slate" />
                  </div>

                  <Text as="p" tone="secondary">
                    These wins are proof that a little dedicated time<br/>
                     can create meaningful progress.
                  </Text>

                  <br />
                  <br />
                  <Text as="h3" align="center" fullWidth>
                    How well do your completed quests compare <br/>
                    against the inspiration you gave us?
                  </Text>
                  <div className={styles.insightRow}>
                    <div className={styles.insightBox}>
                      <Text as="h1">⚖️</Text>
                      <Text as="p"><b>{reasonFitPercent}% reason-fit</b></Text>
                      <small>
                        <Text as="span" tone="secondary">
                          ( how well does your aspirations match <br/>
                          your reason for choosing your inspiration )
                        </Text>
                      </small>
                    </div>
                    <div className={styles.insightBox}>
                      <Text as="h1">🏆</Text>
                      <Text as="p">
                        <b>{completionProgressPercent}% quest execution</b></Text>
                      <small>
                        <Text as="span" tone="secondary">
                          (how much of what you <br/>planned you completed)
                        </Text>
                      </small>
                    </div>
                  </div>

                  <br />
                  <br />
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
