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
  type: "startedNewTask",
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
    secondaryLabel: "Raincheck! Try another",
    secondaryHref: "/tasks",
  },
  completedTask: {
    eyebrow: "Got her done! 💪",
    icon: "🎉",
    title: "Boom. You got this! Last time you nailed",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Let’s make it happen again ✨",
    primaryHref: () => "/current",
    secondaryLabel: "Let's make another!",
    secondaryHref: "/tasks/new",
  },
  createdNewTask: {
    eyebrow: "Ready to roll! 🙌",
    icon: "✨",
    title: "We added a little something new...",
    description: (taskName) => <strong>{taskName}</strong>,
    primaryLabel: () => "Give it a look 👀",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Let's pick a task",
    secondaryHref: "/tasks",
  },
};

export default function Dashboard() {
  const card = actionContent[lastAction.type];

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        <article className={`${styles.highlight} ${styles.active}`}>
          <Text as="h4">{card.eyebrow}</Text>
          <span className={styles.icon} aria-hidden="true">{card.icon}</span>
          <Text as="h2">{card.title}</Text>
          <Text tone="secondary">{card.description(lastAction.taskName)}</Text>
          <div className={styles.actions}>
            <Button href={card.primaryHref(lastAction.taskHref)} variant="filled">
              {card.primaryLabel(lastAction.taskName)}
            </Button>
            <Button href={card.secondaryHref} variant="ghost">
              {card.secondaryLabel}
            </Button>
          </div>
        </article>

        <article className={`${styles.highlight} ${styles.placeholder}`}>
          <Text as="h3">Something new, something borrowed...</Text>
          <Button href="tasks/new" variant="outline">
              Something new for us to do 😉
          </Button>
        </article>

        <article className={`${styles.highlight} ${styles.placeholder}`}>
          <Text as="h2">3 Tasks Completed!</Text>
          <Text tone="secondary">Go you 🎉</Text>
        </article>
      </section>
    </div>
  );
}
