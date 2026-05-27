import { PressureStars } from "@/components/ui/PressureStars"
import type { Stage, Emotion, Mode } from "@/types/session"
import styles from "./Hud.module.css"

const STAGE_NAMES: Record<Stage, string> = {
  1: "Active Listening", 2: "Empathy", 3: "Rapport", 4: "Influence", 5: "Surrender"
}

type Props = {
  stage: Stage
  emotion: Emotion
  pressureStars: number
  mode: Mode
  onEndSession: () => void
}

export function Hud({ stage, emotion, pressureStars, mode, onEndSession }: Props) {
  return (
    <header className={styles.hud}>
      <div className={styles.logo}>LEVERAGE<span>:</span></div>
      <div className={styles.stageLabel}>
        Stage {String(stage).padStart(2, "0")} — {STAGE_NAMES[stage]}
      </div>
      <div className={styles.emotionLabel}>{emotion.toUpperCase()}</div>
      <PressureStars stars={pressureStars} />
      <div className={styles.modeBadge} data-mode={mode}>
        {mode === "human" ? "Human Training" : "Observer"}
      </div>
      <div className={styles.spacer} />
      {mode === "human" && (
        <button className={styles.endBtn} onClick={onEndSession}>End Session</button>
      )}
    </header>
  )
}
