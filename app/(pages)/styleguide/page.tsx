'use client';

import { faCircleCheck, faClock, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Form from "../../../components/Form";
import Text from "../../../components/Text";
import InfoChip from "../../../components/InfoChip";
import StyleguideThemeToggle from "../../../components/StyleguideThemeToggle";
import styles from "./page.module.scss";

export default function Styleguide() {
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
      </main>
      <Footer activePage="styleguide" />
    </>
  );
}
