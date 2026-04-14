import type { ReactNode } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Text from "../../../../components/Text";

type StatusCardContent = {
  eyebrow: (profileName?: string) => ReactNode;
  icon: string;
  title: string;
  primaryLabel: (profileName: string) => string;
  primaryHref: () => string;
};

type SharedViewProps = {
  profileName: string;
  card: StatusCardContent;
};

type FriendNewViewProps = SharedViewProps & {
  onOpenUpdateProfile: () => void;
};

type FriendDearViewProps = SharedViewProps & {
  onAcceptGift: () => void;
};

export function FriendView({ profileName, card }: SharedViewProps) {
  return (
    <>
      <Card
        eyebrow={<Text as="h4">{card.eyebrow(profileName)}</Text>}
        icon={card.icon}
        title={<Text as="h2">{card.title}</Text>}
        actions={(
          <>
            <br />
            <Button href={card.primaryHref()} variant="filled">
              {card.primaryLabel(profileName)}
            </Button>
            <br />
          </>
        )}
      />

      <Card
        bare
        title={
          <>
            <br />
            <Text as="h3" fullWidth>
              We&apos;re not doing <i>&apos;tasking&apos;</i> here
            </Text>
          </>
        }
        description={<Text as="p" tone="secondary">This space is for you to explore your passions and dreams</Text>}
        actions={(
          <>
            <Button href={card.primaryHref()} variant="filled">
              Let&apos;s make it happen! 🎉
            </Button>
            <br />
          </>
        )}
      >
        <Text as="h1">💃🏰🚞</Text>
        <Text as="h3">Inspiration & Aspirations</Text>
        <Text as="p" tone="secondary">
          Make space for what lights you up, what gets you going, what makes you feel accomplished.
        </Text>
      </Card>
    </>
  );
}

export function FriendNewView({ profileName, card, onOpenUpdateProfile }: FriendNewViewProps) {
  return (
    <>
      <Card
        eyebrow={<Text as="h4">{card.eyebrow(profileName)}</Text>}
        icon={card.icon}
        title={<Text as="h2">{card.title}</Text>}
        actions={(
          <>
            <br />
            <Button variant="filled" onClick={onOpenUpdateProfile}>
              {card.primaryLabel(profileName)}
            </Button>
            <br />
          </>
        )}
      />

      <Card bare>
        <Text as="h3">Is Brioh a task manager?</Text>
        <Text as="h1">🙈🙉🙊</Text>
        <Text as="p">
          <b>Absolutely not!</b> because 🫵 don&apos;t need one. <br />This is a space to explore 👏<b><u>your</u></b>
          👏 aspirations 🦄
        </Text>
      </Card>
    </>
  );
}

export function FriendDearView({ profileName, card, onAcceptGift }: FriendDearViewProps) {
  return (
    <Card
      eyebrow={<Text as="h4">{card.eyebrow(profileName)}</Text>}
      icon={card.icon}
      title={<Text as="h2">{card.title}</Text>}
      actions={(
        <>
          <br />
          <Text as="p" tone="secondary">
            It&apos;s not easy to be this open and vulnerable, but you did it! <br />
            This 🎁 is to show you the impact of your journey thus far.<br />
            We&apos;re honored to be a part of your story.
          </Text>

          <br />
          <Button variant="filled" onClick={onAcceptGift}>
            {card.primaryLabel(profileName)}
          </Button>
          <br />
        </>
      )}
    />
  );
}