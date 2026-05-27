import { render, screen } from "@testing-library/react"
import { TranscriptPanel } from "@/components/session/TranscriptPanel"
import type { TranscriptLine } from "@/types/session"

const lines: TranscriptLine[] = [
  { id: "1", speaker: "bato", text: "I am a soldier.", timestamp: "12:00" },
  { id: "2", speaker: "player", text: "I understand.", timestamp: "12:01", scoreBadge: "Active Listening ✓" },
]

it("renders all transcript messages", () => {
  render(<TranscriptPanel lines={lines} />)
  expect(screen.getByText("I am a soldier.")).toBeInTheDocument()
  expect(screen.getByText("I understand.")).toBeInTheDocument()
})
it("renders score badge when present", () => {
  render(<TranscriptPanel lines={lines} />)
  expect(screen.getByText("Active Listening ✓")).toBeInTheDocument()
})
