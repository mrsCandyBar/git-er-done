'use client';

import { useState } from "react";
import { faCircleCheck, faClock, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { 
  Header, Footer, Button, Badge, Input, Form, Text, InfoChip, Accordion,
  Card, CardStack, Modal, ConfettiButton, Tabs, ToastRegion, useToastSystem,
  Logo,
  BadgeCollection
} from "@/components/index";
import ScatteredCardStack from "@/components/CardStack/ScatteredCardStack";
import StyleguideThemeToggle from "@/components/StyleguideThemeToggle";
import styles from "./page.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { text } from "stream/consumers";

export default function Styleguide() {
  const [showClosableCard, setShowClosableCard] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, pushToast, dismissToast } = useToastSystem();

  return (
    <div className={styles.page}>
      <Header />

      <main id="styleguide-root" className={styles.wrapper}>
        <section className={styles.section}>
          <Text as="h1">Styleguide</Text>
          <Text as="p" tone="secondary">
            This page showcases baseline native HTML elements for quick visual checks while building new
            UI.
          </Text>
        </section>

        <section className={styles.fixedSection}>
          <Text as="h2">Theme Preview</Text>
          <Text as="p" tone="secondary" className={styles.helperText}>
            Toggle this page between light and dark previews without changing your system appearance.
          </Text>
          <div className={styles.row}>
            <StyleguideThemeToggle targetId="root" />
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Text Elements</Text>
          <div className={styles.stack}>
            <Text as="h1">Heading 1</Text>
            <Text as="h2">Heading 2</Text>
            <Text as="h3">Heading 3</Text>
            <Text as="h4">Heading 4</Text>
            <Text as="p" tone="secondary">
              The quick brown fox jumps over the lazy dog. This sample paragraph helps validate body
              copy readability, spacing, and line length.
            </Text>
            <Text as="p" tone="secondary">
              This project uses shared typography and spacing tokens, so this section is a useful smoke
              test after global style changes. 
               <Text as="strong"> Bold text</Text> and <Text as="em">italic text to the 'nth degrees</Text> can be composed
              inline through the same component.
            </Text>
            <br/>

            

            <Text as="a" href="https://nextjs.org/docs" target="_blank" rel="noreferrer noopener">
              Link text example
            </Text>

            <Text as="blockquote" tone="secondary">
              This is block text for callouts, quotes, and notes that need a little extra emphasis. 
              This project uses shared typography and spacing tokens, so this section is a useful smoke
              test after global style changes. <span>- Written by Me on 2026/05/13</span>
            </Text>
            <Text as="ul">
              <Text as="li" tone="secondary">Unordered and ordered list items looks the same one</Text>
              <Text as="li" tone="secondary">Unordered list item, same as above two</Text>
              <Text as="li" tone="secondary">Unordered list item three. 
                &nbsp;<Text as="a" href="https://nextjs.org/docs" target="_blank" rel="noreferrer noopener">
                  Link text example
                </Text>
              </Text>
            </Text>
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Buttons</Text>
          <div className={styles.row}>
            <Button type="button" variant="filled">
              Filled
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
            <Button type="button" variant="ghost">
              Ghost
            </Button>
          </div>
          <br/>
          
          <Text as="h3">State Preview</Text>
          <div className={styles.row}>
            <Button type="button" variant="filled">
              Default
            </Button>
            <Button type="button" variant="filled" className={styles.previewHover}>
              Hover
            </Button>
            <Button type="button" variant="filled" className={styles.previewActive}>
              Active
            </Button>
            <Button type="button" variant="filled" className={styles.previewFocus}>
              Focus
            </Button>
            <Button type="button" variant="filled" disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Badges</Text>
          <Text as="p" tone="secondary">
            Reusable motivational and reward badges. <br/>
            Mix variants to fit context and mood.
          </Text>
          <br/>
          
          <BadgeCollection badgeInfo={{ 
            icon: {
              value: "🛹",
              width: 130,
              height: 105,
              textSizes: {
                round: 75,
                symbol: 70,
              },
            },
            label: {
              value: "Keep going",
              textSticker: ["Keep", "going!"],
              offset_round: 5,
              offset_round_full: 0,
              labelWidth: 165,
              labelHeight: 135,
              textSizes: {
                round: [30, 19],
                text: [42, 45],
              }
            },
            subtitle: {
              //value: "You got this!",
              value: "✪ ✦ ✶ ✦ ✪ ✦ ",
              offset_round: 48,
              offset_round_full: 60,
              textSizes: {
                round: [20, 17],
              }
            },
            color: {
              accent: "#f0d9b0",
              contrast: "#ad4e4e",
            }
          }}/>
          <br/>

          <BadgeCollection badgeInfo={{ 
            icon: {
              value: "🏆",
              width: 120,
              height: 120,
              textSizes: {
                round: 55,
                symbol: 70,
              }
            },
            label: {
              value: "Got'it Done",
              textSticker: ["Got'it", "Done!"],
              offset_round: 5,
              offset_round_full: 11,
              labelWidth: 180,
              labelHeight: 125,
              textSizes: {
                round: [29, 25],
                text: [50, 49],
              }
            },
            subtitle: {
              value: "congratulations!",
              offset_round: 50,
              offset_round_full: 53,
              textSizes: {
                round: [13, 20],
              }
            },
            color: {
              accent: "#bd8c44",
              contrast: "#203044",
            }
          }}/>
          <br/>

          <BadgeCollection badgeInfo={{ 
            icon: {
              value: "💖",
              width: 135,
              height: 130,
              textSizes: {
                round: 55,
                symbol: 80,
              }
            },
            label: {
              value: "Love✦Love✶Love",
              textSticker: ["love*", "✶love", " love✦"],
              offset_round: 3,
              offset_round_full: 0,
              labelWidth: 200,
              labelHeight: 160,
              textSizes: {
                round: [32, 37],
                text: [50, 50],
              }
            },
            subtitle: {
              value: "★",
              offset_round: 47,
              offset_round_full: 2,
              textSizes: {
                round: [25, 0],
              }
            },
            color: {
              accent: "#5a6980",
              contrast: "#e097bf",
            }
          }}/>

          <br/>

          <BadgeCollection badgeInfo={{ 
            icon: {
              value: "🎂",
              width: 120,
              height: 140,
              textSizes: {
                round: 70,
                symbol: 90,
              }
            },
            label: {
              value: "It's Your Birthday",
              textSticker: ["Hej!☺", "It's your", "Birthday!"],
              offset_round: -56,
              offset_round_full: 0,
              labelWidth: 260,
              labelHeight: 170,
              textSizes: {
                round: [31, 29],
                text: [50, 50],
              }
            },
            subtitle: {
              value: "Go shorty! it's yo'",
              offset_round: 55,
              offset_round_full: 2,
              textSizes: {
                round: [16, 0],
              }
            },
            color: {
              accent: "#e6af2e",
              contrast: "#a52243",
            }
          }}/>

          
        </section>

        <section className={styles.section}>
          <Text as="h2">Input Fields</Text>
          <br/>

          <div className={styles.stack}>
            <Input label="Text Input" type="text" placeholder="Type here" />
            <Input label="Number Input" type="number" placeholder="0" />
            <Input label="Password Input" type="password" placeholder="••••••" />
            <Input label="Email Input" type="email" placeholder="name@example.com" />
            <div className={styles.selectWrapper}>
              <label htmlFor="select-input">Select</label>
              <select id="select-input" className={styles.select}>
                <option value="">Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <Input label="Textarea" isTextarea placeholder="Write a longer note here..." />

            <Input
              label="Checkboxes"
              type="checkbox"
              name="interests"
              options={[
                { value: "design", label: "Get started on Design" },
                { value: "development", label: "Get started on Development" },
                { value: "writing", label: "Get started on Writing" },
              ]}
            />
            <br/>

            <Input
              label="Radio Buttons"
              type="radio"
              name="preference"
              options={[
                { value: "light", label: "Light Mode" },
                { value: "dark", label: "Dark Mode" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Form Example</Text>
          <br/>

          <Form
            fields={[
              {
                name: "full_name",
                label: "Full Name",
                type: "text",
                placeholder: "Alex Doe",
                required: true,
              },
              {
                name: "message",
                label: "Message",
                type: "textarea",
                placeholder: "Write a short note",
                rows: 4,
              },
            ]}
            submitLabel="Submit"
            onSubmit={(data) => console.log("Form submitted:", data)}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Form Component</Text>
          <Text as="p" tone="secondary">
            The Form component auto-generates fields from a configuration array, reducing boilerplate for new forms.
          </Text>
          <br/>

          <Form
            fields={[
              {
                name: "username",
                label: "Username",
                type: "text",
                placeholder: "john_doe",
                required: true,
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "john@example.com",
                required: true,
              },
              {
                name: "role",
                label: "Role",
                type: "select",
                options: [
                  { value: "user", label: "User" },
                  { value: "admin", label: "Administrator" },
                  { value: "moderator", label: "Moderator" },
                ],
              },
              {
                name: "bio",
                label: "Bio",
                type: "textarea",
                placeholder: "Tell us about yourself...",
                rows: 3,
              },
            ]}
            submitLabel="Create Account"
            onSubmit={(data) => console.log("Form submitted:", data)}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Form with Checkboxes and Radio Buttons</Text>
          <Text as="p" tone="secondary">
            Forms can include checkbox groups for multiple selections and radio buttons for single selection.
          </Text>
          <br/>

          <Form
            fields={[
              {
                name: "interests",
                label: "Your Interests",
                type: "checkbox",
                options: [
                  { value: "design", label: "Totally interested in Design" },
                  { value: "development", label: "Totally interested in Development" },
                  { value: "writing", label: "Totally interested in Writing" },
                  { value: "marketing", label: "Totally interested in Marketing" },
                ],
              },
              {
                name: "theme_preference",
                label: "Theme Preference",
                type: "radio",
                options: [
                  { value: "light", label: "Light Mode" },
                  { value: "dark", label: "Dark Mode" },
                  { value: "auto", label: "Auto (System)" },
                ],
              },
            ]}
            submitLabel="Save Preferences"
            onSubmit={(data) => console.log("Preferences saved:", data)}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Form with Validation Errors</Text>
          <Text as="p" tone="secondary">
            The Form component supports error messages that display below each field.
          </Text>
          <br/>

          <Form
            fields={[
              {
                name: "email",
                label: "Email",
                type: "email",
                placeholder: "john@example.com",
                required: true,
                error: "Please enter a valid email address",
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "••••••",
                required: true,
                error: "Password must be at least 8 characters",
              },
            ]}
            submitLabel="Try Again"
            onSubmit={(data) => console.log("Form submitted:", data)}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Info Chips</Text>
          <div className={styles.row}>
            <InfoChip label="Draft" />
            <InfoChip label="In Review" />
            <InfoChip label="Published" />
            <InfoChip label="Approved" icon={faCircleCheck} />
            <InfoChip label="Pending" icon={faClock} />
            <InfoChip label="Blocked" icon={faTriangleExclamation} />
            <InfoChip label="Waiting Approval" icon={faClock} variant="outline" />
            <InfoChip label="Priority" icon={faCircleCheck} variant="bright" />
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Cards</Text>
          <Text as="p" tone="secondary">
            Card content is fully optional. Use only the blocks you need for each scenario.
          </Text>
          <br/>

          <div className={styles.cardGrid}>
            <Card
              title="Weekly Planning"
              description="Review active tasks, set priorities, and share updates with your team."
              imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
              imageDescription="Open notebook on a desk used for weekly planning notes"
              ctaLabel="Open Board"
              ctaHref="/tasks/task"
            />
            <br/>

            {showClosableCard ? (
              <Card
                title="Temporary Notice"
                description="This card demonstrates the optional close button behavior."
                showCloseButton
                onClose={() => setShowClosableCard(false)}
                ctaLabel="Dismiss"
                onCtaClick={() => setShowClosableCard(false)}
              />
            ) : (
              <Card
                title="Card Closed"
                description="The close button removed the previous card."
                ctaLabel="Restore"
                onCtaClick={() => setShowClosableCard(true)}
              />
            )}
            <br/>

            <Card title="Title Only" fullWidth />
            <br/>
            <br/>

          </div>

          <Text as="h3">Card Stack</Text>
          <Text as="p" tone="secondary">
            Cards fan out like they&apos;re resting on a table. Dismiss each card to flick it away — once the last one is gone, restore them all or swap in new ones.
          </Text>
          <CardStack
            emptyLabel="Bring Back Cards"
            emptyDescription="All cards dismissed. Restore them or bring in something new."
            cards={[
              {
                title: "Card One",
                description: "Swipe me away when you&apos;re done.",
                ctaLabel: "Open",
              },
              {
                title: "Card Two",
                description: "Dismiss the top card to reveal me.",
                ctaLabel: "Open",
              },
              {
                title: "Card Three",
                description: "The last card. Bye!",
                ctaLabel: "Open",
              },
            ]}
          />
          <br/>

          <Text as="h3">Scattered Card Stack</Text>
          <Text as="p" tone="secondary">
            Cards appear scattered within a wide area, not stacked. Still swipe to dismiss!
          </Text>
          <ScatteredCardStack
            emptyLabel="Restore Cards"
            emptyDescription="All cards dismissed. Restore them or bring in something new."
            cards={[
              {
                title: "Card One",
                description: "Swipe me away when you&apos;re done.",
                ctaLabel: "Open",
              },
              {
                title: "Card Two",
                description: "Dismiss the top card to reveal me.",
                ctaLabel: "Open",
              },
              {
                title: "Card Three",
                description: "The last card. Bye!",
                ctaLabel: "Open",
              },
              {
                title: "Card Two",
                description: "Dismiss the top card to reveal me.",
                ctaLabel: "Open",
              }
            ]}
          />
          <br/>
        </section>

        <section className={styles.section}>
          <Text as="h2">Modal</Text>
          <Text as="p" tone="secondary">
            Reusable modal with overlay close, escape close, and optional action buttons.
          </Text>
          <div className={styles.row}>
            <Button type="button" variant="filled" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Share Update"
            description="Post a quick progress note to your team before ending the session."
            closeLabel="Cancel"
            primaryActionLabel="Share"
            onPrimaryAction={() => setIsModalOpen(false)}
          >
            <Input label="Update" isTextarea rows={4} placeholder="What changed today?" />
          </Modal>
        </section>

        <section className={styles.section}>
          <Text as="h2">Toasts / Notifications</Text>
          <Text as="p" tone="secondary">
            Trigger contextual notifications that auto-dismiss after a short delay.
          </Text>
          <div className={styles.row}>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                pushToast({
                  variant: "success",
                  title: "Saved",
                  description: "Your profile settings were updated.",
                })
              }
            >
              Success Toast
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                pushToast({
                  variant: "info",
                  title: "Info",
                  description: "A new comment was added to your task.",
                })
              }
            >
              Info Toast
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                pushToast({
                  variant: "warning",
                  title: "Warning",
                  description: "Storage space is running low.",
                })
              }
            >
              Warning Toast
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                pushToast({
                  variant: "error",
                  title: "Error",
                  description: "Could not sync your latest changes.",
                })
              }
            >
              Error Toast
            </Button>
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Confetti</Text>
          <Text as="p" tone="secondary">
            A short celebratory confetti burst for wins, completions, and milestone moments.
          </Text>
          <div className={styles.row}>
            <ConfettiButton
              onClick={() =>
                pushToast({
                  variant: "success",
                  title: "Saved",
                  description: "Your action completed successfully.",
                })
              }
            />
            <ConfettiButton
              label="More Confetti"
              burstCount={3}
              onClick={() =>
                pushToast({
                  variant: "info",
                  title: "Queued",
                  description: "Your request has been queued.",
                })
              }
            />
            <ConfettiButton
              label="More Confetti (Delayed)"
              burstCount={3}
              minBurstDelayMs={200}
              maxBurstDelayMs={400}
              burstPattern="finale"
              onClick={() =>
                pushToast({
                  variant: "warning",
                  title: "Review",
                  description: "Your change needs one final review.",
                })
              }
            />
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Tabs</Text>
          <Text as="p" tone="secondary">
            Use tabs to switch between related content views without leaving the page.
          </Text>
          <Tabs
            items={[
              {
                id: "overview",
                label: "Overview",
                content: (
                  <Text as="p" tone="secondary">
                    This area can summarize the task state, latest updates, and next priorities.
                  </Text>
                ),
              },
              {
                id: "activity",
                label: "Activity",
                content: (
                  <Text as="ul" tone="secondary">
                    <Text as="li">Alex updated the project timeline</Text>
                    <Text as="li">Sam left feedback on the profile flow</Text>
                    <Text as="li">Jordan closed two completed tasks</Text>
                  </Text>
                ),
              },
              {
                id: "notes",
                label: "Notes",
                content: (
                  <Text as="p" tone="secondary">
                    Keep implementation notes, follow-ups, and links to docs in this view.
                  </Text>
                ),
              },
            ]}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Accordion</Text>
          <Text as="p" tone="secondary">
            Accordions help collapse larger content blocks while keeping the page scannable.
          </Text>
          <Accordion
            allowMultiple
            defaultOpenIds={["faq-1"]}
            items={[
              {
                id: "faq-1",
                title: "How do I create a new task?",
                content: (
                  <Text as="p" tone="secondary">
                    Open the task page, fill out the form fields, and submit to add a task.
                  </Text>
                ),
              },
              {
                id: "faq-2",
                title: "Can I edit existing tasks?",
                content: (
                  <Text as="p" tone="secondary">
                    Yes. Select a task from your list, update the details, and save changes.
                  </Text>
                ),
              },
              {
                id: "faq-3",
                title: "How are priorities handled?",
                content: (
                  <Text as="p" tone="secondary">
                    Priorities can be represented using chips, labels, or custom sorting rules.
                  </Text>
                ),
              },
            ]}
          />
        </section>

        <section className={styles.section}>
          <Text as="h2">Logos</Text>
          <Text as="p" tone="secondary">
            Logos represent the brand visually and should be used consistently across the application.
          </Text>
          <br/>
          
          <Logo version="brioh-card" />
          <Text as="p">brioh-card is used for Quest based features.</Text>
          <br/>

          <Logo version="brioh-heart" />
          <Text as="p">brioh-heart represents user favourite engagement. The fun quest</Text>
          <br/>
        
          <Logo version="brioh-star" />
          <Text as="p">brioh-star represents achievements and milestones. New curious users can explore their progress.</Text>
          <br/>
          <br/>

        </section>
      </main>

      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
      <Footer activePage="styleguide" />
    </div>
  );
}
