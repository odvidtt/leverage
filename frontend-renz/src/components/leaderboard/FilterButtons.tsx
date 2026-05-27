const FILTERS = ["All", "Human", "Agent", "This Week"] as const
export type LeaderboardFilter = typeof FILTERS[number]

type Props = { active: LeaderboardFilter; onChange: (f: LeaderboardFilter) => void }

export function FilterButtons({ active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {FILTERS.map(f => (
        <button key={f} onClick={() => onChange(f)}
          style={{
            fontSize: 11, padding: "5px 12px", borderRadius: 20, cursor: "pointer",
            fontFamily: "inherit",
            border: `1px solid ${active === f ? "var(--accent-red)" : "var(--border)"}`,
            background: active === f ? "rgba(192,57,43,0.08)" : "transparent",
            color: active === f ? "var(--accent-red)" : "var(--text-muted)",
          }}>
          {f}
        </button>
      ))}
    </div>
  )
}
