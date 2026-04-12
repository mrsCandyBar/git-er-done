import Button from "../../../components/Button";
import styles from "./page.module.scss";

export default function Profile() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Profile</h1>
        <p>Manage account details, preferences, and security for signed-in users.</p>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Account details</h2>
          <p>Name, email, display picture, and timezone controls live in this section.</p>
        </article>

        <article className={styles.card}>
          <h2>Preferences</h2>
          <p>Notification behavior, task reminders, and weekly digest preferences.</p>
        </article>

        <article className={styles.card}>
          <h2>Security</h2>
          <p>Password reset, connected providers, and recent sign-in activity.</p>
        </article>
      </section>

      <div className={styles.actions}>
        <Button href="/task" variant="outline">
          Back to Tasks
        </Button>
        <Button href="/base" variant="filled">
          Return to Workspace
        </Button>
      </div>
    </div>
  );
}
