"use client";


import { Header, Button } from "@/components/index";
import { userStore } from "../../stores";
import PostLoginNav from "./_components/navigation";
import styles from "./layout.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const [authorized, setAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const result = await userStore.tryRestoreSession();
        console.log("Session restore result:", result);
        if (result == "success") {
          setAuthorized(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }
    checkSession();
  }, [router]);

  if (authorized === null) {
    return null;
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topRow}>
        <Header />
        <Button
          variant="outline"
          onClick={() => {
            userStore.logout();
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