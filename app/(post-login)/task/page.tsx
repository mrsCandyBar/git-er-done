import Button from "../../../components/Button";
import styles from "./page.module.scss";

export default function Task() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Task Board</h1>
        <p>Plan, prioritize, and complete work inside the authenticated app experience.</p>
      </header>

      <section className={styles.columns}>
        <article className={styles.column}>
          <h2>Backlog</h2>
          <ul>
            <li>Break onboarding into smaller milestones</li>
            <li>Confirm deadline with product team</li>
            <li>Write acceptance criteria for profile form</li>
          </ul>
        </article>

        <article className={styles.column}>
          <h2>In Progress</h2>
          <ul>
            <li>Finalize post-login navigation map</li>
            <li>QA confetti CTA trigger behavior</li>
          </ul>
        </article>

        <article className={styles.column}>
          <h2>Done</h2>
          <ul>
            <li>Split public and app route groups</li>
            <li>Create post-login shell preview</li>
          </ul>
        </article>
      </section>

      <div className={styles.actions}>
        <Button href="/base" variant="outline">
          Back to Workspace
        </Button>
        <Button href="/profile" variant="filled">
          Continue to Profile
        </Button>
      </div>
    </div>
  );
}
