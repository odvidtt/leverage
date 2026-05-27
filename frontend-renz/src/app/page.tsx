"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AgentPreset } from "@/types/api"
import styles from "./page.module.css"

const API = process.env.NEXT_PUBLIC_API_BASE ?? ""

const MODES = [
  { id: "human" as const, label: "Human Training", desc: "You speak with Bato using your microphone. Scored in real time on BCSM technique." },
  { id: "observer" as const, label: "Observer", desc: "Watch a selected AI agent negotiate with Bato live. Both sides use synthesized voice." },
]

export default function LandingPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [mode, setMode] = useState<"human" | "observer" | null>(null)
  const [presets, setPresets] = useState<AgentPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<AgentPreset | null>(null)

  useEffect(() => {
    if (mode !== "observer") return
    fetch(`${API}/api/benchmark/presets`)
      .then(r => r.json())
      .then((data: AgentPreset[]) => {
        setPresets(data)
        setSelectedPreset(data[0] ?? null)
      })
      .catch(() => {})
  }, [mode])

  const canBegin = name.trim().length > 0 && mode !== null && (mode !== "observer" || selectedPreset !== null)

  function begin() {
    if (!canBegin) return
    if (mode === "observer" && selectedPreset) {
      router.push(`/session?mode=observer&name=${encodeURIComponent(name.trim())}&presetId=${selectedPreset.id}&agentLabel=${encodeURIComponent(selectedPreset.label)}`)
    } else {
      router.push(`/session?mode=human&name=${encodeURIComponent(name.trim())}`)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.logo}>LEVERAGE<span>:</span></div>

      <div className={styles.scenario}>
        <span className={styles.dot} />
        Bato dela Rosa — ICC Fugitive Scenario
      </div>

      <input
        className={styles.nameInput}
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && begin()}
      />

      <div className={styles.modeCards}>
        {MODES.map(m => (
          <button
            key={m.id}
            className={`${styles.card} ${mode === m.id ? styles.cardActive : ""}`}
            onClick={() => setMode(m.id)}
          >
            <div className={styles.cardTitle}>{m.label}</div>
            <div className={styles.cardDesc}>{m.desc}</div>
          </button>
        ))}
      </div>

      {mode === "observer" && presets.length > 0 && (
        <div className={styles.personaSection}>
          <div className={styles.personaHeader}>
            <div className={styles.personaTitle}>Agent Persona</div>
            <div className={styles.personaSub}>Select the negotiator to watch</div>
          </div>
          <div className={styles.personaList}>
            {presets.map(p => (
              <button
                key={p.id}
                className={`${styles.personaCard} ${selectedPreset?.id === p.id ? styles.personaActive : ""}`}
                onClick={() => setSelectedPreset(p)}
              >
                <div className={styles.personaCheck}>{selectedPreset?.id === p.id ? "✓" : ""}</div>
                <div className={styles.personaBody}>
                  <div className={styles.personaName}>{p.label}</div>
                  <div className={styles.personaDesc}>{p.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button className={styles.beginBtn} disabled={!canBegin} onClick={begin}>
        Begin Negotiation →
      </button>
    </main>
  )
}
