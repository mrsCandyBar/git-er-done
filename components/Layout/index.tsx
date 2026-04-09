import type { Metadata } from "next";
import "../../assets/globals.scss";
import styles from "./Layout.module.scss";

export const metadata: Metadata = {
  title: "Git-Er-Done",
  description: "A task manager for serial procrastinators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.page}>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
