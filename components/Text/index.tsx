import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Text.module.scss";

type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "strong" | "em" | "blockquote" | "ul" | "ol" | "li" | "a";

type TextProps<T extends TextTag = "p"> = {
  as?: T;
  children: ReactNode;
  tone?: "primary" | "secondary";
  className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Text<T extends TextTag = "p">({
  as,
  children,
  tone = "primary",
  className = "",
  ...props
}: TextProps<T>) {
  const tag = (as ?? "p") as TextTag;
  const Component = tag as ElementType;
  const textClassName = `${styles.base} ${styles[tag]} ${styles[tone]} ${className}`.trim();

  return (
    <Component className={textClassName} {...props}>
      {children}
    </Component>
  );
}
