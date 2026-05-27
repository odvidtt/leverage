import { render } from "@testing-library/react"
import { ScoreBar } from "@/components/ui/ScoreBar"

it("renders label and score", () => {
  const { getByText } = render(<ScoreBar label="S1" score={2} />)
  expect(getByText("S1")).toBeInTheDocument()
  expect(getByText("2/3")).toBeInTheDocument()
})
