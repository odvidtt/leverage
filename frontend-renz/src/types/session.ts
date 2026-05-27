export type Mode = "human" | "observer"
export type Emotion =
  | "guarded" | "suspicious" | "angry" | "exhausted" | "sad"
  | "open" | "fearful" | "hopeful" | "resolved"
export type Stage = 1 | 2 | 3 | 4 | 5

export type StageBreakdown = {
  stage: Stage
  name: string
  score: number  // 0–3
}

export type WentWrongItem = {
  label: string
  detail: string
}

export type OutcomeState =
  | { type: "surrender"; score: number; stages: number; duration: string; rank: number; breakdown: StageBreakdown[] }
  | { type: "disengaged"; score: number; stagesReached: number; breakdown: StageBreakdown[] }
  | { type: "gameover"; score: number; fatalError: string; whatWentWrong: WentWrongItem[] }
  | { type: "stage_advance"; stage: 2|3|4|5; stageName: string; batoHint: string; prevStage: { name: string; score: number } }

export type TranscriptLine = {
  id: string
  speaker: "bato" | "player"
  text: string
  timestamp: string
  scoreBadge?: string
}

export type Participant = {
  id: string
  name: string
  type: "npc" | "human" | "agent"
  speaking: boolean
  initials: string
}

export type Scores = {
  s1: number; s2: number; s3: number; s4: number; s5: number; total: number
}

export type SessionState = {
  sessionId: string
  mode: Mode
  playerName: string
  stage: Stage
  emotion: Emotion
  pressureStars: number
  scores: Scores
  transcript: TranscriptLine[]
  participants: Participant[]
  outcome: OutcomeState | null
}
