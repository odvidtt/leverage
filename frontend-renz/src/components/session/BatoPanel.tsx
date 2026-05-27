import { AvatarViewer } from "./AvatarViewer"
import type { Stage, Emotion } from "@/types/session"
import styles from "./BatoPanel.module.css"

const STAGES: { num: Stage; name: string }[] = [
  { num: 1, name: "Active Listening" },
  { num: 2, name: "Empathy" },
  { num: 3, name: "Rapport" },
  { num: 4, name: "Influence" },
  { num: 5, name: "Surrender" },
]

type Props = { stage: Stage; emotion: Emotion; speaking: boolean; pendingText?: string }

export function BatoPanel({ stage, emotion, speaking, pendingText }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.avatarWrap}>
        <div className={styles.ring} data-emotion={emotion} data-speaking={speaking}>
          <AvatarViewer emotion={emotion} pendingText={pendingText} speaking={speaking} />
        </div>
        <div className={styles.name}>Bato dela Rosa</div>
        <div className={styles.role}>ICC Fugitive · Senator</div>
      </div>

      <div className={styles.stageBar}>
        {STAGES.map((s, i) => (
          <div key={s.num} className={styles.stageStep}>
            <div className={`${styles.stepDot} ${s.num === stage ? styles.stepActive : ""} ${s.num < stage ? styles.stepDone : ""}`} />
            <span className={`${styles.stepLabel} ${s.num === stage ? styles.stepLabelActive : ""}`}>{s.name}</span>
            {i < STAGES.length - 1 && <div className={`${styles.stepLine} ${s.num < stage ? styles.stepLineDone : ""}`} />}
          </div>
        ))}
      </div>
    </div>
  )
}
