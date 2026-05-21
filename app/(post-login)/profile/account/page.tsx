"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, TaskTable, Text } from "@/components/index";
import type { UserProfile } from "../../../../models/userProfile";
import { userStore } from "../../../../stores";
import styles from "./page.module.scss";

export default function Account() {
  const router = useRouter();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [profile] = await Promise.all([
          userStore.getCurrentProfile(),
        ]);

        if (!isMounted) { return; }
        setCurrentUserProfile(profile);

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

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
  }, [currentUserProfile?.status, isHydrated, router]);

  const fantasyQuestTasks = [
    { label: "Realistic Questing", description: "You've done these already, no limits this time", checked: true },
    { label: "Personalised Dashboard", description: "Your completed quests feed YOUR progress", checked: true },
    { label: "Track of your achievements", description: "Every quest is a testament of your growth", checked: true },
    { label: "Holding onto your aspirations", description: "Keep track of whatever you aspire to achieve whenever you need it", checked: true },
    { label: "Progress reports you have earned", description: "Progress reports at any given interval that you set", checked: true },
  ];

  return (
    <div className={styles.page}>

      <br/>
      <Text as="p" fullWidth align="center">
        Thank you for taking part in the Brioh experience.
      </Text>

      <Text as="h3" fullWidth align="center">
        Lets Continue Questing, <br/>
        Aspiring and Achieving<br/>
        with Brioh today!
      </Text>
      <br/>

      <Card>
        <br/>
        <Text as="h3" align="center">Mio Brioh!</Text>
        <Text as="h4" align="center">$10 Monthly</Text>
        <Text as="p" align="center">
          for everyone who wants to do and achieve more<br/> 
          Our goal is to support and keep track of your journey for YOU</Text>
        
        <TaskTable
          tasks={fantasyQuestTasks}
          taskHeader=""
          statusHeader=""
          useIcons
          completedLabel="Completed"
          pendingLabel=""
        />
        <br/>
        <Button variant="filled" onClick={() => router.push("/profile/account/subscribe")}>Subscribe Now</Button>
        <Text as="p" align="center">Cancel anytime, you can still ride out the month you've paid for</Text>
        <br/>
      </Card>

      <br/>
      
      <Text as="h2" fullWidth align="center"><big>🫶</big></Text>
      <Text as="p" fullWidth align="center">
        Your subscription will help us continue to <br/>
        develop and improve the Brioh Experience.
      </Text>
      <br/>
    </div>
  );
}
