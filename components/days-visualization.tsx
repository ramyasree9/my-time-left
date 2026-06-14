"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { Legend, RAW, VizHeading } from "@/components/viz-shared"
import { MilestoneIcon } from "@/components/milestone-icon"

interface DaysVisualizationProps {
  data: LifeData
  milestones: Milestone[]
}

const COLS = 365
const PITCH = 4.5
const CELL = 3.4
const DAYS_IN_YEAR = 365.25

export function DaysVisualization({ data, milestones }: DaysVisualizationProps) {
  const { totalDays, daysLived, birthDate } = data
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null)

  // Simple contiguous layout: 365 days per row, filled left-to-right. This
  // avoids the gaps a fractional 365.25 mapping introduces at the row edges.
  const rows = Math.ceil(totalDays / COLS)
  const logicalW = COLS * PITCH
  const logicalH = rows * PITCH

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    // Non-null const so the nested draw helper keeps the type.
    const g: CanvasRenderingContext2D = ctx

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = logicalW * dpr
    canvas.height = logicalH * dpr
    g.scale(dpr, dpr)

    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const drawUpTo = (limit: number) => {
      g.clearRect(0, 0, logicalW, logicalH)
      for (let d = 0; d < limit; d++) {
        const x = (d % COLS) * PITCH
        const y = Math.floor(d / COLS) * PITCH
        g.fillStyle = d < daysLived ? RAW.lived : d === daysLived ? RAW.current : RAW.future
        g.fillRect(x, y, CELL, CELL)
      }
      // milestone lines (a milestone age maps to its day index / COLS rows)
      for (const m of milestones) {
        const ly = ((m.age * DAYS_IN_YEAR) / COLS) * PITCH
        g.strokeStyle = m.color
        g.globalAlpha = 0.8
        g.lineWidth = 1
        g.beginPath()
        g.moveTo(0, ly)
        g.lineTo(logicalW, ly)
        g.stroke()
        g.globalAlpha = 1
      }
    }

    if (reduced) {
      drawUpTo(totalDays)
      return
    }

    let raf = 0
    let drawn = 0
    const step = Math.max(200, Math.ceil(totalDays / 60)) // ~1s reveal
    const loop = () => {
      drawn = Math.min(totalDays, drawn + step)
      drawUpTo(drawn)
      if (drawn < totalDays) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [logicalW, logicalH, totalDays, daysLived, milestones])

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = logicalW / rect.width
    const scaleY = logicalH / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const col = Math.floor(mx / PITCH)
    const row = Math.floor(my / PITCH)
    const d = row * COLS + col
    if (d < 0 || d >= totalDays || col >= COLS) {
      setTip(null)
      return
    }
    const date = new Date(birthDate.getTime() + d * 86400000)
    const label = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    const age = Math.floor(d / DAYS_IN_YEAR)
    setTip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: `${label} · day ${d.toLocaleString()} · age ${age}`,
    })
  }

  return (
    <div className="space-y-6">
      <VizHeading
        title="Your life in days"
        subtitle={`Each dot is a single day — all ${totalDays.toLocaleString()} of them. Hover for the date.`}
      />

      <Card className="border-slate-800 bg-white/[0.03] p-6">
        <p className="mb-3 text-center text-xs text-slate-500 lg:hidden">Scroll sideways to explore →</p>
        <div className="relative overflow-x-auto">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMove}
            onMouseLeave={() => setTip(null)}
            style={{ width: logicalW, height: logicalH }}
            className="block"
          />
          {milestones.map((m) => (
            <span
              key={m.id}
              className="pointer-events-none absolute left-0 z-10 flex items-center gap-1 rounded px-1 py-0.5 text-[9px] font-medium leading-none"
              style={{
                top: (m.age * DAYS_IN_YEAR / COLS) * PITCH - 7,
                background: m.color,
                color: "#0b0f17",
              }}
            >
              <MilestoneIcon icon={m.icon} className="h-2.5 w-2.5" />
              {m.label}
            </span>
          ))}
          {tip && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded bg-black/90 px-2 py-1 text-[11px] text-white shadow-lg"
              style={{ left: tip.x, top: tip.y - 6 }}
            >
              {tip.text}
            </div>
          )}
        </div>
      </Card>

      <Legend unit="days" singular="day" milestones={milestones} />
    </div>
  )
}
