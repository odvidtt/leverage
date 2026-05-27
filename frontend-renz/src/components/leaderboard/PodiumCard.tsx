import { TypeBadge } from "@/components/ui/TypeBadge"
import type { LeaderboardEntry } from "@/types/leaderboard"
import styles from "./PodiumCard.module.css"

const RANK_COLORS: Record<number, string> = { 1: "#C0392B", 2: "#E67E22", 3: "#8B8BA0" }

export function PodiumCard({ entry }: { entry: LeaderboardEntry }) {
  const color = RANK_COLORS[entry.rank] ?? "#6B6B7B"
  return (
    <div className={styles.card} style={{ borderColor: color }} data-rank={entry.rank}>
      <div className={styles.rank} style={{ color }}>#{entry.rank}{entry.rank === 1 ? " Champion" : ""}</div>
      <div className={styles.avatar} style={{ background: `${color}22`, color }}>{entry.name.slice(0, 2).toUpperCase()}</div>
      <div className={styles.name}>{entry.name}</div>
      <TypeBadge type={entry.type} />
      <div className={styles.score}>{entry.score}<span className={styles.max}>/15</span></div>
      <div className={styles.outcome}>{entry.outcome}</div>
    </div>
  )
}
