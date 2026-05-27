"use client"
import { useRef, useCallback, useState } from "react"

export function useMicrophone(sendAudioChunk: (data: ArrayBuffer) => void) {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

  const startRecording = useCallback(async () => {
    if (recorderRef.current) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    recorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" })
      const buffer = await blob.arrayBuffer()
      sendAudioChunk(buffer)
      recorderRef.current = null
      setIsRecording(false)
      stream.getTracks().forEach(t => t.stop())
    }

    recorder.start()
    setIsRecording(true)
  }, [sendAudioChunk])

  const stopRecording = useCallback(() => { recorderRef.current?.stop() }, [])

  return { isRecording, startRecording, stopRecording }
}
