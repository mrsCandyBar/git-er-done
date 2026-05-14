import Text from "../Text";
import styles from "./BadgeCollection.module.scss";
import Badge from "../Badge";

export type BadgeVariant = "round" | "square" | "window" | "text" | "icon";
export type BadgeType = "dark" | "light" | "full";

type BadgeCollectionProps = {
  badgeVariants?: BadgeVariant[];
  badgeTypes?: BadgeType[];
  badgeInfo: any;
};

export default function BadgeCollection({
  badgeVariants = ["window", "round", "square", "text", "icon"],
  badgeTypes = ["dark", "full"], //"light", 
  badgeInfo = {},
}: BadgeCollectionProps) {

  return (
    <>
      {badgeTypes.map((type) => (
        <div key={type}>
          <Text as="h3">{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          <div className={styles.badgeGrid}>
            {badgeVariants.map((variant) => (
              <Badge 
                type={type}
                variant={variant}
                notoIcon={badgeInfo.notoIcon}
                label={badgeInfo.label}
                labelOffset={badgeInfo.labelOffset}
                labelRoundOffset={badgeInfo.labelRoundOffset}
                labelWidth={badgeInfo.labelWidth}
                subtitle={badgeInfo.subtitle}
                subtitleOffset={badgeInfo.subtitleOffset}
                iconWidth={badgeInfo.iconWidth}
                color={badgeInfo.color}
                fontsizes={badgeInfo.fontsizes}
                fontsubtitlesizes={badgeInfo.fontsubtitlesizes}
                fontcolorsizes={badgeInfo.fontcolorsizes}
                fontcolorsubtitlesizes={badgeInfo.fontcolorsubtitlesizes}
                iconfontsizes={badgeInfo.iconfontsizes}
                iconfontcolorsizes={badgeInfo.iconfontcolorsizes}
              />
            ))}
          </div>
        </div>
      )) }
    </>
  );
}
