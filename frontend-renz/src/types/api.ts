import type { Emotion, Stage } from "./session"

export type AgentPreset = {
  id: string
  label: string
  description: string
}

export type BenchmarkStartResponse = {
  sessionId: string
  stage: Stage
  status: string
  agentLabel: string
  agentPresetId: string
}

export type TurnResponse = {
  agentMove: string
  batoReply: string
  emotion: Emotion
  result: "advanced" | "held" | "failed"
  reason: string
  newStage: Stage
  sessionStatus: "running" | "completed" | "failed"
}

export type StageEvaluation = {
  stage: Stage
  score: number
  positives: string[]
  negatives: string[]
  narrative: string
}

export type EvaluationResult = {
  stages: StageEvaluation[]
  totalScore: number
  overallAssessment: string
  keyImprovementAreas: string[]
}

export type AgoraTokenResponse = {
  appId: string
  channelName: string
  uid: number
  token: string
  expiresIn: number
}

export type GameState = {
  session_id: string
  stress_level: number
  current_stage: number
  updated_at: string
}
