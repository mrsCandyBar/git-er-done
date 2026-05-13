
import type { ReactNode } from "react";
import styles from "./Badge.module.scss";
import React from "react";

export type BadgeVariant = "round" | "window" | "square" | "text" | "icon";
export type BadgeType = "dark" | "light" | "color" | "gradient" | "full";

type BadgeProps = {

  icon?: ReactNode;
  notoIcon?: string;
  iconWidth?: number;
  label: ReactNode;
  labelOffset?: number;
  subtitle?: ReactNode;
  subtitleOffset?: number;
  variant?: BadgeVariant;
  type?: BadgeType;
  className?: string;
  color: {
    light?: string;
    dark?: string;
    accent: string;
    contrast: string;
    median: string;
  };
};

export default function Badge({
  icon,
  notoIcon,
  iconWidth,
  label,
  labelOffset = 0,
  subtitle,
  subtitleOffset = 0,
  variant = "square",
  type = "dark",
  className = "",
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
          {icon && <div className={styles.icon} 
            data-colorlight={color?.light} 
            data-colordark={color?.dark} 
            data-coloraccent={color?.accent}
            data-colorcontrast={color?.contrast}
            data-colormedian={color?.median}>{icon}</div>}
          {notoIcon && <div className={styles.notoIcon} 
            data-colorlight={color?.light} 
            data-colordark={color?.dark} 
            data-coloraccent={color?.accent}
            data-colorcontrast={color?.contrast}
            data-colormedian={color?.median}>{notoIcon}</div>}
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
              <path d="M 2, 68 
              a 45,45 0 1,0 130,0 
              a 45,45 0 1,0 -130,0" id="badge-label-path" />
              <path d="
                M 125, 68 
                a 45,45 0 1,1 -113,0 
                a 45,45 0 1,1 113,0" id="badge-subtitle-path" />
            </defs>
            {label && (
              <text 
                className={styles.label}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              ><textPath href="#badge-label-path" startOffset={`${labelOffset}%`}>{label}</textPath></text>
            )}
            {subtitle && (
              <text 
                className={styles.subtitle}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              ><textPath href="#badge-subtitle-path" startOffset={`${subtitleOffset}%`}>{subtitle}</textPath></text>
            )}
          </svg>
          {icon && <div className={styles.icon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{icon}</div>}
          {notoIcon && <div className={styles.notoIcon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{notoIcon}</div>}
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
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{label}</div>}
          {subtitle && <div className={styles.subtitle}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{subtitle}</div>}
          {icon && <div className={styles.icon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{icon}</div>}
          {notoIcon && <div className={styles.notoIcon}
              data-colorlight={color?.light} 
              data-colordark={color?.dark} 
              data-coloraccent={color?.accent}
              data-colorcontrast={color?.contrast}
              data-colormedian={color?.median}
            >{notoIcon}</div>}
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
            <svg width={iconWidth} height="200">
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
                        {line}
                      </text>
                    </defs>

                    <use 
                      x={0 } y={index > 0 ? 40 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      className={` ${styles.textStyle} ${styles.mainBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 } y={index > 0 ? 40 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
                      className={` ${styles.textStyle} ${styles.secondaryBorder} ${styles.hide}`}
                    />
                    <use 
                      x={0 }  y={index > 0 ? 40 * index : 0 } 
                      href={`#mainLabel_${uniqueId}`} 
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
                <text id="iconLabel"
                  data-colorlight={color?.light} 
                  data-colordark={color?.dark} 
                  data-coloraccent={color?.accent}
                  data-colorcontrast={color?.contrast}
                  data-colormedian={color?.median}
                >
                  {label}
                </text>
                <text id="iconLabel2"
                  data-colorlight={color?.light} 
                  data-colordark={color?.dark} 
                  data-coloraccent={color?.accent}
                  data-colorcontrast={color?.contrast}
                  data-colormedian={color?.median}
                >
                  BLAH!
                </text>
              </defs>

              <use 
                x="20" y="80" 
                href="#iconLabel" 
                strokeWidth="40" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.mainBorder}`}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x="20" y="80" 
                href="#iconLabel" 
                strokeWidth="28" 
                strokeLinejoin="round" 
                className={` ${styles.textStyle} ${styles.secondaryBorder}`}
                data-colorlight={color?.light} 
                data-colordark={color?.dark} 
                data-coloraccent={color?.accent}
                data-colorcontrast={color?.contrast}
                data-colormedian={color?.median}
              />
              <use 
                x="20" y="80" 
                href="#iconLabel" 
                className={` ${styles.textStyle} ${styles.mainText}`}
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
