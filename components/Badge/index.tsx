
import type { ReactNode } from "react";
import styles from "./Badge.module.scss";
import BadgeIcon from "../BadgeIcon";
import React from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";

export type BadgeVariant = "round" | "window" | "square" | "text" | "icon";
export type BadgeType = "dark" | "light" | "color" | "gradient" | "full";

type BadgeProps = {
  notoIcon?: string;
  iconWidth?: number;
  iconHeight?: number;
  label: ReactNode;
  labelOffset?: number;
  labelRoundOffset?: number;
  labelWidth?: number;
  subtitle?: ReactNode;
  subtitleOffset?: number;
  variant?: BadgeVariant;
  type?: BadgeType;
  className?: string;
  fontsizes?: number[];
  fontsubtitlesizes?: number[];
  fontcolorsizes?: number[];
  fontcolorsubtitlesizes?: number[];
  iconfontsizes?: number[];
  iconfontcolorsizes?: number[];
  color: {
    light?: string;
    dark?: string;
    accent: string;
    contrast: string;
    median: string;
  };
};

export default function Badge({
  notoIcon,
  iconWidth,
  iconHeight,
  label,
  labelOffset = 0,
  labelRoundOffset = 0,
  labelWidth = 0,
  subtitle,
  subtitleOffset = 0,
  variant = "square",
  type = "dark",
  className = "",
  fontsizes = [18, 20, 30, 42],
  fontsubtitlesizes = [18, 20],
  fontcolorsizes = [20, 28, 30, 40],
  fontcolorsubtitlesizes = [15, 20],
  iconfontsizes = [65, 80, 70, 70],
  iconfontcolorsizes = [60, 65, 70, 70],
  color = {
    light: "#7c2a2a",
    dark: "#f0d9b0",
    accent: "#ad4e4e",
    contrast: "#f0d9b0",
    median: "#b16b52",
  },
}: BadgeProps) {

  function splitLabel(label: string | ReactNode): string[] | ReactNode {
    console.log("Label:", label, label.split(" "));
    if (typeof label === "string") {
      return label.split(" ");
    }
    return label;
  }

  const randomIndex = Math.floor(Math.random() * 1000) + 1 
  if (!iconHeight) {
    iconHeight = iconWidth;
  }

  return (
    <>
      {variant == "window" && (
        <div 
          className={`${styles.wrapper} ${styles.window} ${styles[type]} ${className}`.trim()} 
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        >
          <svg viewBox="0 0 150 150" className={styles.curveSvg}>
            <defs>
              <path d="
                M 115, 68 
                a 45,45 0 1,1 -93,0 
                a 45,45 0 1,1 93,0" id="badge-window-subtitle-path" />
            </defs>
            {label && (
              <text 
                className={styles.label}
                data-fontsize={type === "full" ? fontcolorsizes[0] : fontsizes[0]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              >
                <textPath href="#badge-window-subtitle-path" startOffset={`${labelOffset}%`}>{label}</textPath>
              </text>
            )}
          </svg>
          {notoIcon && <div className={styles.notoIcon} 
            data-colorlight={color?.light} 
            data-colordark={color?.dark} 
            data-coloraccent={color?.accent}
            data-colorcontrast={color?.contrast}
            data-colormedian={color?.median}>
              <BadgeIcon 
                notoIcon={notoIcon} 
                iconWidth={iconWidth} 
                iconHeight={iconHeight} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? iconfontcolorsizes[0] : iconfontsizes[0]}
                color={color} /></div>}
        </div>
      )}
      
      {variant == "round" && (
        <div 
          className={`${styles.wrapper} ${styles.round} ${styles[type]} ${className}`.trim()}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        >
          <svg viewBox="0 0 150 150" className={styles.curveSvg}>
            <defs>
              <path d="M 4, 69 
              a 45,45 0 1,0 130,0 
              a 45,45 0 1,0 -130,0" id="badge-label-path" />
              <path d="
                M 119, 69 
                a 45,45 0 1,1 -100,0 
                a 45,45 0 1,1 100,0" id="badge-subtitle-path" />
            </defs>
            {label && (
              <text 
                className={styles.label}
                data-fontsize={type === "full" ? fontcolorsizes[1] : fontsizes[1]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              ><textPath href="#badge-label-path" startOffset={`${labelRoundOffset}%`}>{label}</textPath></text>
            )}
            {subtitle && (
              <text 
                className={styles.subtitle}
                data-fontsize={type === "full" ? fontcolorsubtitlesizes[0] : fontsubtitlesizes[0]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              ><textPath href="#badge-subtitle-path" startOffset={`${subtitleOffset}%`}>{subtitle}</textPath></text>
            )}
          </svg>
          {notoIcon && <div className={styles.notoIcon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            ><BadgeIcon 
                notoIcon={notoIcon} 
                iconWidth={iconWidth} 
                iconHeight={iconHeight} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? iconfontcolorsizes[1] : iconfontsizes[1]}
                color={color} /></div>}
        </div>
      )}

      {variant == "square" && (
        <div 
          className={`${styles.wrapper} ${styles.square} ${styles[type]} ${className}`.trim()}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        >
          {label && <div className={styles.label}
              data-fontsize={type === "full" ? fontcolorsizes[2] : fontsizes[2]}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{label}</div>}
          {subtitle && <div className={styles.subtitle}
              data-fontsize={type === "full" ? fontcolorsubtitlesizes[1] : fontsubtitlesizes[1]}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{subtitle}</div>}
          {notoIcon && <div className={styles.notoIcon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            ><BadgeIcon 
                notoIcon={notoIcon} 
                iconWidth={iconWidth} 
                iconHeight={iconHeight} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? iconfontcolorsizes[2] : iconfontsizes[2]}
                color={color} /></div>}
        </div>
      )}

      {variant == "text" && (
        <div 
          className={`${styles.wrapper} ${styles.text} ${styles[type]} ${className}`.trim()}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        >
          {label && (
            <svg width={labelWidth} height="200">
              <g id={`textGroup_` + randomIndex}>
                {label && splitLabel(label).map((line:string, index:number) => {
                  const randomInt = Math.floor(Math.random() * 1000) + 1;
                  const uniqueId =randomInt + "_" + index;
                  return (
                  <React.Fragment key={uniqueId}>
                    <defs>
                      <text id={`mainLabel_${uniqueId}`}

                        data-colorlight={color?.light} 
                        data-colordark={color?.dark} 
                        data-coloraccent={color?.accent}
                        data-colorcontrast={color?.contrast}
                        data-colormedian={color?.median}>
                        {line}{index === splitLabel(label).length - 1 ? "!" : ""}
                      </text>
                    </defs>

                    <use 
                      x={0 } y={index > 0 ? 38 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                      className={` ${styles.textStyle} ${styles.mainBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 } y={index > 0 ? 38 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                      className={` ${styles.textStyle} ${styles.secondaryBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 }  y={index > 0 ? 38 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                      className={` ${styles.textStyle} ${styles.mainText} ${styles.hide}`}
                    />
                  </React.Fragment>
                )})}
              </g>

              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                strokeWidth="40" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.mainBorder}`}
                data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                strokeWidth="26" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={type === "full" ? fontcolorsizes[3] : fontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
            </svg>
          )}
        </div>
      )}

      {variant == "icon" && (
        <div 
          className={`${styles.wrapper} ${styles.iconWrapper} ${styles[type]} ${className}`.trim()}
          data-colorlight={color?.light} 
          data-colordark={color?.dark} 
          data-coloraccent={color?.accent}
          data-colorcontrast={color?.contrast}
          data-colormedian={color?.median}
        >  
          {label && (
            <svg width={iconWidth} height="130">
              <defs>
                <text id={`iconLabel_` + randomIndex}
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
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="40" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.mainBorder}`}
                data-fontsize={iconfontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="28" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={iconfontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={iconfontsizes[3]}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
            </svg>
          )}
        </div>
      )}
    </>
  );
}
