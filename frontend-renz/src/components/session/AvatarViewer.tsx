"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import type { Emotion } from "@/types/session"

const AVATAR_URL = process.env.NEXT_PUBLIC_RPM_AVATAR_URL ?? "/avatar.glb"

const EMOTION_RIM: Record<Emotion, number> = {
  guarded: 0x8b5cf6, suspicious: 0x7c3aed, angry: 0xdc2626,
  exhausted: 0x64748b, sad: 0x475569, open: 0x3b82f6,
  fearful: 0xf59e0b, hopeful: 0x0ea5e9, resolved: 0x27ae60,
}

type Props = { emotion: Emotion; speaking: boolean; pendingText?: string }

export function AvatarViewer({ emotion, speaking }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rimRef = useRef<THREE.DirectionalLight | null>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const speakingRef = useRef(false)
  const headBoneRef = useRef<THREE.Bone | null>(null)
  const rafRef = useRef<number>(0)

  speakingRef.current = speaking

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.clientWidth || 160
    const h = canvas.clientHeight || 160

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 1.72, 1.1)
    camera.lookAt(0, 1.6, 0)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(1, 2, 2)
    scene.add(key)

    const rim = new THREE.DirectionalLight(EMOTION_RIM[emotion], 0.8)
    rim.position.set(-2, 1, -1)
    scene.add(rim)
    rimRef.current = rim

    const loader = new GLTFLoader()
    loader.load(AVATAR_URL, (gltf) => {
      const model = gltf.scene
      scene.add(model)

      model.traverse((obj) => {
        if ((obj as THREE.Bone).isBone && obj.name.toLowerCase().includes("head")) {
          headBoneRef.current = obj as THREE.Bone
        }
      })

      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(gltf.animations[0]).play()
        mixerRef.current = mixer
      }
    })

    const clock = new THREE.Clock()
    let t = 0

    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      t += delta
      mixerRef.current?.update(delta)

      if (headBoneRef.current) {
        // Idle sway
        headBoneRef.current.rotation.y = Math.sin(t * 0.4) * 0.04
        headBoneRef.current.rotation.x = Math.sin(t * 0.3) * 0.02
        // Speaking jaw simulation via head micro-movement
        if (speakingRef.current) {
          headBoneRef.current.rotation.x += Math.sin(t * 8) * 0.015
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (rimRef.current) rimRef.current.color.setHex(EMOTION_RIM[emotion])
  }, [emotion])

  return (
    <canvas
      ref={canvasRef}
      data-testid="avatar-viewer"
      data-emotion={emotion}
      style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block" }}
    />
  )
}
