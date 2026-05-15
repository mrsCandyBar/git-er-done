
import styles from "./BadgeIcon.module.scss";

type BadgeProps = {
  notoIcon?: string;
  iconWidth?: number;
  iconHeight?: number;
  fontfamily?: string;
  fontsize?: number;
  color: {
    accent: string;
    contrast: string;
  };
};

export default function BadgeIcon({
  notoIcon,
  iconWidth,
  iconHeight = iconWidth,
  fontfamily = "",
  fontsize = 40,
  color = {
    accent: "#ad4e4e",
    contrast: "#f0d9b0",
  },
}: BadgeProps) {

  const randomIndex = Math.floor(Math.random() * 1000) + 1 
  return (
    <>
      <svg width={iconWidth} height={iconHeight} className={styles.svgHolder}>
        <defs>
          <text id={`iconLabel_` + randomIndex}
            data-fontfamily={fontfamily}
            data-fontsize={fontsize}
            data-color-accent={color?.accent}
            data-colorcontrast={color?.contrast}
          >
            {notoIcon}
          </text>
        </defs>
        <use 
          x={iconWidth / 2 - fontsize / 1.6} y={iconHeight / 1.7 + fontsize / 3} 
          href={`#iconLabel_` + randomIndex} 
          className={` ${styles.textStyle} ${styles.mainText}`}
          data-fontfamily={fontfamily}
          data-fontsize={fontsize}
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
        />
      </svg>
    </>
  );
}
