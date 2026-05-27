import styles from "./ScoreBar.module.css"

export function ScoreBar({ label, score, accent = "red" }: { label: string; score: number; accent?: "red" | "green" }) {
  const pct = (score / 3) * 100
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <div className={styles.fill} data-accent={accent} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.score}>{score}/3</span>
    </div>
  )
}
