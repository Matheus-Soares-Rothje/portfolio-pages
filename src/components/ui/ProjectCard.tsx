import type { Project } from "@/types";
import { Button } from "./Button";
import styles from "./ProjectCard.module.scss";

interface Props { project: Project }
export function ProjectCard({ project }: Props) {
  const num = String(project.order).padStart(2, "0");
  return (
    <article className={styles.card}>
      <div className={styles.stamp}>Nº {num}</div>
      {project.imageUrl && (
        <div className={styles.cover}>
          <img src={project.imageUrl} alt={project.title} />
        </div>
      )}
      <header className={styles.head}>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.rule} />
      </header>
      <p className={styles.desc}>{project.description}</p>
      <div className={styles.tags}>
        <span className={styles.tagsLabel}>Palavras-chave:</span>
        {project.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
      <div className={styles.actions}>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            <Button variant="outline">Git</Button>
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer">
            <Button variant="primary">Live</Button>
          </a>
        )}
      </div>
    </article>
  );
}
