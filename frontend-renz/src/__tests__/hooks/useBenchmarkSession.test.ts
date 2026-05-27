import { renderHook, act, waitFor } from "@testing-library/react"
import { useBenchmarkSession } from "@/hooks/useBenchmarkSession"

const mockFetch = jest.fn()
global.fetch = mockFetch

const START_RES = { sessionId: "ses123", stage: 1, status: "running", agentLabel: "MasterNeg", agentPresetId: "p1" }
const TURN_RES = { agentMove: "I hear you.", batoReply: "You don't understand.", emotion: "guarded", result: "held", reason: "Still guarded", newStage: 1, sessionStatus: "running" }
const FINAL_TURN = { ...TURN_RES, emotion: "resolved", result: "advanced", newStage: 2, sessionStatus: "completed" }
const EVAL_RES = {
  stages: [{ stage: 1, score: 2, positives: [], negatives: [], narrative: "OK" }],
  totalScore: 2, overallAssessment: "Decent", keyImprovementAreas: [],
}

describe("useBenchmarkSession", () => {
  beforeEach(() => { mockFetch.mockReset() })

  it("initial state has empty sessionId, transcript, and one agent tile", () => {
    const { result } = renderHook(() => useBenchmarkSession("MasterNeg-v3"))
    expect(result.current.state.sessionId).toBe("")
    expect(result.current.state.transcript).toHaveLength(0)
    expect(result.current.state.participants).toHaveLength(1)
    expect(result.current.state.participants[0].type).toBe("agent")
  })

  it("sets sessionId after startSession", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...TURN_RES, sessionStatus: "failed" }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })

    await waitFor(() => expect(result.current.state.sessionId).toBe("ses123"))
  })

  it("adds agent and bato transcript lines from turn", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...TURN_RES, sessionStatus: "failed" }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })

    await waitFor(() => expect(result.current.state.transcript.length).toBeGreaterThanOrEqual(2))
    expect(result.current.state.transcript[0].text).toBe("I hear you.")
    expect(result.current.state.transcript[0].speaker).toBe("player")
    expect(result.current.state.transcript[1].text).toBe("You don't understand.")
    expect(result.current.state.transcript[1].speaker).toBe("bato")
  })

  it("updates emotion from turn response", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...TURN_RES, emotion: "angry", sessionStatus: "failed" }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })

    await waitFor(() => expect(result.current.state.emotion).toBe("angry"))
  })

  it("fires stage_advance outcome when newStage increases", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(FINAL_TURN) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })

    await waitFor(() => expect(result.current.state.outcome?.type).toBe("stage_advance"))
    expect(result.current.state.stage).toBe(2)
  })

  it("dismissStageAdvance clears toast while keeping stage", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(FINAL_TURN) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })
    await waitFor(() => expect(result.current.state.outcome?.type).toBe("stage_advance"))

    act(() => { result.current.dismissStageAdvance() })
    expect(result.current.state.outcome).toBeNull()
    expect(result.current.state.stage).toBe(2)
  })

  it("sets surrender outcome after completed session", async () => {
    const completedTurn = { ...TURN_RES, sessionStatus: "completed" }
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(START_RES) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(completedTurn) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(EVAL_RES) })

    const { result } = renderHook(() => useBenchmarkSession("Renz"))
    act(() => { result.current.startSession("MasterNeg", "p1") })

    await waitFor(() => expect(result.current.state.outcome?.type).toBe("surrender"))
    expect(result.current.state.scores.total).toBe(2)
  })
})
