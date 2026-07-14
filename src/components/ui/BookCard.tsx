import type { ReactNode } from "react";
import styles from "./BookCard.module.scss";

interface Props { children: ReactNode; className?: string }
export function BookCard({ children, className }: Props) {
  return (
    <article className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.inner}>{children}</div>
    </article>
  );
}
