"use client";

import { Header, Button } from "@/components/index";
import { userStore } from "../../stores";
import PostLoginNav from "./_components/navigation";
import styles from "./layout.module.scss";

export default function PostLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <div className={styles.topRow}>
        <Header />
        <Button
          variant="outline"
          onClick={() => {
            userStore.logout();
            // Optionally, redirect to login or home after logout
            window.location.href = "/login";
          }}
        >
          Sign Out
        </Button>
      </div>

      {children}

      <PostLoginNav />
    </div>
  );
}