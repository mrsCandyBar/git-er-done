import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../../assets/globals.scss";
import styles from "./Layout.module.scss";

config.autoAddCss = false;

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
        <div id="root" className={styles.page}>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
