import Button from "../Button";
import styles from "../Button/Button.module.scss";

type FooterProps = {
  activePage?: "support" | "styleguide";
};

export default function Footer({ activePage }: FooterProps) {
  return (
    <footer className={styles.group}>
      <Button
        variant="secondary"
        href="https://www.brioh.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Home
      </Button>
      <Button variant={activePage === "support" ? "active" : "secondary"} href="/support">
        Support
      </Button>
      <Button variant={activePage === "styleguide" ? "active" : "secondary"} href="/styleguide">
        Styleguide
      </Button>
    </footer>
  );
}
