'use client';

import React from "react";
export type LogoVersion = "brioh" | "brioh-card" | "brioh-heart" | "brioh-star";
import styles from "./Logo.module.scss";

interface LogoProps {
  version?: LogoVersion;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const logoSources = {
  "brioh": {
    light: "/images/logo/brioh-black.svg",
    dark: "/images/logo/brioh-white.svg",
  },
  "brioh-card": {
    light: "/images/logo/card.png",
    dark: "/images/logo/card.png",
  },
  "brioh-heart": {
    light: "/images/logo/heart.png",
    dark: "/images/logo/heart.png",
  },
  "brioh-star": {
    light: "/images/logo/star.svg",
    dark: "/images/logo/star.svg",
  },
};

export const Logo: React.FC<LogoProps> = ({ version = "brioh", alt = "Brioh Logo", style }) => {
  // Use matchMedia to detect dark mode
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.getElementById('root');
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const theme = root?.getAttribute('data-theme');
      if (theme === 'dark') setIsDark(true);
      else if (theme === 'light') setIsDark(false);
      else setIsDark(matcher.matches);
    };

    updateTheme();

    const mutationObserver = root
      ? new MutationObserver(updateTheme)
      : null;
    if (mutationObserver && root) {
      mutationObserver.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }

    const mediaListener = (e: MediaQueryListEvent) => {
      const theme = root?.getAttribute('data-theme');
      if (!theme) setIsDark(e.matches);
    };
    matcher.addEventListener('change', mediaListener);

    return () => {
      mutationObserver?.disconnect();
      matcher.removeEventListener('change', mediaListener);
    };
  }, []);

  const src = isDark ? logoSources[version].dark : logoSources[version].light;

  return (
    <div className={styles.logoHolder}>
      <img src={isDark ? logoSources["brioh"].dark : logoSources["brioh"].light} alt={version} className={styles.mainLogo} />
      <img
        src={src}
        alt={version}
        className={styles.icon + " " + styles[version]}
      />
    </div>
  );
};
