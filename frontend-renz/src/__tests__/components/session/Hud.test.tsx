import { render, screen, fireEvent } from "@testing-library/react"
import { Hud } from "@/components/session/Hud"

const defaultProps = {
  stage: 2 as const,
  emotion: "angry" as const,
  pressureStars: 3,
  mode: "human" as const,
  onEndSession: jest.fn(),
}

it("renders LEVERAGE: logo", () => {
  render(<Hud {...defaultProps} />)
  expect(screen.getByText(/LEVERAGE/)).toBeInTheDocument()
})
it("shows current stage label", () => {
  render(<Hud {...defaultProps} />)
  expect(screen.getByText(/Stage 02/)).toBeInTheDocument()
  expect(screen.getByText(/Empathy/)).toBeInTheDocument()
})
it("shows emotion label", () => {
  render(<Hud {...defaultProps} />)
  expect(screen.getByText("ANGRY")).toBeInTheDocument()
})
it("shows End Session button in human mode", () => {
  render(<Hud {...defaultProps} />)
  expect(screen.getByRole("button", { name: /End Session/i })).toBeInTheDocument()
})
it("hides End Session button in observer mode", () => {
  render(<Hud {...defaultProps} mode="observer" />)
  expect(screen.queryByRole("button", { name: /End Session/i })).not.toBeInTheDocument()
})
it("calls onEndSession when End Session clicked", () => {
  const onEnd = jest.fn()
  render(<Hud {...defaultProps} onEndSession={onEnd} />)
  fireEvent.click(screen.getByRole("button", { name: /End Session/i }))
  expect(onEnd).toHaveBeenCalled()
})
