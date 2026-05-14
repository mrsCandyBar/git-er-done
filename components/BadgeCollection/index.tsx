import Text from "../Text";
import styles from "./BadgeCollection.module.scss";
import Badge from "../Badge";

export type BadgeVariant = "round" | "square" | "window" | "text" | "icon";
export type BadgeType = "dark" | "light" | "full";

type BadgeCollectionProps = {
  badgeVariantsForDark?: BadgeVariant[];
  badgeVariantsForFull?: BadgeVariant[];
  badgeTypes?: BadgeType[];
  badgeInfo: any;
};

export default function BadgeCollection({
  badgeVariantsForDark = ["round", "text"],
  badgeVariantsForFull = ["icon", "square"],
  badgeTypes = ["dark", "full"], //"light", 
  badgeInfo = {},
}: BadgeCollectionProps) {

  return (
    <>
        <div>
          <div className={styles.badgeGrid}>
            {badgeTypes.map((type) => 
              (type === "dark" ? badgeVariantsForDark : badgeVariantsForFull).map((variant, key) => (
                <Badge 
                  key={key}
                  type={type}
                  variant={variant}
                  icon={badgeInfo.icon}
                  label={badgeInfo.label}
                  subtitle={badgeInfo.subtitle}
                  color={badgeInfo.color}
                />
              )
            )) }
          </div>
        </div>
      
    </>
  );
}
