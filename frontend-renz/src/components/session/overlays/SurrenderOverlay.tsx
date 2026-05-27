import type { StageBreakdown } from "@/types/session"
import styles from "./SurrenderOverlay.module.css"

type Props = {
  score: number; stages: number; duration: string; rank: number
  breakdown: StageBreakdown[]
  onLeaderboard: () => void; onPlayAgain: () => void
}

export function SurrenderOverlay({ score, stages, duration, rank, breakdown, onLeaderboard, onPlayAgain }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.title}>SURRENDER EXECUTED</div>
      <div className={styles.sub}>Bato dela Rosa has agreed to voluntary surrender.<br />You guided him through all {stages} stages.</div>
      <div className={styles.stats}>
        <div className={styles.stat}><span className={styles.statVal}>{score}</span><span className={styles.statLabel}>Total Score</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{stages}/5</span><span className={styles.statLabel}>Stages</span></div>
        <div className={styles.stat}><span className={styles.statVal}>{duration}</span><span className={styles.statLabel}>Duration</span></div>
        <div className={styles.stat}><span className={styles.statVal}>#{rank}</span><span className={styles.statLabel}>Rank</span></div>
      </div>
      <div className={styles.btns}>
        <button className={styles.btnPrimary} onClick={onLeaderboard}>Leaderboard</button>
        <button className={styles.btnSecondary} onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  )
}
