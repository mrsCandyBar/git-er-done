'use client';

import { useState } from "react";
import { faCircleCheck, faClock, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Form from "../../../components/Form";
import Text from "../../../components/Text";
import InfoChip from "../../../components/InfoChip";
import Card from "../../../components/Card";
import CardStack from "../../../components/CardStack";
import Modal from "../../../components/Modal";
import ConfettiButton from "../../../components/ConfettiButton";
import Tabs from "../../../components/Tabs";
import Accordion from "../../../components/Accordion";
import ToastRegion from "../../../components/Toast";
import { useToastSystem } from "../../../components/Toast/useToast";
import StyleguideThemeToggle from "../../../components/StyleguideThemeToggle";
import styles from "./page.module.scss";

export default function Styleguide() {
  const [showClosableCard, setShowClosableCard] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, pushToast, dismissToast } = useToastSystem();

  return (
    <>
      <Header />
      <main id="styleguide-root" className={styles.wrapper}>
        <section className={styles.section}>
          <Text as="h1">Styleguide</Text>
          <Text as="p" tone="secondary">
            This page showcases baseline native HTML elements for quick visual checks while building new
            UI.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2">Theme Preview</Text>
          <Text as="p" tone="secondary" className={styles.helperText}>
            Toggle this page between light and dark previews without changing your system appearance.
          </Text>
          <div className={styles.row}>
            <StyleguideThemeToggle targetId="styleguide-root" />
          </div>
        </section>

        <section className={styles.section}>
          <Text as="h2">Text Elements</Text>
          <div className={styles.stack}>
            <Text as="h1">Heading 1</Text>
            <Text as="h2">Heading 2</Text>
            <Text as="h3">Heading 3</Text>
            <Text as="h4">Heading 4</Text>
            <Text as="h5">Heading 5</Text>
            <Text as="h6">Heading 6</Text>
            <Text as="p" tone="secondary">
              The quick brown fox jumps over the lazy dog. This sample paragraph helps validate body
              copy readability, spacing, and line length.
            </Text>
            <Text as="p" tone="secondary">
              This project uses shared typography and spacing tokens, so this section is a useful smoke
              test after global style changes.
            </Text>
            <Text as="p">
              <Text as="strong">Bold text</Text> and <Text as="em">italic text</Text> can be composed
              inline through the same component.
            </Text>
            <Text as="blockquote" tone="secondary">
              This is block text for callouts, quotes, and notes that need a little extra emphasis.
            </Text>
            <Text as="ul">
              <Text as="li">Unordered list item one</Text>
              <Text as="li">Unordered list item two</Text>
              <Text as="li">Unordered list item three</Text>
            </Text>
            <Text as="ol">
              <Text as="li">Ordered list item one</Text>
              <Text as="li">Ordered list item two</Text>
              <Text as="li">Ordered list item three</Text>
            </Text>
            <Text as="a" href="https://nextjs.org/docs" target="_blank" rel="noreferrer noopener">
              Link text example
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
          <Text as="h2">Input Fields</Text>
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
                { value: "design", label: "Design" },
                { value: "development", label: "Development" },
                { value: "writing", label: "Writing" },
              ]}
            />

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
          <Form
            fields={[
              {
                name: "interests",
                label: "Your Interests",
                type: "checkbox",
                options: [
                  { value: "design", label: "Design" },
                  { value: "development", label: "Development" },
                  { value: "writing", label: "Writing" },
                  { value: "marketing", label: "Marketing" },
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
          <div className={styles.cardGrid}>
            <Card
              title="Weekly Planning"
              description="Review active tasks, set priorities, and share updates with your team."
              imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
              imageDescription="Open notebook on a desk used for weekly planning notes"
              ctaLabel="Open Board"
              ctaHref="/task"
            />

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

            <Card title="Title Only" fullWidth />
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
            <ConfettiButton />
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
      </main>

      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
      <Footer activePage="styleguide" />
    </>
  );
}
