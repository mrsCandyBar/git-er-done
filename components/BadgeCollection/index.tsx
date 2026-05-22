import Text from "../Text";
import styles from "./BadgeCollection.module.scss";
import Badge from "../Badge";

export type BadgeVariant = "round" | "text" | "icon";
export type BadgeType = "outline" | "full";

type BadgeCollectionProps = {
  badgeVariants?: BadgeVariant[];
  badgeTypes?: BadgeType[];
  badgeInfo: any;
};

export default function BadgeCollection({
  badgeVariants = ["round", "text", "icon"],
  badgeTypes = ["outline", "full"],
  badgeInfo = {},
}: BadgeCollectionProps) {

  return (
    <>
        <div>
          <div className={styles.badgeGrid}>
            {badgeVariants.map((variant, key) => (
                <Badge 
                  key={key}
                  type={variant === "icon" ? "full" : "outline"}
                  variant={variant}
                  icon={badgeInfo.icon}
                  label={badgeInfo.label}
                  subtitle={badgeInfo.subtitle}
                  color={badgeInfo.color}
                />
              )
            )}
          </div>
        </div>
      
    </>
  );
}
