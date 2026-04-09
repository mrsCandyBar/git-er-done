import Image from "next/image";
import nextLogo from "../../assets/images/next.svg";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header>
      <Image
        className={styles.logo}
        src={nextLogo}
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
    </header>
  );
}
