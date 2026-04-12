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

      <nav className={styles.nav} aria-label="Post-login pages">
        <Button href="/base" variant="secondary">
          Workspace
        </Button>
        <Button href="/task" variant="secondary">
          Tasks
        </Button>
        <Button href="/profile" variant="secondary">
          Profile
        </Button>
      </nav>

      <section className={styles.content}>{children}</section>
    </div>
  );
}