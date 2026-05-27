import { ScoreBar } from "@/components/ui/ScoreBar"
import type { Scores } from "@/types/session"
import styles from "./ScorePanel.module.css"

const STAGE_KEYS = ["s1","s2","s3","s4","s5"] as const

type Props = { scores: Scores; accent: "red" | "green" }

export function ScorePanel({ scores, accent }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Score</span>
        <span className={styles.total} data-accent={accent}>{scores.total}</span>
        <span className={styles.totalMax}>/15</span>
      </div>
      <div className={styles.bars}>
        {STAGE_KEYS.map((k, i) => (
          <ScoreBar key={k} label={`S${i + 1}`} score={scores[k]} accent={accent} />
        ))}
      </div>
    </div>
  )
}
