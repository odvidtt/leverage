"use client"
import { useEffect, useRef } from "react"
import type { TranscriptLine } from "@/types/session"
import styles from "./TranscriptPanel.module.css"

export function TranscriptPanel({ lines }: { lines: TranscriptLine[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === "function") {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [lines.length])

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Transcript</div>
      <div className={styles.messages}>
        {lines.map(line => (
          <div key={line.id} className={`${styles.line} ${styles[line.speaker]}`}>
            <div className={styles.lineHeader}>
              <span className={styles.speaker}>{line.speaker === "bato" ? "BATO" : "YOU"}</span>
              <span className={styles.time}>{line.timestamp}</span>
            </div>
            <div className={styles.text}>{line.text}</div>
            {line.scoreBadge && <div className={styles.badge}>{line.scoreBadge}</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
