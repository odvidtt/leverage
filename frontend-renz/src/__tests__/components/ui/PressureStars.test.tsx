import { render } from "@testing-library/react"
import { PressureStars } from "@/components/ui/PressureStars"

it("renders 6 stars total", () => {
  const { getAllByText } = render(<PressureStars stars={3} />)
  expect(getAllByText(/[★☆]/).length).toBeGreaterThanOrEqual(6)
})
it("marks correct count as filled", () => {
  const { container } = render(<PressureStars stars={2} />)
  expect(container.querySelectorAll("[data-filled='true']")).toHaveLength(2)
})
