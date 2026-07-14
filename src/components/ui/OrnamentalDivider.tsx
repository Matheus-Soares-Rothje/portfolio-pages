import styles from "./OrnamentalDivider.module.scss";

interface Props { label?: string }
export function OrnamentalDivider({ label }: Props) {
  return (
    <div className={styles.divider} role="separator">
      <span className={styles.diamond}>◆</span>
      <span className={styles.line} />
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.line} />
      <span className={styles.diamond}>◆</span>
    </div>
  );
}
