import { render } from "@testing-library/react"
import { TypeBadge } from "@/components/ui/TypeBadge"

it("renders Human text", () => {
  const { getByText } = render(<TypeBadge type="human" />)
  expect(getByText("Human")).toBeInTheDocument()
})
it("renders Agent text", () => {
  const { getByText } = render(<TypeBadge type="agent" />)
  expect(getByText("Agent")).toBeInTheDocument()
})
