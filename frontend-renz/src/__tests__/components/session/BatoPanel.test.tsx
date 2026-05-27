jest.mock("@/components/session/AvatarViewer", () => ({
  AvatarViewer: ({ emotion }: { emotion: string }) => <div data-testid="avatar" data-emotion={emotion} />,
}))

import { render, screen } from "@testing-library/react"
import { BatoPanel } from "@/components/session/BatoPanel"

it("renders Bato name", () => {
  render(<BatoPanel stage={1} emotion="guarded" speaking={false} />)
  expect(screen.getByText(/Bato dela Rosa/i)).toBeInTheDocument()
})
it("applies emotion color as data attribute", () => {
  const { container } = render(<BatoPanel stage={2} emotion="angry" speaking={false} />)
  expect(container.querySelector("[data-emotion='angry']")).toBeInTheDocument()
})
it("shows speaking class when Bato is speaking", () => {
  const { container } = render(<BatoPanel stage={1} emotion="guarded" speaking={true} />)
  expect(container.querySelector("[data-speaking='true']")).toBeInTheDocument()
})
it("highlights current stage in progress bar", () => {
  render(<BatoPanel stage={3} emotion="open" speaking={false} />)
  expect(screen.getByText("Rapport")).toBeInTheDocument()
})
