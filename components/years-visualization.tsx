"use client"

import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { CELL, Legend, VizHeading } from "@/components/viz-shared"

interface YearsVisualizationProps {
  data: LifeData
  milestones: Milestone[]
  onCurrentYearClick?: () => void
}

export function YearsVisualization({ data, milestones, onCurrentYearClick }: YearsVisualizationProps) {
  const { lifeExpectancy, ageInYears, birthDate } = data
  const livedFull = Math.floor(ageInYears)
  const birthYear = birthDate.getFullYear()

  // age -> milestone starting at that age
  const milestoneByAge = new Map(milestones.map((m) => [m.age, m]))

  const years = Array.from({ length: lifeExpectancy }, (_, i) => i)

  return (
    <div className="space-y-6">
      <VizHeading title="Your life in years" subtitle="Each square is one year. Click the gold square to see what's left of this year." />

      <Card className="border-slate-800 bg-white/[0.03] p-6">
        <div className="mx-auto grid max-w-3xl grid-cols-8 gap-2 sm:grid-cols-10">
          {years.map((i) => {
            const isLived = i < livedFull
            const isCurrent = i === livedFull
            const milestone = milestoneByAge.get(i)
            const stateClass = isLived ? CELL.lived : isCurrent ? CELL.current : CELL.future
            return (
              <button
                key={i}
                type="button"
                onClick={isCurrent ? onCurrentYearClick : undefined}
                title={`Age ${i} · ${birthYear + i}${milestone ? ` · ${milestone.label} begins` : ""}`}
                className={`relative flex aspect-square items-center justify-center rounded-md text-xs font-medium transition
                  ${stateClass}
                  ${isLived ? "text-white/90" : isCurrent ? "text-black" : "text-slate-400"}
                  ${isCurrent ? "cursor-pointer ring-2 ring-amber-300 ring-offset-2 ring-offset-[#0b0f17] hover:scale-105" : ""}`}
                style={milestone ? { boxShadow: `inset 0 0 0 2px ${milestone.color}` } : undefined}
              >
                {i + 1}
                {milestone && (
                  <span
                    className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full"
                    style={{ background: milestone.color }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <Legend unit="years" singular="year" milestones={milestones} />
    </div>
  )
}
