import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.scss";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "active";
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "secondary",
  target,
  rel,
  className = "",
}: ButtonProps) {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className}`.trim();
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a className={buttonClassName} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <Link className={buttonClassName} href={href}>
      {children}
    </Link>
  );
}
