import { ParticipantTile } from "./ParticipantTile"
import type { Participant } from "@/types/session"
import styles from "./ParticipantRow.module.css"

type Props = {
  participants: Participant[]
  onMicStart: () => void
  onMicStop: () => void
  isRecording?: boolean
}

export function ParticipantRow({ participants, onMicStart, onMicStop, isRecording }: Props) {
  return (
    <div className={styles.row}>
      {participants.map(p => (
        <ParticipantTile
          key={p.id}
          participant={p}
          onMicStart={p.type === "human" ? onMicStart : undefined}
          onMicStop={p.type === "human" ? onMicStop : undefined}
          isRecording={p.type === "human" ? isRecording : undefined}
        />
      ))}
    </div>
  )
}
