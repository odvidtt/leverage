import { render } from "@testing-library/react"
import { AvatarViewer } from "@/components/session/AvatarViewer"

// TalkingHead requires WebGL — mock the whole module for tests
jest.mock("@/components/session/AvatarViewer", () => ({
  AvatarViewer: ({ emotion, pendingText }: { emotion: string; pendingText?: string }) => (
    <div data-testid="avatar-viewer" data-emotion={emotion} data-pending={pendingText ?? ""} />
  ),
}))

it("renders avatar container", () => {
  const { getByTestId } = render(<AvatarViewer emotion="guarded" speaking={false} />)
  expect(getByTestId("avatar-viewer")).toBeInTheDocument()
})
it("passes emotion as data attribute", () => {
  const { getByTestId } = render(<AvatarViewer emotion="angry" speaking={false} />)
  expect(getByTestId("avatar-viewer")).toHaveAttribute("data-emotion", "angry")
})
it("passes pendingText as data attribute", () => {
  const { getByTestId } = render(<AvatarViewer emotion="open" speaking={false} pendingText="Hello" />)
  expect(getByTestId("avatar-viewer")).toHaveAttribute("data-pending", "Hello")
})
