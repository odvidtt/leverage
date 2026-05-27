"use client"
import { useReducer, useRef, useCallback, useEffect } from "react"
import type { SessionState, Stage, Scores, Emotion } from "@/types/session"
import type { TurnResponse, EvaluationResult } from "@/types/api"

const API = process.env.NEXT_PUBLIC_API_BASE ?? ""

function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const STAGE_NAMES: Record<Stage, string> = {
  1: "Active Listening", 2: "Empathy", 3: "Rapport", 4: "Influence", 5: "Surrender"
}

const ZERO_SCORES: Scores = { s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, total: 0 }

function makeInitialState(playerName: string): SessionState {
  return {
    sessionId: "", mode: "observer", playerName,
    stage: 1, emotion: "guarded", pressureStars: 0,
    scores: ZERO_SCORES, transcript: [],
    participants: [{ id: "agent", name: playerName, type: "agent" as const, speaking: false, initials: playerName.slice(0, 2).toUpperCase() }],
    outcome: null,
  }
}

type Action =
  | { type: "SESSION_STARTED"; sessionId: string }
  | { type: "TRANSCRIPT_MESSAGE"; line: SessionState["transcript"][number] }
  | { type: "SCORE_UPDATE"; scores: Scores }
  | { type: "STAGE_ADVANCE"; stage: Stage; stageName: string; batoHint: string; prevStage: { name: string; score: number } }
  | { type: "EMOTION_CHANGE"; emotion: Emotion }
  | { type: "PARTICIPANT_SPEAKING"; participantId: string; speaking: boolean }
  | { type: "PRESSURE_TICK" }
  | { type: "OUTCOME"; outcome: NonNullable<SessionState["outcome"]> }
  | { type: "DISMISS_STAGE_ADVANCE" }

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "SESSION_STARTED": return { ...state, sessionId: action.sessionId }
    case "TRANSCRIPT_MESSAGE": return { ...state, transcript: [...state.transcript, action.line] }
    case "SCORE_UPDATE": return { ...state, scores: action.scores }
    case "STAGE_ADVANCE":
      return {
        ...state, stage: action.stage,
        outcome: { type: "stage_advance", stage: action.stage as 2|3|4|5, stageName: action.stageName, batoHint: action.batoHint, prevStage: action.prevStage },
      }
    case "EMOTION_CHANGE": return { ...state, emotion: action.emotion }
    case "PRESSURE_TICK": return { ...state, pressureStars: Math.min(6, state.pressureStars + 1) }
    case "PARTICIPANT_SPEAKING":
      return { ...state, participants: state.participants.map(p => p.id === action.participantId ? { ...p, speaking: action.speaking } : p) }
    case "OUTCOME":
      // Preserve stage_advance toast — don't overwrite with terminal outcome until dismissed
      if (state.outcome?.type === "stage_advance") return state
      return { ...state, outcome: action.outcome }
    case "DISMISS_STAGE_ADVANCE":
      return state.outcome?.type === "stage_advance" ? { ...state, outcome: null } : state
    default: return state
  }
}

function ts(): string {
  return new Date().toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit" })
}

export function useBenchmarkSession(playerName: string) {
  const [state, dispatch] = useReducer(reducer, undefined, () => makeInitialState(playerName))
  const runningRef = useRef(false)
  const sessionIdRef = useRef("")
  const stageRef = useRef<Stage>(1)
  const pressureRef = useRef(0)

  useEffect(() => () => { runningRef.current = false }, [])

  const startSession = useCallback(async (agentLabel: string, agentPresetId: string) => {
    if (runningRef.current) return
    const res = await fetch(`${API}/api/benchmark/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentLabel, agentPresetId }),
    })
    const data = await res.json()
    sessionIdRef.current = data.sessionId
    stageRef.current = data.stage
    dispatch({ type: "SESSION_STARTED", sessionId: data.sessionId })
    runningRef.current = true
    runLoop()
  }, [])

  async function runLoop() {
    while (runningRef.current) {
      const res = await fetch(`${API}/api/benchmark/turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      })
      const turn: TurnResponse = await res.json()

      dispatch({ type: "TRANSCRIPT_MESSAGE", line: { id: uuid(), speaker: "player", text: turn.agentMove, timestamp: ts() } })
      dispatch({ type: "PARTICIPANT_SPEAKING", participantId: "agent", speaking: true })
      await new Promise(r => setTimeout(r, 600))
      dispatch({ type: "PARTICIPANT_SPEAKING", participantId: "agent", speaking: false })

      dispatch({ type: "TRANSCRIPT_MESSAGE", line: { id: uuid(), speaker: "bato", text: turn.batoReply, timestamp: ts() } })
      dispatch({ type: "PARTICIPANT_SPEAKING", participantId: "bato", speaking: true })
      dispatch({ type: "EMOTION_CHANGE", emotion: turn.emotion })

      if (turn.newStage > stageRef.current) {
        dispatch({ type: "STAGE_ADVANCE", stage: turn.newStage, stageName: STAGE_NAMES[turn.newStage], batoHint: turn.reason, prevStage: { name: STAGE_NAMES[stageRef.current], score: 3 } })
        stageRef.current = turn.newStage
      }

      // Increment pressure on failed turns
      if (turn.result === "failed") {
        pressureRef.current += 1
        dispatch({ type: "PRESSURE_TICK" })
      }

      if (turn.sessionStatus === "completed" || turn.sessionStatus === "failed") {
        runningRef.current = false
        dispatch({ type: "PARTICIPANT_SPEAKING", participantId: "bato", speaking: false })
        // Game over if pressure maxed, otherwise evaluate normally
        if (pressureRef.current >= 6) {
          dispatch({ type: "OUTCOME", outcome: { type: "gameover", score: 0, fatalError: turn.reason, whatWentWrong: [{ label: "Negotiation breakdown", detail: `+${pressureRef.current}★ pressure` }] } })
        } else {
          await evaluateSession(turn.sessionStatus)
        }
        return
      }

      await new Promise(r => setTimeout(r, 1000))
      dispatch({ type: "PARTICIPANT_SPEAKING", participantId: "bato", speaking: false })
    }
  }

  async function evaluateSession(status: "completed" | "failed") {
    let res: Response | undefined
    try {
      res = await fetch(`${API}/api/benchmark/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionIdRef.current }),
      })
    } catch {
      return
    }
    if (!res) return
    const ev: EvaluationResult = await res.json()

    const scores: Scores = {
      s1: ev.stages[0]?.score ?? 0,
      s2: ev.stages[1]?.score ?? 0,
      s3: ev.stages[2]?.score ?? 0,
      s4: ev.stages[3]?.score ?? 0,
      s5: ev.stages[4]?.score ?? 0,
      total: ev.totalScore,
    }
    dispatch({ type: "SCORE_UPDATE", scores })

    const breakdown = ev.stages.map(s => ({ stage: s.stage, name: STAGE_NAMES[s.stage], score: s.score }))
    if (status === "completed") {
      dispatch({ type: "OUTCOME", outcome: { type: "surrender", score: ev.totalScore, stages: 5, duration: "—", rank: 1, breakdown } })
    } else {
      dispatch({ type: "OUTCOME", outcome: { type: "disengaged", score: ev.totalScore, stagesReached: stageRef.current, breakdown } })
    }
  }

  const stopSession = useCallback(() => { runningRef.current = false }, [])
  const dismissStageAdvance = useCallback(() => dispatch({ type: "DISMISS_STAGE_ADVANCE" }), [])

  return { state, startSession, stopSession, dismissStageAdvance }
}
