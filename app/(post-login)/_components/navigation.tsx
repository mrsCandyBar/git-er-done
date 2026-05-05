"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/index";
import styles from "../layout.module.scss";

const links = [
  //{ href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
  { href: "/profile", label: "Profile" },
  { href: "/tasks/state?state=complete", label: "Completed Tasks" },
];

export default function PostLoginNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Post-login pages">
      {links.map(({ href, label }) => (
        <Button
          key={href}
          href={href}
          variant={pathname === href ? "active" : "secondary"}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
}
