import { WaveformBars } from "@/components/ui/WaveformBars"
import { TypeBadge } from "@/components/ui/TypeBadge"
import type { Participant } from "@/types/session"
import styles from "./ParticipantTile.module.css"

type Props = {
  participant: Participant
  onMicStart?: () => void
  onMicStop?: () => void
  isRecording?: boolean
}

export function ParticipantTile({ participant, onMicStart, onMicStop, isRecording }: Props) {
  const { name, type, speaking, initials } = participant
  return (
    <div className={`${styles.tile} ${speaking ? styles.speaking : ""}`}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.name}>{name}</div>
      {speaking && <WaveformBars active />}
      {type === "human" && (
        <button
          className={`${styles.micBtn} ${isRecording ? styles.micActive : ""}`}
          onMouseDown={onMicStart}
          onMouseUp={onMicStop}
          onTouchStart={onMicStart}
          onTouchEnd={onMicStop}
        >
          {isRecording ? "●" : "HOLD"}
        </button>
      )}
      {type === "agent" && <TypeBadge type="agent" />}
    </div>
  )
}
