"use client"

import type { Milestone } from "@/lib/types"
import { MilestoneIcon } from "@/components/milestone-icon"

// Shared palette for every grid view. Lived = emerald, current = gold
// (ties to the sand), future = faint.
export const CELL = {
  lived: "bg-emerald-500",
  current: "bg-amber-400",
  future: "bg-white/[0.06] border border-white/[0.04]",
} as const

export const RAW = {
  lived: "#10b981",
  current: "#fbbf24",
  // Visible-but-muted indigo so the (canvas) future days read clearly.
  future: "rgba(129,140,248,0.30)",
} as const

function Dot({ color, className, label }: { color?: string; className?: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-[3px] ${className ?? ""}`}
        style={color ? { background: color } : undefined}
      />
      <span className="text-slate-300">{label}</span>
    </span>
  )
}

/**
 * Shared legend: lived / current / future plus any milestone chips.
 * `unit` is plural ("weeks"), `singular` is the current-unit label ("week").
 */
export function Legend({
  unit,
  singular,
  milestones,
}: {
  unit: string
  singular: string
  milestones: Milestone[]
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Dot className={CELL.lived} label={`${unit[0].toUpperCase()}${unit.slice(1)} lived`} />
        <Dot className={CELL.current} label={`Current ${singular}`} />
        <Dot className="bg-white/10" label={`Future ${unit}`} />
      </div>
      {milestones.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
          {milestones.map((m) => (
            <span key={m.id} className="flex items-center gap-1.5">
              <MilestoneIcon icon={m.icon} className="h-3.5 w-3.5" style={{ color: m.color }} />
              {m.label} · age {m.age}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Section heading used above each grid. */
export function VizHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </div>
  )
}

/**
 * Horizontal milestone band drawn over a fixed-pitch grid. `topPx` is the
 * vertical offset (age-in-years * row pitch). Used by weeks/months grids.
 */
export function MilestoneBand({ m, topPx }: { m: Milestone; topPx: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-10"
      style={{ top: topPx }}
    >
      <div className="h-px w-full" style={{ background: m.color, opacity: 0.7 }} />
      <span
        className="absolute -top-2.5 left-0 flex items-center gap-1 rounded px-1 py-0.5 text-[9px] font-medium leading-none"
        style={{ background: m.color, color: "#0b0f17" }}
      >
        <MilestoneIcon icon={m.icon} className="h-2.5 w-2.5" />
        {m.label}
      </span>
    </div>
  )
}
