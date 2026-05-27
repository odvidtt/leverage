import { renderHook, act } from "@testing-library/react"
import { useMicrophone } from "@/hooks/useMicrophone"

const mockStop = jest.fn()
const mockStart = jest.fn()
let mockOnStop: (() => void) | null = null
let mockOnDataAvailable: ((e: { data: Blob }) => void) | null = null

class MockMediaRecorder {
  ondataavailable: ((e: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  start() {
    mockStart()
    mockOnDataAvailable = this.ondataavailable
    mockOnStop = this.onstop
  }
  stop() { mockStop(); mockOnStop?.() }
}

beforeAll(() => {
  Object.defineProperty(global.navigator, "mediaDevices", {
    value: { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [{ stop: jest.fn() }] }) },
    configurable: true,
  })
  ;(global as any).MediaRecorder = MockMediaRecorder
})

describe("useMicrophone", () => {
  it("isRecording starts false", () => {
    const sendChunk = jest.fn()
    const { result } = renderHook(() => useMicrophone(sendChunk))
    expect(result.current.isRecording).toBe(false)
  })

  it("isRecording becomes true after startRecording", async () => {
    const sendChunk = jest.fn()
    const { result } = renderHook(() => useMicrophone(sendChunk))
    await act(async () => { await result.current.startRecording() })
    expect(result.current.isRecording).toBe(true)
  })

  it("calls sendAudioChunk on stopRecording", async () => {
    const sendChunk = jest.fn()
    const mockArrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))
    jest.spyOn(Blob.prototype, "arrayBuffer").mockImplementation(mockArrayBuffer)
    const { result } = renderHook(() => useMicrophone(sendChunk))
    await act(async () => { await result.current.startRecording() })
    await act(async () => { result.current.stopRecording() })
    expect(sendChunk).toHaveBeenCalled()
  })
})
