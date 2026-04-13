import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import styles from "./page.module.scss";

type LastActionType = "newUser" | "incompleteProfile" | "completeProfile";

type LastAction = {
  type: LastActionType;
  taskName: string;
  taskHref: string;
};

const lastAction: LastAction = {
  type: "completeProfile",
  taskName: "Candice Bar",
  taskHref: "/current#dance-class-for-beginners",
};

const actionContent: Record<
  LastActionType,
  {
    eyebrow: (taskName?: string) => ReactNode;
    icon: string;
    title: string;
    description?: (taskName: string) => ReactNode;
    primaryLabel: (taskName: string) => string;
    primaryHref: (taskHref: string) => string;
    secondaryLabel?: string;
    secondaryHref?: string;
  }
> = {
  newUser: {
    eyebrow: () => <p>Hello there friend!👋</p>,
    icon: "🏃",
    title: "You're new here, let's get you set up with your first task!",
    primaryLabel: () => "Let's Go!",
    primaryHref: (taskHref) => taskHref
  },
  incompleteProfile: {
    eyebrow: (taskName) => <p>Hello again, {taskName} ✨</p>,
    icon: "🎉",
    title: "Your profile is looking good, let's add a little more info to make it shine.",
    primaryLabel: () => "Tiny step, big mood shift ✨",
    primaryHref: () => "/current",
  },
  completeProfile: {
    eyebrow: () => <p>Achievement Update! 🙌</p>,
    icon: "✨",
    title: "We've added a little something new to your profile...",
    primaryLabel: () => "Give it a look 👀",
    primaryHref: (taskHref) => taskHref,
    secondaryLabel: "Set up progress notifications",
    secondaryHref: "/tasks",
  },
};

export default function Profile() {
  const card = actionContent[lastAction.type];

  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        <article className={`${styles.highlight} ${styles.active}`}>
          <Text as="h4">{card.eyebrow(lastAction.taskName)}</Text>
          <span className={styles.icon} aria-hidden="true">{card.icon}</span>
          <Text as="h2">{card.title}</Text>
          <div className={styles.actions}>
            <Button href={card.primaryHref(lastAction.taskHref)} variant="filled">
              {card.primaryLabel(lastAction.taskName)}
            </Button>
            {card.secondaryLabel && card.secondaryHref && (
              <Button href={card.secondaryHref} variant="ghost">
                {card.secondaryLabel}
              </Button>
            )}
          </div>
        </article>

        {lastAction.type === "newUser" && (
          <>
            <article className={`${styles.highlight}`}>
              <Text as="h3">Inspiration <br/>& Aspirations</Text>
              <Button href="tasks/new" variant="outline">
                  What are you aspiring to do?
              </Button>
              <Text as="p">Make space for what lights you up, what gets you going, what makes you feel accomplished.</Text>
            </article>

            <article className={`${styles.highlight} ${styles.bare}`}>
              <Text as="h2">Profile Complete!</Text>
              <Text tone="secondary">Thank you 🙏</Text>
            </article>
          </>
        )}

        {lastAction.type === "incompleteProfile" && (
          <>
            <article className={`${styles.highlight}`}>
              <Text as="h3">Is this a task manager?</Text>
              <Text as="p">Nope, you don't need one. This is a space to explore your aspirations.</Text>
              <Button href="tasks/new" variant="outline">
                Be more you, friend 🎉
              </Button>
            </article>

            <article className={`${styles.highlight} ${styles.bare}`}>
              <Text as="h2">Profile 75% Complete!</Text>
              <Button href="tasks/new" variant="outline">
                  Unlock your potential 🎉
              </Button>
            </article>
          </>
        )}

        {lastAction.type === "completeProfile" && (
          <>
            <article className={`${styles.highlight}`}>
              <Text as="p"><small>I'm currently inspired by:</small></Text>
              <Text as="h2">Vivienne Westwood</Text>
              <Text as="p">Because, I want to be bold and fearless in my pursuits.</Text>
              <Button href="tasks/new" variant="filled">
                  Track progress 🎉
              </Button>
            </article>

            <article className={`${styles.highlight} ${styles.bare}`}>
              <Text as="h2">Profile 100% Complete!</Text>
              <Button href="tasks/new" variant="filled">
                  Celebrate your wins 🎉
              </Button>
              <Button href="tasks/new" variant="outline">
                  See global impact 🎉
              </Button>
            </article>
          </>
        )}
      </section>
    </div>
  );
}
