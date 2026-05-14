
import styles from "./BadgeIcon.module.scss";

type BadgeProps = {
  notoIcon?: string;
  iconWidth?: number;
  iconHeight?: number;
  fontfamily?: string;
  fontsize?: number;
  color: {
    light?: string;
    dark?: string;
    accent: string;
    contrast: string;
    median: string;
  };
};

export default function BadgeIcon({
  notoIcon,
  iconWidth,
  iconHeight = iconWidth,
  fontfamily = "",
  fontsize = 40,
  color = {
    light: "#7c2a2a",
    dark: "#f0d9b0",
    accent: "#ad4e4e",
    contrast: "#f0d9b0",
    median: "#b16b52",
  },
}: BadgeProps) {

  const randomIndex = Math.floor(Math.random() * 1000) + 1 
  return (
    <>
      <svg width={iconWidth} height={iconHeight}>
        <defs>
          <text id={`iconLabel_` + randomIndex}
            data-fontfamily={fontfamily}
            data-fontsize={fontsize}
            data-colorlight={color?.light} 
            data-colordark={color?.dark} 
            data-coloraccent={color?.accent}
            data-colorcontrast={color?.contrast}
            data-colormedian={color?.median}
          >
            {notoIcon}
          </text>
        </defs>
        <use 
          x={iconWidth / 2 - fontsize / 1.6} y={iconHeight / 2 + fontsize / 3}
          href={`#iconLabel_` + randomIndex} 
          strokeWidth="13" 
          strokeLinejoin="round" 
          className={` ${styles.textStyle} ${styles.secondaryBorder}`}
          data-fontfamily={fontfamily}
          data-fontsize={fontsize}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        />
        <use 
          x={iconWidth / 2 - fontsize / 1.6} y={iconHeight / 2 + fontsize / 3} 
          href={`#iconLabel_` + randomIndex} 
          className={` ${styles.textStyle} ${styles.mainText}`}
          data-fontfamily={fontfamily}
          data-fontsize={fontsize}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        />
      </svg>
    </>
  );
}
