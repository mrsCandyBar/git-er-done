import Header from "../../components/Header";
import Button from "../../components/Button";
import PostLoginNav from "./PostLoginNav";
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

      <PostLoginNav />
    </div>
  );
}