import styles from "./StatCard.module.scss";

interface Props { label: string; value: string }
export function StatCard({ label, value }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
