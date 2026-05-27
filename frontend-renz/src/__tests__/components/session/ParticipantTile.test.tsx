import { render, screen, fireEvent } from "@testing-library/react"
import { ParticipantTile } from "@/components/session/ParticipantTile"

const npc = { id: "agent1", name: "MasterNeg", type: "agent" as const, speaking: false, initials: "MN" }

it("renders participant name", () => {
  render(<ParticipantTile participant={npc} />)
  expect(screen.getByText("MasterNeg")).toBeInTheDocument()
})
it("shows waveform bars when speaking", () => {
  const { container } = render(<ParticipantTile participant={{ ...npc, speaking: true }} />)
  expect(container.querySelectorAll("[data-bar]").length).toBeGreaterThan(0)
})
it("renders HOLD button for human tile", () => {
  const human = { ...npc, type: "human" as const }
  render(<ParticipantTile participant={human} onMicStart={jest.fn()} onMicStop={jest.fn()} />)
  expect(screen.getByText(/HOLD/i)).toBeInTheDocument()
})
it("calls onMicStart on mousedown of HOLD button", () => {
  const onStart = jest.fn()
  const human = { ...npc, type: "human" as const }
  render(<ParticipantTile participant={human} onMicStart={onStart} onMicStop={jest.fn()} />)
  fireEvent.mouseDown(screen.getByText(/HOLD/i))
  expect(onStart).toHaveBeenCalled()
})
it("renders Agent badge for agent tile", () => {
  const agent = { ...npc, type: "agent" as const }
  render(<ParticipantTile participant={agent} />)
  expect(screen.getByText("Agent")).toBeInTheDocument()
})
