import type { WentWrongItem } from "@/types/session"
import styles from "./GameOverOverlay.module.css"

type Props = {
  score: number; fatalError: string; whatWentWrong: WentWrongItem[]
  onTryAgain: () => void; onLeaderboard: () => void
}

export function GameOverOverlay({ score, fatalError, whatWentWrong, onTryAgain, onLeaderboard }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.title}>GAME OVER</div>
      <div className={styles.sub}>Pressure reached 6 stars. SWAT teams deployed.<br />Bato has fled. Contact terminated.</div>
      <div className={styles.fatalBox}>✕ Fatal Error — {fatalError}</div>
      <div className={styles.stat}><span className={styles.statVal}>{score}</span><span className={styles.statLabel}>Total Score</span></div>
      <div className={styles.breakdown}>
        <div className={styles.breakdownTitle}>What Went Wrong</div>
        {whatWentWrong.map((w, i) => (
          <div key={i} className={styles.breakdownRow}>
            <span className={styles.brName}>{w.label}</span>
            <span className={styles.brDetail}>{w.detail}</span>
          </div>
        ))}
      </div>
      <div className={styles.btns}>
        <button className={styles.btnPrimary} onClick={onTryAgain}>Try Again</button>
        <button className={styles.btnSecondary} onClick={onLeaderboard}>Leaderboard</button>
      </div>
    </div>
  )
}
