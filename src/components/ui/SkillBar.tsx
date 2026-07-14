import styles from "./SkillBar.module.scss";

interface Props { name: string; level: number }
export function SkillBar({ name, level }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.name}>{name}</span>
        <span className={styles.level}>{level}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
