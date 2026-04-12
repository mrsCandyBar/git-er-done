import Button from "../../../components/Button";
import styles from "./page.module.scss";

export default function Base() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Workspace</h1>
        <p>Post-login home for quick status, actions, and next steps.</p>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Today at a glance</h2>
          <p>7 tasks due, 2 blocked, 3 completed in the last 24 hours.</p>
          <Button href="/task" variant="filled">
            Open Task Board
          </Button>
        </article>

        <article className={styles.card}>
          <h2>Profile health</h2>
          <p>Profile is 82% complete. Add timezone and notification preferences.</p>
          <Button href="/profile" variant="outline">
            Open Profile
          </Button>
        </article>
      </section>

      <section className={styles.timeline}>
        <h2>Suggested post-login flow</h2>
        <ol>
          <li>Land here at Workspace after auth success.</li>
          <li>Jump to Tasks to plan or complete actions.</li>
          <li>Visit Profile for account and preferences.</li>
        </ol>
      </section>
    </div>
  );
}
