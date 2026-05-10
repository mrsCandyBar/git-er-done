import { Header, Footer, Button, Text } from "@/components/index";
import GoogleLoginButton from "@/components/google-login";
import styles from "./page.module.scss";

export default function Login() {
  return (
    <>
      <div className={styles.introHeader}>
        <Header />
      </div>
      <div className={styles.intro}>
        <Text as="h0" className={styles.introText}>Let's do great things together</Text>
        <GoogleLoginButton />
      </div>
      <Footer />
    </>
  );
}
