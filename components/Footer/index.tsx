import Button from "../Button";
import styles from "./Footer.module.scss";

type FooterProps = {
  activePage?: "support" | "styleguide";
};

export default function Footer({ activePage }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <Button variant={activePage === "support" ? "active" : "secondary"} href="/support">
        Support
      </Button>
      &nbsp;&nbsp;
      &nbsp;&nbsp;
      <Button variant={activePage === "styleguide" ? "active" : "secondary"} href="/styleguide">
        Styleguide
      </Button>
    </footer>
  );
}
