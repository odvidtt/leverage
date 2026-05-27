import { renderHook, act } from "@testing-library/react"
import { useTTS } from "@/hooks/useTTS"

const mockSpeak = jest.fn()
const mockCancel = jest.fn()
let capturedUtterance: any = null

beforeAll(() => {
  Object.defineProperty(global, "speechSynthesis", {
    value: {
      speak: (u: any) => { capturedUtterance = u; mockSpeak(u) },
      cancel: mockCancel,
    },
    configurable: true,
  })
  ;(global as any).SpeechSynthesisUtterance = class {
    text: string; pitch = 1; rate = 1
    onend: (() => void) | null = null
    onstart: (() => void) | null = null
    constructor(text: string) { this.text = text }
  }
})

describe("useTTS", () => {
  beforeEach(() => { mockSpeak.mockReset(); mockCancel.mockReset(); capturedUtterance = null })

  it("speak calls speechSynthesis.speak", async () => {
    const { result } = renderHook(() => useTTS())
    await act(async () => { result.current.speak("Hello Bato", "bato") })
    expect(mockSpeak).toHaveBeenCalled()
    expect(capturedUtterance.text).toBe("Hello Bato")
  })

  it("bato voice uses lower pitch", async () => {
    const { result } = renderHook(() => useTTS())
    await act(async () => { result.current.speak("I understand.", "bato") })
    expect(capturedUtterance.pitch).toBe(0.9)
    expect(capturedUtterance.rate).toBe(0.95)
  })

  it("agent voice uses higher pitch", async () => {
    const { result } = renderHook(() => useTTS())
    await act(async () => { result.current.speak("Tell me more.", "agent") })
    expect(capturedUtterance.pitch).toBe(1.1)
    expect(capturedUtterance.rate).toBe(1.0)
  })

  it("isSpeaking starts false", () => {
    const { result } = renderHook(() => useTTS())
    expect(result.current.isSpeaking).toBe(false)
  })
})
