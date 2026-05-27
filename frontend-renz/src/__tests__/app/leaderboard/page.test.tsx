import { render, screen, fireEvent } from "@testing-library/react"
import LeaderboardPage from "@/app/leaderboard/page"

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }))

it("renders Leaderboard heading", () => {
  render(<LeaderboardPage />)
  expect(screen.getByText("Leaderboard")).toBeInTheDocument()
})
it("renders podium top 3 names", () => {
  render(<LeaderboardPage />)
  expect(screen.getByText("MasterNeg-v3")).toBeInTheDocument()
  expect(screen.getByText("MasterNeg-v2")).toBeInTheDocument()
  expect(screen.getByText("Renz")).toBeInTheDocument()
})
it("filter buttons render", () => {
  render(<LeaderboardPage />)
  expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Human" })).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Agent" })).toBeInTheDocument()
})
it("clicking Human filter shows only human entries", () => {
  render(<LeaderboardPage />)
  fireEvent.click(screen.getByRole("button", { name: "Human" }))
  expect(screen.getAllByText("Human").length).toBeGreaterThan(0)
})
