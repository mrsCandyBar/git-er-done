import Button from "../../../components/Button";
import Text from "../../../components/Text";
import styles from "./page.module.scss";

type Task = { id?: string; label: string; checked?: boolean };

type Column = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  description: string;
  tasks: Task[];
};

const columns: Column[] = [
  {
    id: "dance-class-for-beginners",
    eyebrow: "FUN",
    icon: "💃",
    title: "Dance Class for Beginners",
    description: "Let's get those feet moving! This beginner-friendly dance class is perfect for anyone looking to have fun and learn some new moves. Whether you're a seasoned dancer or just starting out, our experienced instructors will guide you through a variety of dance styles, from salsa to hip-hop. Join us for a lively and energetic session that will leave you feeling confident on the dance floor!",
    tasks: [
      { label: "Book an appointment", checked: false },
      { label: "Make arrangements for alternative transportation", checked: true },
      { label: "Take a picture for memory", checked: true },
    ],
  }
];

export default function Current() {
  return (
    <div className={styles.page}>
      <section className={styles.cards}>
        {columns.map((col, i) => (
          <article
            key={col.id}
            className={`${styles.highlight} ${i === 0 ? styles.active : styles.secondary}`}
          >
            <Text as="h4">{col.eyebrow}</Text>
            <span className={styles.icon} aria-hidden="true">{col.icon}</span>
            <Text as="h2">{col.title}</Text>
            <Text as="p">{col.description}</Text>
            <br/>
            <ul className={styles.taskList}>
              {col.tasks.map((task) => (
                <li
                  key={task.label}
                  id={task.id}
                  className={`${styles.taskItem}${task.id ? ` ${styles.taskTarget}` : ""}${task.checked ? ` ${styles.taskChecked}` : ""}`}
                >
                  <label className={styles.taskLabel}>
                    <input
                      type="checkbox"
                      defaultChecked={task.checked}
                      className={styles.taskCheckbox}
                    />
                    <span>{task.label}</span>
                  </label>
                </li>
              ))}
            </ul>

            <br/>
            <div className={styles.actions}>
              <Button href="/profile" variant="filled">
                Let's do it! 🚀
              </Button>
              <Button href="/dashboard" variant="ghost">
                Raincheck?
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
