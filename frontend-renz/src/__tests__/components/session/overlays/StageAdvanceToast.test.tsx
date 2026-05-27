import { render, screen, fireEvent } from "@testing-library/react"
import { StageAdvanceToast } from "@/components/session/overlays/StageAdvanceToast"

const props = { stage: 3 as const, stageName: "RAPPORT", batoHint: "He opened up", prevStage: { name: "Empathy", score: 3 }, onContinue: jest.fn() }

it("shows stage number and name", () => {
  render(<StageAdvanceToast {...props} />)
  expect(screen.getByText("3")).toBeInTheDocument()
  expect(screen.getByText("RAPPORT")).toBeInTheDocument()
})
it("shows bato hint", () => {
  render(<StageAdvanceToast {...props} />)
  expect(screen.getByText("He opened up")).toBeInTheDocument()
})
it("shows prev stage score", () => {
  render(<StageAdvanceToast {...props} />)
  expect(screen.getByText(/Empathy: 3\/3/)).toBeInTheDocument()
})
it("calls onContinue when Continue clicked", () => {
  const onContinue = jest.fn()
  render(<StageAdvanceToast {...props} onContinue={onContinue} />)
  fireEvent.click(screen.getByRole("button", { name: /Continue/i }))
  expect(onContinue).toHaveBeenCalled()
})
