import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.scss";

type CommonButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "active" | "filled" | "outline" | "ghost";
  className?: string;
};

type LinkButtonProps = CommonButtonProps & {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  type?: never;
  disabled?: never;
};

type NativeButtonProps = CommonButtonProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  target?: never;
  rel?: never;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button({
  children,
  variant = "outline",
  className = "",
  ...props
}: ButtonProps) {
  const buttonClassName = `${styles.button} ${styles[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http");

    if (isExternal) {
      return (
        <a className={buttonClassName} href={props.href} target={props.target} rel={props.rel}>
          {children}
        </a>
      );
    }

    return (
      <Link className={buttonClassName} href={props.href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClassName}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
