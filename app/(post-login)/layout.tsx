import Header from "../../components/Header";
import Button from "../../components/Button";
import styles from "./layout.module.scss";

export default function PostLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <div className={styles.topRow}>
        <Header />
        <Button href="/login" variant="outline">
          Sign Out (Preview)
        </Button>
      </div>

      <section className={styles.content}>{children}</section>

      <nav className={styles.nav} aria-label="Post-login pages">
        <Button href="/dashboard" variant="secondary">
          Dashboard
        </Button>
        <Button href="/current" variant="secondary">
          Current
        </Button>
        <Button href="/profile" variant="secondary">
          Profile
        </Button>
      </nav>
    </div>
  );
}