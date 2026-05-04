"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "../stores";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        await userStore.tryRestoreSession();
        router.replace("/profile");
      } catch {
        router.replace("/login");
      }
    }
    checkSession();
  }, [router]);

  return null;
}
