import styles from "./WaveformBars.module.css"

export function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className={`${styles.bars} ${active ? "" : styles.inactive}`}>
      {[0, 1, 2, 3].map(i => <span key={i} data-bar className={styles.bar} style={{ animationDelay: `${i * 0.1}s` }} />)}
    </div>
  )
}
