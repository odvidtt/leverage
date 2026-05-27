import { render, screen } from "@testing-library/react"
import { ParticipantRow } from "@/components/session/ParticipantRow"
import type { Participant } from "@/types/session"

const participants: Participant[] = [
  { id: "player", name: "Renz", type: "human", speaking: false, initials: "RZ" },
]

it("renders participant name", () => {
  render(<ParticipantRow participants={participants} onMicStart={jest.fn()} onMicStop={jest.fn()} />)
  expect(screen.getByText("Renz")).toBeInTheDocument()
})
