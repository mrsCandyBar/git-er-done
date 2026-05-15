
import type { ReactNode } from "react";
import styles from "./Badge.module.scss";
import BadgeIcon from "../BadgeIcon";
import React from "react";

export type BadgeVariant = "round"| "text" | "icon";
export type BadgeType = "outline" | "full";

type BadgeProps = {
  variant?: BadgeVariant;
  type?: BadgeType;
  className?: string;
  icon?: {
    type?: "Noto Color Emoji" | "Noto Emoji";
    value?: string;
    width?: number;
    height?: number;
    textSizes: {
      round: number;
      symbol: number;
    };
  }
  label?: {
    value: string;
    textSticker?: string[];
    offset_round?: number;
    offset_round_full?: number;
    labelWidth?: number;
    labelHeight?: number;
    textSizes: {
      round: number[];
      text: number[];
    }
  }
  subtitle?: {
    value: string;
    offset_round?: number;
    offset_round_full?: number;
    textSizes: {
      round: number[];
    }
  }
  color: {
    accent: string;
    contrast: string;
  };
};

export default function Badge({
  variant = "round",
  type = "outline",
  className = "",
  icon = {
    type: "Noto Emoji",
    value: "😀",
    width: 40,
    height: 40,
    textSizes: {
      round: 10,
      symbol: 10,
    }
  },
  label = {
    value: "You got this!",
    textSticker: ["Keep", "going!"],
    offset_round: 0,
    offset_round_full: 0,
    labelWidth: 0,
    labelHeight: 0,
    textSizes: {
      round: [10, 10],
      text: [10, 10],
    }
  },
  subtitle = {
    value: "Keep going!",
    offset_round: 0,
    offset_round_full: 0,
    textSizes: {
      round: [10, 10],
    }
  },
  color = {
    accent: "#ad4e4e",
    contrast: "#f0d9b0",
  }
}: BadgeProps) {
  const randomIndex = Math.floor(Math.random() * 1000) + 1 
  if (icon && !icon.height) {
    icon.height = icon.width;
  }
  if (label && !label.labelHeight) {
    label.labelHeight = label.labelWidth;
  }

  return (
    <>
      {variant == "round" && (
        <div 
          className={`${styles.wrapper} ${styles.round} ${styles[type]} ${className}`.trim()}
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
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
                data-fontsize={type === "full" ? label.textSizes.round[1] : label.textSizes.round[0]}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              >
                <textPath 
                  href="#badge-label-path" 
                  startOffset={`${type === "full" ? label.offset_round_full : label.offset_round}%`}>
                    {label.value}
                </textPath>
              </text>
            )}
            {subtitle && (
              <text 
                className={styles.subtitle}
                data-fontsize={type === "full" ? subtitle.textSizes.round[1] : subtitle.textSizes.round[0]}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              >
                <textPath 
                  href="#badge-subtitle-path" 
                  startOffset={`${type === "full" ? subtitle.offset_round_full : subtitle.offset_round}%`}>
                    {subtitle.value}
                  </textPath>
                </text>
            )}
          </svg>

          {icon && <div className={`${styles.notoIcon}`}
              data-color-accent={color?.accent}
              data-color-contrast={color?.contrast}
            ><BadgeIcon 
                notoIcon={icon.value} 
                iconWidth={80} 
                iconHeight={80} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={icon.textSizes.round}
                color={{ accent: color?.contrast, contrast: color?.accent }} /></div>}
        </div>
      )}

      {variant == "text" && (
        <div 
          className={`${styles.wrapper} ${styles.text} ${styles[type]} ${className}`.trim()}
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
        >
          {label && label.textSticker && (
            <svg width={label.labelWidth} height={label.labelHeight}>
              <g id={`textGroup_` + randomIndex}>
                {label.textSticker.map((line:string, index:number) => {
                  const randomInt = Math.floor(Math.random() * 1000) + 1;
                  const uniqueId =randomInt + "_" + index;
                  return (
                  <React.Fragment key={uniqueId}>
                    <defs>
                      <text id={`mainLabel_${uniqueId}`}
                        data-color-accent={color?.accent}
                        data-color-contrast={color?.contrast}>
                        {line}
                      </text>
                    </defs>

                    <use 
                      x={0} y={index > 0 ? (38 * index) + 5 : 5 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                      className={` ${styles.textStyle} ${styles.mainBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0} y={index > 0 ? (38 * index) + 5 : 5 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                      className={` ${styles.textStyle} ${styles.secondaryBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0}  y={index > 0 ? (38 * index) + 5 : 5 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
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
                data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                strokeWidth="26" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
            </svg>
          )}
        </div>
      )}

      {variant == "icon" && (
        <div 
          className={`${styles.wrapper} ${styles.iconWrapper} ${styles[type]} ${className}`.trim()}
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
        >  
          {label && (
            <svg width={icon.width} height={icon.height}>
              <defs>
                <text id={`iconLabel_` + randomIndex}
                  data-color-accent={color?.accent}
                  data-color-contrast={color?.contrast}
                >
                  {icon.value}
                </text>
              </defs>

              <use 
                x={icon?.width ? icon.width / 2 - icon.textSizes.symbol / 1.6 : 20} y={icon?.height ? ((icon.height / 1.7) + (icon.textSizes.symbol) / 4.5) : 85}
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="45" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.mainBorder}`}
                data-fontsize={icon.textSizes.symbol}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
              <use 
                x={icon?.width ? icon.width / 2 - icon.textSizes.symbol / 1.6 : 20} y={icon?.height ? ((icon.height / 1.7) + (icon.textSizes.symbol) / 4.5) : 85}
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="30" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={icon.textSizes.symbol}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
              <use 
                x={icon?.width ? icon.width / 2 - icon.textSizes.symbol / 1.6 : 20} y={icon?.height ? ((icon.height / 1.7) + (icon.textSizes.symbol) / 4.5) : 85} 
                href={`#iconLabel_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={icon.textSizes.symbol}
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
              />
            </svg>
          )}
        </div>
      )}
    </>
  );
}
