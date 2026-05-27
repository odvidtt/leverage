"use client"
import { useCallback, useState } from "react"

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string, voice: "bato" | "agent"): Promise<void> => {
    return new Promise(resolve => {
      if (typeof window === "undefined" || !window.speechSynthesis) { resolve(); return }
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.pitch = voice === "bato" ? 0.9 : 1.1
      utterance.rate = voice === "bato" ? 0.95 : 1.0
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => { setIsSpeaking(false); resolve() }
      window.speechSynthesis.speak(utterance)
    })
  }, [])

  const cancel = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, cancel, isSpeaking }
}
