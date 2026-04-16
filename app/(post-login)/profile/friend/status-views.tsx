import type { ReactNode } from "react";
import Button from "../../../../components/Button";
import Card from "../../../../components/Card";
import Text from "../../../../components/Text";

type StatusCardContent = {
  eyebrow: (profileName?: string) => ReactNode;
  icon: string;
  title: string;
  description?: (profileName: string) => ReactNode;
  primaryLabel: (profileName: string) => string;
  primaryHref: () => string;
};

type SharedViewProps = {
  profileName: string;
  card: StatusCardContent;
};

type FriendNewViewProps = SharedViewProps;

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
              >
              <Text as="h1">💃🏰🚞</Text>
              <Text as="h3">Inspiration & Aspirations</Text>
              <Text as="p" tone="secondary">
                Make space for what lights you up, what gets you going, what makes you feel accomplished.
              </Text>
            </Card>
            
            <Button href={card.primaryHref()} variant="filled">
              {card.primaryLabel(profileName)}
            </Button>
            <br />
          </>
        )}
      />
    </>
  );
}

export function FriendNewView({ profileName, card }: FriendNewViewProps) {
  return (
    <>
      <Card
        eyebrow={<Text as="h4">{card.eyebrow(profileName)}</Text>}
        title={<Text as="h2">{card.title}</Text>}
        actions={(
          <>
            <br/>
             <Text as="p" fullWidth>
              <b>Inspiration</b> can be anything!<br/> 
            </Text>

            <Text as="h1" tone="secondary" fullWidth>
              <big>
               🧙‍♀️🐉 </big>
            </Text>

            <br/>
            <Text as="p" fullWidth>
              <b>Quest</b> do <b>NOT</b> have to be 'big'
            </Text>
            <Text as="h1" tone="secondary" fullWidth>
              🏫_🚗&nbsp;&nbsp; = &nbsp;&nbsp;🏰_🐎
            </Text>
            <Text as="p" fullWidth>
              Taking kids to school <i>(can be)</i> embarking on adventure!
            </Text>

           

            <br/>
            <Text as="h1" tone="secondary">
              <big>💁 = 🦹‍♂️</big>
            </Text>

            <Text as="p" fullWidth>
              Do any quest, <br/>
              big or small, <br/>
              just do it with 🫵 as the hero
            </Text>
            <br/>
            <Button variant="filled" href="/tasks/new">
              {card.primaryLabel(profileName)}
            </Button>
            <br />
          </>
        )}
      />
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