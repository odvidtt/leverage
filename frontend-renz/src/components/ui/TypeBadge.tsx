export function TypeBadge({ type }: { type: "human" | "agent" }) {
  const isHuman = type === "human"
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10,
      background: isHuman ? "rgba(88,101,242,0.15)" : "rgba(39,174,96,0.15)",
      color: isHuman ? "#7289DA" : "#27AE60",
    }}>
      {isHuman ? "Human" : "Agent"}
    </span>
  )
}
