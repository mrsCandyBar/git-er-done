import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import { dashboardActionContent, type LastActionType } from "../../../models/actionContent";
import styles from "./page.module.scss";

type LastAction = {
  type: LastActionType;
  taskName: string;
  taskHref: string;
};

const lastAction: LastAction = {
  type: "createdNewTask",
  taskName: "Dance Class for Beginners",
  taskHref: "/task#dance-class-for-beginners",
};

export default function Dashboard() {
  const card = dashboardActionContent[lastAction.type];

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        <Card
          eyebrow={<Text as="h4">{card.eyebrow}</Text>}
          icon={card.icon}
          title={<Text as="h2">{card.title}</Text>}
          description={<Text tone="secondary">{card.description(lastAction.taskName)}</Text>}
          actions={(
            <>
            <Button href={card.primaryHref(lastAction.taskHref)} variant="filled">
              {card.primaryLabel(lastAction.taskName)}
            </Button>
            <Button href={card.secondaryHref} variant="ghost">
              {card.secondaryLabel}
            </Button>
            </>
          )}
        />

        <Card
          bare
          title={<Text as="h3" fullWidth>Found something new, <br/>or something borrowed...</Text>}
          actions={(
            <Button href="tasks/new" variant="outline">
                add that something for us to do 😉
            </Button>
          )}
        />
      </section>
    </div>
  );
}
