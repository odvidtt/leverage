import { TypeBadge } from "@/components/ui/TypeBadge"
import type { LeaderboardEntry } from "@/types/leaderboard"
import styles from "./LeaderboardTable.module.css"

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div>#</div><div>Player</div><div>Type</div><div>Score</div><div>Outcome</div><div>Date</div>
      </div>
      {entries.map(e => (
        <div key={e.rank} className={styles.row}>
          <div className={`${styles.rank} ${e.rank <= 3 ? styles.rankTop : ""}`}>{e.rank}</div>
          <div className={styles.player}>
            <div className={styles.avatar}>{e.name.slice(0,2).toUpperCase()}</div>
            <span>{e.name}</span>
          </div>
          <TypeBadge type={e.type} />
          <div className={`${styles.score} ${e.rank <= 3 ? styles.scoreHi : ""}`}>{e.score}/15</div>
          <div className={`${styles.outcome} ${e.outcome === "Surrender ✓" ? styles.win : e.outcome === "Failed" ? styles.fail : ""}`}>{e.outcome}</div>
          <div className={styles.date}>{e.date}</div>
        </div>
      ))}
    </div>
  )
}
