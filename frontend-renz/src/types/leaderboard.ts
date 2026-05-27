export type LeaderboardEntry = {
  rank: number
  name: string
  type: "human" | "agent"
  score: number
  outcome: "Surrender ✓" | "Disengaged" | "Failed"
  date: string
}
