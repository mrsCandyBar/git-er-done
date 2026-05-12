
import type { ReactNode } from "react";
import styles from "./Badge.module.scss";

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
  className = ""
}: BadgeProps) {
  return (
    <>
      {variant == "window" && (
        <div className={`${styles.wrapper} ${styles.window} ${styles[type]}`.trim()}>
          <svg viewBox="0 0 150 150" className={styles.curveSvg}>
            <defs>
              <path d="
                M 119, 73 
                a 45,45 0 1,1 -93,0 
                a 45,45 0 1,1 93,0" id="badge-window-subtitle-path" />
            </defs>
            {label && (
              <text className={styles.label}>
                <textPath href="#badge-window-subtitle-path" startOffset={`${labelOffset}%`}>{label}</textPath>
              </text>
            )}
          </svg>
          {icon && <div className={styles.icon}>{icon}</div>}
          {notoIcon && <div className={styles.notoIcon}>{notoIcon}</div>}
        </div>
      )}
      
      {variant == "round" && (
        <div className={`${styles.wrapper} ${styles.round} ${styles[type]}`.trim()}>
          <svg viewBox="0 0 150 150" className={styles.curveSvg}>
            <defs>
              <path d="M 8, 74 
              a 45,45 0 1,0 130,0 
              a 45,45 0 1,0 -130,0" id="badge-label-path" />
              <path d="
                M 130, 74 
                a 45,45 0 1,1 -113,0 
                a 45,45 0 1,1 113,0" id="badge-subtitle-path" />
            </defs>
            {label && (
              <text className={styles.label}>
                <textPath href="#badge-label-path" startOffset={`${labelOffset}%`}>{label}</textPath>
              </text>
            )}
            {subtitle && (
              <text className={styles.subtitle}>
                <textPath href="#badge-subtitle-path" startOffset={`${subtitleOffset}%`}>{subtitle}</textPath>
              </text>
            )}
          </svg>
          {icon && <div className={styles.icon}>{icon}</div>}
          {notoIcon && <div className={styles.notoIcon}>{notoIcon}</div>}
        </div>
      )}

      {variant == "square" && (
        <div className={`${styles.wrapper} ${styles.square} ${styles[type]}`.trim()}>
          {label && <div className={styles.label}>{label}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          {icon && <div className={styles.icon}>{icon}</div>}
          {notoIcon && <div className={styles.notoIcon}>{notoIcon}</div>}
        </div>
      )}

      {variant == "text" && (
        <div className={`${styles.wrapper} ${styles.text} ${styles[type]}`.trim()}>
          
          {label && (
            <svg width={iconWidth} height="120">
              <defs>
                <text id="mainLabel">
                  {label}
                </text>
                <text id="backgroundLabel">
                  {label}
                </text>
              </defs>

              <use x="20" y="80" href="#mainLabel" stroke-width="40" stroke-linejoin="round" className={` ${styles.textStyle} ${styles.mainBorder}`}/>
              <use x="20" y="80" href="#mainLabel" stroke-width="26" stroke-linejoin="round" className={` ${styles.textStyle} ${styles.secondaryBorder}`}/>
              <use x="23" y="73" href="#backgroundLabel" stroke-width="23" stroke-linejoin="round" className={` ${styles.textStyle2} ${styles.mainBackgroundBorder}`}/>
              <use x="20" y="80" href="#mainLabel" className={` ${styles.textStyle} ${styles.mainText}`} />
            </svg>
          )}
        </div>
      )}

      {variant == "icon" && (
        <div className={`${styles.wrapper} ${styles.iconWrapper} ${styles[type]}`.trim()}>
          
          {label && (
            <svg width={iconWidth} height="130">
              <defs>
                <text id="iconLabel">
                  {label}
                </text>
              </defs>

              <use x="20" y="80" href="#iconLabel" stroke-width="40" stroke-linejoin="round" className={` ${styles.textStyle} ${styles.mainBorder}`}/>
              <use x="20" y="80" href="#iconLabel" stroke-width="28" stroke-linejoin="round" className={` ${styles.textStyle} ${styles.secondaryBorder}`}/>
              <use x="20" y="80" href="#iconLabel" className={` ${styles.textStyle} ${styles.mainText}`} />
            </svg>
          )}
        </div>
      )}
    </>
  );
}
