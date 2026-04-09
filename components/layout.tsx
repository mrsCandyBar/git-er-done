import type { Metadata } from "next";
import favicon from "../assets/favicon.ico";
import "../assets/globals.scss";

export const metadata: Metadata = {
  title: "Git-Er-Done",
  description: "A task manager for serial procrastinators",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
