'use client';

import { useEffect, useState } from "react";
import Button from "./Button";

type ThemeMode = "auto" | "light" | "dark";

type StyleguideThemeToggleProps = {
  targetId: string;
};

export default function StyleguideThemeToggle({ targetId }: StyleguideThemeToggleProps) {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    if (mode === "auto") {
      target.removeAttribute("data-theme");
    } else {
      target.setAttribute("data-theme", mode);
    }

    return () => {
      target.removeAttribute("data-theme");
    };
  }, [mode, targetId]);

  return (
    <>
      <Button type="button" variant={mode === "auto" ? "active" : "outline"} onClick={() => setMode("auto")}>
        Auto
      </Button>
      <Button type="button" variant={mode === "light" ? "active" : "outline"} onClick={() => setMode("light")}>
        Force Light
      </Button>
      <Button type="button" variant={mode === "dark" ? "active" : "outline"} onClick={() => setMode("dark")}>
        Force Dark
      </Button>
    </>
  );
}
