import { render, screen } from "@testing-library/react"
import { ScorePanel } from "@/components/session/ScorePanel"

const scores = { s1: 2, s2: 1, s3: 0, s4: 0, s5: 0, total: 3 }

it("renders total score", () => {
  render(<ScorePanel scores={scores} accent="red" />)
  expect(screen.getByText("3")).toBeInTheDocument()
  expect(screen.getByText("/15")).toBeInTheDocument()
})
it("renders all 5 stage bars", () => {
  render(<ScorePanel scores={scores} accent="red" />)
  expect(screen.getByText("S1")).toBeInTheDocument()
  expect(screen.getByText("S5")).toBeInTheDocument()
})
