"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userStore } from "../stores";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const result = await userStore.tryRestoreSession();
        if (result == "success") {
          router.replace("/profile");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }
    checkSession();
  }, [router]);

  return null;
}
