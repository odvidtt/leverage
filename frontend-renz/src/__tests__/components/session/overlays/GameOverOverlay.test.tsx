import { render, screen } from "@testing-library/react"
import { GameOverOverlay } from "@/components/session/overlays/GameOverOverlay"

const props = {
  score: 1, fatalError: "Demanded surrender at Stage 1",
  whatWentWrong: [{ label: "Demanded immediate surrender", detail: "−2 pts" }],
  onTryAgain: jest.fn(), onLeaderboard: jest.fn(),
}

it("renders GAME OVER", () => {
  render(<GameOverOverlay {...props} />)
  expect(screen.getByText("GAME OVER")).toBeInTheDocument()
})
it("shows fatal error", () => {
  render(<GameOverOverlay {...props} />)
  expect(screen.getByText(/Demanded surrender/)).toBeInTheDocument()
})
it("shows what went wrong item", () => {
  render(<GameOverOverlay {...props} />)
  expect(screen.getByText("Demanded immediate surrender")).toBeInTheDocument()
  expect(screen.getByText("−2 pts")).toBeInTheDocument()
})
