import { render } from "@testing-library/react"
import { WaveformBars } from "@/components/ui/WaveformBars"

it("renders 4 bars when active", () => {
  const { container } = render(<WaveformBars active />)
  expect(container.querySelectorAll("[data-bar]")).toHaveLength(4)
})
it("renders with inactive class when not active", () => {
  const { container } = render(<WaveformBars active={false} />)
  expect(container.firstChild).toHaveClass("inactive")
})
