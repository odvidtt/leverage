import { render, screen } from "@testing-library/react"
import { SurrenderOverlay } from "@/components/session/overlays/SurrenderOverlay"

const props = {
  score: 13, stages: 5, duration: "18:42", rank: 3,
  breakdown: [{ stage: 1 as const, name: "Active Listening", score: 3 }],
  onLeaderboard: jest.fn(), onPlayAgain: jest.fn(),
}

it("renders SURRENDER EXECUTED", () => {
  render(<SurrenderOverlay {...props} />)
  expect(screen.getByText("SURRENDER EXECUTED")).toBeInTheDocument()
})
it("shows total score", () => {
  render(<SurrenderOverlay {...props} />)
  expect(screen.getByText("13")).toBeInTheDocument()
})
it("shows rank", () => {
  render(<SurrenderOverlay {...props} />)
  expect(screen.getByText("#3")).toBeInTheDocument()
})
