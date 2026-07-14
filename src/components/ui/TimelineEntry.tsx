import type { Experience } from "@/types";
import styles from "./TimelineEntry.module.scss";

interface Props { experience: Experience }
export function TimelineEntry({ experience }: Props) {
  return (
    <article className={styles.entry}>
      <div className={styles.dot} />
      <div className={styles.body}>
        <div className={styles.periodRow}>
          <span className={styles.period}>{experience.period}</span>
          {experience.isCurrent && <span className={styles.badge}>Em Curso</span>}
        </div>
        <h3 className={styles.role}>{experience.role}</h3>
        <p className={styles.company}>{experience.company}</p>
        <p className={styles.desc}>{experience.description}</p>
      </div>
    </article>
  );
}
