"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useRef, Suspense } from "react"
import { useBenchmarkSession } from "@/hooks/useBenchmarkSession"
import { useTTS } from "@/hooks/useTTS"
import { Hud } from "@/components/session/Hud"
import { BatoPanel } from "@/components/session/BatoPanel"
import { ParticipantRow } from "@/components/session/ParticipantRow"
import { ScorePanel } from "@/components/session/ScorePanel"
import { TranscriptPanel } from "@/components/session/TranscriptPanel"
import { OutcomeOverlay } from "@/components/session/overlays/OutcomeOverlay"
import type { Mode } from "@/types/session"
import styles from "./page.module.css"

function SessionContent() {
  const params = useSearchParams()
  const router = useRouter()
  const mode = (params.get("mode") ?? "observer") as Mode
  const playerName = params.get("name") ?? "Negotiator"
  const presetId = params.get("presetId") ?? "default"
  const agentLabel = params.get("agentLabel") ?? "MasterNeg"

  const { state, startSession, stopSession, dismissStageAdvance } = useBenchmarkSession(playerName)
  const { speak } = useTTS()

  const startedRef = useRef(false)
  const lastTtsIdx = useRef(-1)

  useEffect(() => {
    if (!startedRef.current && mode === "observer") {
      startedRef.current = true
      startSession(agentLabel, presetId)
    }
  }, [mode, startSession, agentLabel, presetId])

  useEffect(() => {
    const lines = state.transcript
    if (lines.length === 0 || lines.length - 1 <= lastTtsIdx.current) return
    const newLines = lines.slice(lastTtsIdx.current + 1)
    lastTtsIdx.current = lines.length - 1
    ;(async () => {
      for (const line of newLines) {
        await speak(line.text, line.speaker === "bato" ? "bato" : "agent")
      }
    })()
  }, [state.transcript, speak])

  function handleEndSession() {
    stopSession()
    router.push("/leaderboard")
  }

  const isBatoSpeaking = state.participants.some(p => p.id === "bato" && p.speaking)
  const lastBatoText = [...state.transcript].reverse().find(l => l.speaker === "bato")?.text
  const accent = mode === "human" ? "red" : "green"

  return (
    <div className={styles.layout}>
      <Hud
        stage={state.stage}
        emotion={state.emotion}
        pressureStars={state.pressureStars}
        mode={mode}
        onEndSession={handleEndSession}
      />

      <div className={styles.body}>
        <div className={styles.left}>
          <BatoPanel
            stage={state.stage}
            emotion={state.emotion}
            speaking={isBatoSpeaking}
            pendingText={lastBatoText}
          />
        </div>

        <div className={styles.right}>
          <ScorePanel scores={state.scores} accent={accent} />
          <TranscriptPanel lines={state.transcript} />
        </div>
      </div>

      <ParticipantRow
        participants={state.participants}
        onMicStart={() => {}}
        onMicStop={() => {}}
      />

      {state.outcome && (
        <OutcomeOverlay outcome={state.outcome} onDismissStage={dismissStageAdvance} />
      )}
    </div>
  )
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>Loading session...</div>}>
      <SessionContent />
    </Suspense>
  )
}
