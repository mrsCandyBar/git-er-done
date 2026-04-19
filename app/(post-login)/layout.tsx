import { Header, Button } from "@/components/index";
import PostLoginNav from "./_components/navigation";
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

      {children}

      <PostLoginNav />
    </div>
  );
}