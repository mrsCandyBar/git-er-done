import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Text.module.scss";

type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "strong" | "em" | "blockquote" | "ul" | "ol" | "li" | "a" | "span" | "div";

type TextProps<T extends TextTag = "p"> = {
  as?: T;
  children: ReactNode;
  tone?: "primary" | "secondary" | "quote";
  align?: "left" | "center" | "right";
  fullWidth?: boolean;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Text<T extends TextTag = "p">({
  as,
  children,
  tone = "primary",
  align,
  fullWidth = false,
  className = "",
  ...props
}: TextProps<T>) {
  const tag = (as ?? "p") as TextTag;
  const Component = tag as ElementType;
  const alignClassName = align ? styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`] : "";
  const textClassName = `${styles.base} ${styles[tag]} ${styles[tone]} ${alignClassName} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim();

  return (
    <Component className={textClassName} {...props}>
      {children}
    </Component>
  );
}
