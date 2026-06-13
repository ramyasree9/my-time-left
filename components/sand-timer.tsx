"use client"

import { useEffect, useRef } from "react"

interface SandTimerProps {
  /** 0..100 — how much of life is already behind you (bottom chamber fill). */
  percentageLived: number
  /** Pixel size of the (square) canvas. */
  size?: number
  className?: string
}

interface Grain {
  x: number
  y: number
  vy: number
  settled: boolean
}

/**
 * Canvas hourglass. The top chamber holds the time that remains and slowly
 * drains through the neck into the bottom chamber (time lived). Warm gold
 * sand against dark glass. Honors prefers-reduced-motion (renders a static
 * frame). Purely decorative — the real numbers live next to it.
 */
export function SandTimer({ percentageLived, size = 220, className }: SandTimerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const grainsRef = useRef<Grain[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    // Capture as a non-null const so the nested draw helpers keep the type.
    const g: CanvasRenderingContext2D = ctx

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    g.scale(dpr, dpr)

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const lived = Math.max(0, Math.min(1, percentageLived / 100))
    const remaining = 1 - lived

    // Geometry --------------------------------------------------------------
    const cx = size / 2
    const pad = size * 0.12
    const top = pad
    const bottom = size - pad
    const midY = size / 2
    const halfW = size * 0.32
    const neckHalf = size * 0.03

    const GOLD = "#f5b042"
    const GOLD_DARK = "#d98a1f"

    // Glass chamber outlines (two trapezoids meeting at the neck).
    function drawGlass() {
      g.lineWidth = Math.max(2, size * 0.012)
      g.strokeStyle = "rgba(226,232,240,0.35)"

      // top bulb
      g.beginPath()
      g.moveTo(cx - halfW, top)
      g.lineTo(cx + halfW, top)
      g.lineTo(cx + neckHalf, midY)
      g.lineTo(cx - neckHalf, midY)
      g.closePath()
      g.stroke()

      // bottom bulb
      g.beginPath()
      g.moveTo(cx - neckHalf, midY)
      g.lineTo(cx + neckHalf, midY)
      g.lineTo(cx + halfW, bottom)
      g.lineTo(cx - halfW, bottom)
      g.closePath()
      g.stroke()

      // caps
      g.beginPath()
      g.moveTo(cx - halfW - 4, top)
      g.lineTo(cx + halfW + 4, top)
      g.moveTo(cx - halfW - 4, bottom)
      g.lineTo(cx + halfW + 4, bottom)
      g.stroke()
    }

    // Sand in the top bulb: an inverted trapezoid whose height tracks `remaining`.
    function drawTopSand(level: number) {
      if (level <= 0.001) return
      const fullH = midY - top
      const sandTopY = midY - fullH * level
      const wAtTop = lerp(neckHalf, halfW, level)
      const grad = g.createLinearGradient(0, sandTopY, 0, midY)
      grad.addColorStop(0, GOLD)
      grad.addColorStop(1, GOLD_DARK)
      g.fillStyle = grad
      g.beginPath()
      g.moveTo(cx - wAtTop, sandTopY)
      g.lineTo(cx + wAtTop, sandTopY)
      g.lineTo(cx + neckHalf, midY)
      g.lineTo(cx - neckHalf, midY)
      g.closePath()
      g.fill()
    }

    // Sand piling in the bottom bulb: a mound whose height tracks `lived`.
    function drawBottomSand(level: number) {
      if (level <= 0.001) return
      const fullH = bottom - midY
      const moundH = fullH * level
      const baseY = bottom
      const peakY = bottom - moundH
      const wAtBase = halfW
      const grad = g.createLinearGradient(0, peakY, 0, baseY)
      grad.addColorStop(0, GOLD)
      grad.addColorStop(1, GOLD_DARK)
      g.fillStyle = grad
      g.beginPath()
      g.moveTo(cx - wAtBase, baseY)
      g.lineTo(cx + wAtBase, baseY)
      g.lineTo(cx + neckHalf * 1.5, peakY)
      // gentle mound peak
      g.quadraticCurveTo(cx, peakY - moundH * 0.18, cx - neckHalf * 1.5, peakY)
      g.closePath()
      g.fill()
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function spawnGrain() {
      grainsRef.current.push({
        x: cx + (Math.random() - 0.5) * neckHalf * 1.2,
        y: midY,
        vy: size * 0.004 + Math.random() * size * 0.004,
        settled: false,
      })
    }

    function drawGrains() {
      g.fillStyle = GOLD
      const landY = bottom - (bottom - midY) * lived - 2
      const dot = Math.max(1.5, size * 0.012)
      for (const grain of grainsRef.current) {
        if (!grain.settled) {
          grain.vy += size * 0.0006
          grain.y += grain.vy
          if (grain.y >= landY) {
            grain.y = landY
            grain.settled = true
          }
        }
        g.globalAlpha = grain.settled ? 0 : 1
        g.fillRect(grain.x, grain.y, dot, dot)
      }
      g.globalAlpha = 1
      // prune settled / off-screen grains
      grainsRef.current = grainsRef.current.filter((grain) => !grain.settled).slice(-60)
    }

    function render(frame: number) {
      g.clearRect(0, 0, size, size)
      drawGlass()
      drawTopSand(remaining)
      drawBottomSand(lived)

      if (!reduced && remaining > 0.001 && lived < 0.999) {
        if (frame % 6 === 0) spawnGrain()
        drawGrains()
      }
    }

    if (reduced) {
      render(0)
      return
    }

    let frame = 0
    const loop = () => {
      frame++
      render(frame)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      grainsRef.current = []
    }
  }, [percentageLived, size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    />
  )
}
