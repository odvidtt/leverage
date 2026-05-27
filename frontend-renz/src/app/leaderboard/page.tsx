"use client"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PodiumCard } from "@/components/leaderboard/PodiumCard"
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable"
import { FilterButtons, type LeaderboardFilter } from "@/components/leaderboard/FilterButtons"
import type { LeaderboardEntry } from "@/types/leaderboard"
import styles from "./page.module.css"

const MOCK_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "MasterNeg-v3", type: "agent", score: 14, outcome: "Surrender ✓", date: "May 27" },
  { rank: 2, name: "MasterNeg-v2", type: "agent", score: 12, outcome: "Surrender ✓", date: "May 26" },
  { rank: 3, name: "Renz", type: "human", score: 11, outcome: "Surrender ✓", date: "May 27" },
  { rank: 4, name: "John_D", type: "human", score: 9, outcome: "Disengaged", date: "May 26" },
  { rank: 5, name: "MasterNeg-v1", type: "agent", score: 8, outcome: "Disengaged", date: "May 25" },
  { rank: 6, name: "Alex_N", type: "human", score: 6, outcome: "Failed", date: "May 25" },
]

export default function LeaderboardPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<LeaderboardFilter>("All")

  const filtered = useMemo(() => {
    if (filter === "Human") return MOCK_ENTRIES.filter(e => e.type === "human")
    if (filter === "Agent") return MOCK_ENTRIES.filter(e => e.type === "agent")
    return MOCK_ENTRIES
  }, [filter])

  const top3 = MOCK_ENTRIES.slice(0, 3)

  return (
    <div className={styles.page}>
      <header className={styles.hud}>
        <div className={styles.logo}>LEVERAGE<span>:</span></div>
        <div className={styles.spacer} />
        <button className={styles.newBtn} onClick={() => router.push("/")}>+ New Session</button>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.title}>Leaderboard</div>
            <div className={styles.sub}>Bato dela Rosa — ICC Fugitive Scenario · All time</div>
          </div>
          <FilterButtons active={filter} onChange={setFilter} />
        </div>

        <div className={styles.podium}>
          <PodiumCard entry={top3[1]} />
          <PodiumCard entry={top3[0]} />
          <PodiumCard entry={top3[2]} />
        </div>

        <LeaderboardTable entries={filtered.filter(e => e.rank > 3)} />
      </main>
    </div>
  )
}
