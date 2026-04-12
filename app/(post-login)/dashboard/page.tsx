import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import styles from "./page.module.scss";

type LastActionType = "startedNewTask" | "completedTask" | "createdNewTask";

type LastAction = {
  type: LastActionType;
  taskName: string;
  taskHref: string;
};

const lastAction: LastAction = {
  type: "createdNewTask",
  taskName: "Dance Class for Beginners",
  taskHref: "/current#dance-class-for-beginners",
};

const actionContent: Record<
  LastActionType,
  {
    eyebrow: string;
    icon: string;
    title: string;
    description: (taskName: string) => ReactNode;
    primaryLabel: (taskName: string) => string;
    primaryHref: (taskHref: string) => string;
    secondaryLabel: string;
    secondaryHref: string;
  }
> = {
  startedNewTask: {
    eyebrow: "You got this! 🚀",
    icon: "🏃",
    title: "Shall we kick off where we last dropped off?",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Let's Go!",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Skip for now, no pressure",
    secondaryHref: "/current",
  },
  completedTask: {
    eyebrow: "Got her done! 💪",
    icon: "🎉",
    title: "Boom. You got this! Last time you were here, you nailed",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Let’s make it happen again ✨",
    primaryHref: () => "/current",
    secondaryLabel: "Add another task?",
    secondaryHref: "/profile",
  },
  createdNewTask: {
    eyebrow: "Freshly baked and ready to roll! 🙌",
    icon: "✨",
    title: "We added a little something new",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Give it a look 👀",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Let's start something new!",
    secondaryHref: "/current",
  },
};

export default function Dashboard() {
  const content = actionContent[lastAction.type];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <article className={styles.highlight}>
          <Text as="h4">{content.eyebrow}</Text>
          <br/>
          <span className={styles.icon} aria-hidden="true">{content.icon}</span>
          <Text as="h2">{content.title}</Text>
          <Text tone="secondary">{content.description(lastAction.taskName)}</Text>
          <br/>
          
          <div className={styles.actions}>
            <Button href={content.primaryHref(lastAction.taskHref)} variant="filled">
              {content.primaryLabel(lastAction.taskName)}
            </Button>
            <Button href={content.secondaryHref} variant="ghost">
              {content.secondaryLabel}
            </Button>
          </div>
        </article>
      </section>
    </div>
  );
}
