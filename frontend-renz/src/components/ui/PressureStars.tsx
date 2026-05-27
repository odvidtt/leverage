export function PressureStars({ stars }: { stars: number }) {
  return (
    <span style={{ fontSize: 13, letterSpacing: 1 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} data-filled={i < stars ? "true" : "false"}
          style={{ color: i < stars ? "#C0392B" : "#2A2A3E" }}>
          {i < stars ? "★" : "☆"}
        </span>
      ))}
    </span>
  )
}
