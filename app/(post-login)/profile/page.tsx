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
    title: "Your profile is looking good, let's add a little more to make it shine.",
    primaryLabel: () => "Tiny step, big mood shift ✨",
    primaryHref: () => "/current",
  },
  completeProfile: {
    eyebrow: () => <p>Profile Complete! 💯!!!</p>,
    icon: "✨",
    title: "Thank you for sharing a bit about yourself 🎉 Here's a little 🎁 for you",
    primaryLabel: () => "Accept Gift 👀",
    primaryHref: (taskHref) => taskHref,
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
            <br/>
            <Button href={card.primaryHref(lastAction.taskHref)} variant="filled">
              {card.primaryLabel(lastAction.taskName)}
            </Button>
            <br/>
          </div>
        </article>

        {lastAction.type === "newUser" && (
          <>
            <article className={`${styles.highlight} ${styles.active}`}>
              <Text as="h2">We're not doing tasking here 🙌</Text>
              <Text as="p">This space is for you to explore your passions and dreams</Text>
              <Text as="h1">🙌</Text>
              <Text as="h3">Inspiration & Aspirations</Text>
              <Text as="p">Make space for what lights you up, what gets you going, what makes you feel accomplished.</Text>

              <Button href={card.secondaryHref} variant="outline">
                Let's make it happen! 🎉
              </Button>
            </article>
          </>
        )}

        {lastAction.type === "incompleteProfile" && (
          <>
            <article className={`${styles.highlight} ${styles.active} ${styles.bare}`}>
              <Text as="h3">Is Brioh a task manager?</Text>
              <Text as="p"><b>Absolutely not!</b> and you don't need one. <br/>This is a space to explore <u>YOUR</u> aspirations at <u>YOUR</u> own pace.</Text>
            </article>
          </>
        )}
      </section>
    </div>
  );
}
