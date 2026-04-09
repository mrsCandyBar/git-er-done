import Image from "next/image";
import vercelLogo from "../../assets/images/vercel.svg";
import Button from "../Button";
import styles from "../Button/Button.module.scss";

type FooterProps = {
  activePage?: "login" | "about" | "profile" | "base" | "task";
};

export default function Footer({ activePage }: FooterProps) {
  return (
    <footer className={styles.group}>
      <Button
        variant="primary"
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className={styles.icon}
          src={vercelLogo}
          alt="Vercel logomark"
          width={16}
          height={16}
        />
        Deploy Now
      </Button>
      <Button
        variant="secondary"
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
      </Button>
      <Button variant={activePage === "login" ? "active" : "secondary"} href="/login">
        Login Page
      </Button>
      <Button variant={activePage === "about" ? "active" : "secondary"} href="/about">
        About Page
      </Button>
      <Button variant={activePage === "profile" ? "active" : "secondary"} href="/profile">
        Profile Page
      </Button>
      <Button variant={activePage === "base" ? "active" : "secondary"} href="/base">
        Base Page
      </Button>
      <Button variant={activePage === "task" ? "active" : "secondary"} href="/task">
        Task Page
      </Button>
    </footer>
  );
}
