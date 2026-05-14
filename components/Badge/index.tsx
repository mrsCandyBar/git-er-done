
import type { ReactNode } from "react";
import styles from "./Badge.module.scss";
import BadgeIcon from "../BadgeIcon";
import React from "react";

export type BadgeVariant = "round" | "window" | "square" | "text" | "icon";
export type BadgeType = "dark" | "light" | "color" | "gradient" | "full";

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
      round: number[];
      window: number[];
      square: number[];
      symbol: number[];
    };
    margin_offset?: {
      round: string;
      window: string;
      square: string;
      symbol: string;
    };
  }
  label?: {
    value: string;
    offset?: number;
    offset_full?: number;
    offset_round?: number;
    offset_round_full?: number;
    labelWidth?: number;
    textSizes: {
      round: number[];
      window: number[];
      square: number[];
      text: number[];
    }
  }
  subtitle?: {
    value: string;
    offset?: number;
    offset_full?: number;
    offset_round?: number;
    offset_round_full?: number;
    textSizes: {
      window: number[];
      round: number[];
      square: number[];
    }
  }
  color: {
    light?: string;
    dark?: string;
    accent: string;
    contrast: string;
    median: string;
  };
};

export default function Badge({
  variant = "square",
  type = "dark",
  className = "",
  icon = {
    type: "Noto Emoji",
    value: "😀",
    width: 40,
    height: 40,
    textSizes: {
      round: [10, 10],
      window: [10, 10],
      square: [10, 10],
      symbol: [10, 10],
    },
    margin_offset: {
      round: "",
      window: "",
      square: "",
      symbol: "",
    }
  },
  label = {
    value: "You got this!",
    offset: 0,
    offset_full: 0,
    offset_round: 0,
    offset_round_full: 0,
    labelWidth: 0,
    textSizes: {
      round: [10, 10],
      window: [10, 10],
      square: [10, 10],
      text: [10, 10],
    }
  },
  subtitle = {
    value: "Keep going!",
    offset: 0,
    offset_full: 0,
    offset_round: 0,
    offset_round_full: 0,
    textSizes: {
      window: [10, 10],
      round: [10, 10],
      square: [10, 10],
    }
  },
  color = {
    light: "#7c2a2a",
    dark: "#f0d9b0",
    accent: "#ad4e4e",
    contrast: "#f0d9b0",
    median: "#b16b52",
  }
}: BadgeProps) {

  function splitLabel(label: string | ReactNode): string[] | ReactNode {
    if (typeof label === "string") {
      return label.split(" ");
    }
    return [label];
  }

  const randomIndex = Math.floor(Math.random() * 1000) + 1 
  if (icon && !icon.height) {
    icon.height = icon.width;
  }

  return (
    <>
      {variant == "window" && (
        <div 
          className={`${styles.wrapper} ${styles.window} ${styles[type]} ${className}`.trim()} 
          data-color-light={color?.light} 
          data-color-dark={color?.dark} 
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
          data-color-median={color?.median}
        >
          <svg viewBox="0 0 150 150" className={styles.curveSvg}>
            <defs>
              <path d="
                M 115, 68 
                a 45,45 0 1,1 -93,0 
                a 45,45 0 1,1 93,0" id="badge-window-subtitle-path" />
            </defs>
            {subtitle && (
              <text 
                className={styles.label}
                data-fontsize={type === "full" ? subtitle.textSizes.window[1] : subtitle.textSizes.window[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              >
                <textPath 
                  href="#badge-window-subtitle-path" 
                  startOffset={`${type === "full" ? subtitle.offset_full : subtitle.offset}%`}>
                    {subtitle.value}
                </textPath>
              </text>
            )}
          </svg>

          {icon && <div className={`${styles.notoIcon} ${icon.margin_offset?.window && styles[icon.margin_offset?.window]}`}
            data-color-light={color?.light} 
            data-color-dark={color?.dark} 
            data-color-accent={color?.accent}
            data-color-contrast={color?.contrast}
            data-color-median={color?.median}>
              <BadgeIcon 
                notoIcon={icon.value} 
                iconWidth={icon.width} 
                iconHeight={icon.height} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? icon.textSizes.window[1] : icon.textSizes.window[0]}
                color={color} /></div>}
        </div>
      )}
      
      {variant == "round" && (
        <div 
          className={`${styles.wrapper} ${styles.round} ${styles[type]} ${className}`.trim()}
          data-color-light={color?.light} 
          data-color-dark={color?.dark} 
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
          data-color-median={color?.median}
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
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
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
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              >
                <textPath 
                  href="#badge-subtitle-path" 
                  startOffset={`${type === "full" ? subtitle.offset_round_full : subtitle.offset_round}%`}>
                    {subtitle.value}
                  </textPath>
                </text>
            )}
          </svg>

          {icon && <div className={`${styles.notoIcon} ${icon.margin_offset?.round && styles[icon.margin_offset?.round]}`}
              data-color-light={color?.light} 
              data-color-dark={color?.dark} 
              data-color-accent={color?.accent}
              data-color-contrast={color?.contrast}
              data-color-median={color?.median}
            ><BadgeIcon 
                notoIcon={icon.value} 
                iconWidth={icon.width} 
                iconHeight={icon.height} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? icon.textSizes.round[1] : icon.textSizes.round[0]}
                color={color} /></div>}
        </div>
      )}

      {variant == "square" && (
        <div 
          className={`${styles.wrapper} ${styles.square} ${styles[type]} ${className}`.trim()}
          data-color-light={color?.light} 
          data-color-dark={color?.dark} 
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
          data-color-median={color?.median}
        >
          {label && <div className={styles.label}
              data-fontsize={type === "full" ? label.textSizes.square[1] : label.textSizes.square[0]}
              data-color-light={color?.light} 
              data-color-dark={color?.dark} 
              data-color-accent={color?.accent}
              data-color-contrast={color?.contrast}
              data-color-median={color?.median}
            >{label.value}</div>}

          {icon && <div className={`${styles.notoIcon} ${icon.margin_offset?.square && styles[icon.margin_offset?.square]}`}
              data-color-light={color?.light} 
              data-color-dark={color?.dark} 
              data-color-accent={color?.accent}
              data-color-contrast={color?.contrast}
              data-color-median={color?.median}
            ><BadgeIcon 
                notoIcon={icon.value} 
                iconWidth={icon.width} 
                iconHeight={icon.height} 
                fontfamily={type == "full" ? "Noto Color Emoji" : "Noto Emoji"}
                fontsize={type == "full" ? icon.textSizes.square[1] : icon.textSizes.square[0]}
                color={color} /></div>}
                
          {subtitle && <div className={styles.subtitle}
              data-fontsize={type === "full" ? subtitle.textSizes.square[1] : subtitle.textSizes.square[0]}
              data-color-light={color?.light} 
              data-color-dark={color?.dark} 
              data-color-accent={color?.accent}
              data-color-contrast={color?.contrast}
              data-color-median={color?.median}
            >{subtitle.value}</div>}
        </div>
      )}

      {variant == "text" && (
        <div 
          className={`${styles.wrapper} ${styles.text} ${styles[type]} ${className}`.trim()}
          data-color-light={color?.light} 
          data-color-dark={color?.dark} 
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
          data-color-median={color?.median}
        >
          {label && (
            <svg width={label.labelWidth} height="200">
              <g id={`textGroup_` + randomIndex}>
                {label?.value && splitLabel(label.value).map((line:string, index:number) => {
                  const randomInt = Math.floor(Math.random() * 1000) + 1;
                  const uniqueId =randomInt + "_" + index;
                  return (
                  <React.Fragment key={uniqueId}>
                    <defs>
                      <text id={`mainLabel_${uniqueId}`}

                        data-color-light={color?.light} 
                        data-color-dark={color?.dark} 
                        data-color-accent={color?.accent}
                        data-color-contrast={color?.contrast}
                        data-color-median={color?.median}>
                        {line}{index == splitLabel(label.value).length - 1 ? "!" : ""}
                      </text>
                    </defs>

                    <use 
                      x={0 } y={index > 0 ? 38 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                      className={` ${styles.textStyle} ${styles.mainBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 } y={index > 0 ? 38 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                      className={` ${styles.textStyle} ${styles.secondaryBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 }  y={index > 0 ? 38 * index : 0 } 
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
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                strokeWidth="26" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
              <use 
                x={20} y={55} 
                href={`#textGroup_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={type === "full" ? label.textSizes.text[1] : label.textSizes.text[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
            </svg>
          )}
        </div>
      )}

      {variant == "icon" && (
        <div 
          className={`${styles.wrapper} ${styles.iconWrapper} ${styles[type]} ${className}`.trim()}
          data-color-light={color?.light} 
          data-color-dark={color?.dark} 
          data-color-accent={color?.accent}
          data-color-contrast={color?.contrast}
          data-color-median={color?.median}
        >  
          {label && (
            <svg width={icon.width} height={icon.height}>
              <defs>
                <text id={`iconLabel_` + randomIndex}
                  data-color-light={color?.light} 
                  data-color-dark={color?.dark} 
                  data-color-accent={color?.accent}
                  data-color-contrast={color?.contrast}
                  data-color-median={color?.median}
                >
                  {icon.value}
                </text>
              </defs>

              <use 
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="40" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.mainBorder}`}
                data-fontsize={type === "full" ? icon.textSizes.symbol[1] : icon.textSizes.symbol[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
              <use 
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                strokeWidth="28" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-fontsize={type === "full" ? icon.textSizes.symbol[1] : icon.textSizes.symbol[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
              <use 
                x="15" y="80" 
                href={`#iconLabel_` + randomIndex} 
                className={` ${styles.textStyle} ${styles.mainText}`}
                data-fontsize={type === "full" ? icon.textSizes.symbol[1] : icon.textSizes.symbol[0]}
                data-color-light={color?.light} 
                data-color-dark={color?.dark} 
                data-color-accent={color?.accent}
                data-color-contrast={color?.contrast}
                data-color-median={color?.median}
              />
            </svg>
          )}
        </div>
      )}
    </>
  );
}
