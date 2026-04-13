import type { ReactNode } from "react";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
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
  taskHref: "/task#dance-class-for-beginners",
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
    primaryHref: () => "/task",
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
        <Card
          eyebrow={<Text as="h4">{card.eyebrow(lastAction.taskName)}</Text>}
          icon={card.icon}
          title={<Text as="h2">{card.title}</Text>}
          actions={(
            <>
            <br/>
            <Button href={card.primaryHref(lastAction.taskHref)} variant="filled">
              {card.primaryLabel(lastAction.taskName)}
            </Button>
            <br/>
            </>
          )}
        />

        {lastAction.type === "newUser" && (
          <>
            <Card
              title={<Text as="h2">We're not doing tasking here 🙌</Text>}
              description={<Text as="p">This space is for you to explore your passions and dreams</Text>}
              actions={(
                <Button href={card.secondaryHref} variant="outline">
                  Let's make it happen! 🎉
                </Button>
              )}
            >
              <Text as="h1">🙌</Text>
              <Text as="h3">Inspiration & Aspirations</Text>
              <Text as="p">Make space for what lights you up, what gets you going, what makes you feel accomplished.</Text>
            </Card>
          </>
        )}

        {lastAction.type === "incompleteProfile" && (
          <>
            <Card bare>
              <Text as="h3">Is Brioh a task manager?</Text>
              <Text as="p"><b>Absolutely not!</b> and you don't need one. <br/>This is a space to explore <u>YOUR</u> aspirations at <u>YOUR</u> own pace.</Text>
            </Card>
          </>
        )}
      </section>
    </div>
  );
}
