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
    let valid = false;
    try {
      const pass = localStorage.getItem("pass");
      if (pass) {
        const { decryptPayload } = require("../../utilities/helper");
        const { token } = decryptPayload(pass);
        if (token) valid = true;
      }
    } catch {}
    if (!valid) {
      router.replace("/login");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return null;
  }
  if (!authorized) {
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