import Image from "next/image";
import Link from "next/link";
import nextLogo from "../../assets/images/next.svg";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header>
      <Link href="https://www.brioh.app" aria-label="Go to home">
        <Image
          className={styles.logo}
          src={nextLogo}
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
      </Link>
    </header>
  );
}
