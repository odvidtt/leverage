import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useRouter } from "next/navigation"
import LandingPage from "@/app/page"

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }))

const mockFetch = jest.fn()
global.fetch = mockFetch

const MOCK_PRESETS = [
  { id: "p1", label: "MasterNeg-v3", description: "Highly empathetic agent." },
  { id: "p2", label: "DirectNeg-v1", description: "Assertive agent." },
]

describe("LandingPage", () => {
  const push = jest.fn()
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push })
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_PRESETS) })
  })

  it("renders LEVERAGE: title", () => {
    render(<LandingPage />)
    expect(screen.getByText(/LEVERAGE/)).toBeInTheDocument()
  })

  it("renders both mode cards", () => {
    render(<LandingPage />)
    expect(screen.getByText("Human Training")).toBeInTheDocument()
    expect(screen.getByText("Observer")).toBeInTheDocument()
  })

  it("Begin button is disabled with no name", () => {
    render(<LandingPage />)
    expect(screen.getByRole("button", { name: /Begin/i })).toBeDisabled()
  })

  it("Begin button enabled after name input and human mode selection", async () => {
    render(<LandingPage />)
    await userEvent.type(screen.getByPlaceholderText(/Your name/i), "Renz")
    fireEvent.click(screen.getByText("Human Training"))
    expect(screen.getByRole("button", { name: /Begin/i })).toBeEnabled()
  })

  it("shows persona picker when Observer mode selected", async () => {
    render(<LandingPage />)
    fireEvent.click(screen.getByText("Observer"))
    await waitFor(() => expect(screen.getByText("Agent Persona")).toBeInTheDocument())
    expect(screen.getByText("MasterNeg-v3")).toBeInTheDocument()
  })

  it("navigates with presetId for observer mode", async () => {
    render(<LandingPage />)
    await userEvent.type(screen.getByPlaceholderText(/Your name/i), "Renz")
    fireEvent.click(screen.getByText("Observer"))
    await waitFor(() => screen.getByText("MasterNeg-v3"))
    fireEvent.click(screen.getByRole("button", { name: /Begin/i }))
    expect(push).toHaveBeenCalledWith(expect.stringContaining("mode=observer"))
    expect(push).toHaveBeenCalledWith(expect.stringContaining("presetId=p1"))
  })

  it("navigates to /session with human params on Begin", async () => {
    render(<LandingPage />)
    await userEvent.type(screen.getByPlaceholderText(/Your name/i), "Renz")
    fireEvent.click(screen.getByText("Human Training"))
    fireEvent.click(screen.getByRole("button", { name: /Begin/i }))
    expect(push).toHaveBeenCalledWith("/session?mode=human&name=Renz")
  })
})
