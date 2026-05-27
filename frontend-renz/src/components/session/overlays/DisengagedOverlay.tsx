import type { StageBreakdown } from "@/types/session"
import styles from "./DisengagedOverlay.module.css"

type Props = {
  score: number; stagesReached: number; breakdown: StageBreakdown[]
  onTryAgain: () => void; onLeaderboard: () => void
}

export function DisengagedOverlay({ score, stagesReached, breakdown, onTryAgain, onLeaderboard }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.title}>DISENGAGED</div>
      <div className={styles.sub}>Bato ended contact before trust was established.<br />You reached Stage {stagesReached} of 5.</div>
      <div className={styles.stats}>
        <div className={styles.stat}><span className={styles.statVal}>{score}</span><span className={styles.statLabel}>Total Score</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{stagesReached}/5</span><span className={styles.statLabel}>Stages</span></div>
      </div>
      <div className={styles.btns}>
        <button className={styles.btnPrimary} onClick={onTryAgain}>Try Again</button>
        <button className={styles.btnSecondary} onClick={onLeaderboard}>Leaderboard</button>
      </div>
    </div>
  )
}
