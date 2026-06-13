"use client"

import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { CELL, Legend, MilestoneBand, VizHeading } from "@/components/viz-shared"

interface WeeksVisualizationProps {
  data: LifeData
  milestones: Milestone[]
}

const CELL_PX = 11
const GAP_PX = 3
const PITCH = CELL_PX + GAP_PX
const HEADER_H = 16
const QUARTERS = [0, 13, 26, 39]

export function WeeksVisualization({ data, milestones }: WeeksVisualizationProps) {
  const { lifeExpectancy, totalWeeks, weeksLived, birthDate } = data
  const birthYear = birthDate.getFullYear()
  const rows = lifeExpectancy

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i)
  const yearLabels = Array.from({ length: Math.floor(lifeExpectancy / 5) + 1 }, (_, i) => i * 5).filter(
    (y) => y <= lifeExpectancy,
  )

  const gridHeight = rows * CELL_PX + (rows - 1) * GAP_PX
  const gridWidth = 52 * CELL_PX + 51 * GAP_PX

  return (
    <div className="space-y-6">
      <VizHeading
        title="Your life in weeks"
        subtitle="Each row is one year (52 weeks). The whole grid is your entire life."
      />

      <Card className="border-slate-800 bg-white/[0.03] p-6">
        <div className="overflow-x-auto">
          <div className="mx-auto flex w-fit justify-center">
            {/* Year axis (left). Extra height keeps the last year label from
                overflowing the scroll container (overflow-x-auto coerces
                overflow-y to auto, which would otherwise add a stray bar). */}
            <div className="relative mr-3 w-10 shrink-0" style={{ height: gridHeight + HEADER_H + 20 }}>
              {yearLabels.map((y) => (
                <span
                  key={y}
                  className="absolute right-0 text-[10px] tabular-nums text-slate-500"
                  style={{ top: HEADER_H + y * PITCH - 5 }}
                >
                  {birthYear + y}
                </span>
              ))}
            </div>

            <div>
              {/* Quarter markers, aligned to columns */}
              <div className="relative" style={{ width: gridWidth, height: HEADER_H }}>
                {QUARTERS.map((q) => (
                  <span
                    key={q}
                    className="absolute text-[9px] text-slate-600"
                    style={{ left: q * PITCH }}
                  >
                    W{q + 1}
                  </span>
                ))}
              </div>

              {/* Weeks grid + milestone bands */}
              <div className="relative">
                <div
                  className="grid"
                  style={{ gridTemplateColumns: `repeat(52, ${CELL_PX}px)`, gap: GAP_PX }}
                >
                  {weeks.map((w) => {
                    const isLived = w < weeksLived
                    const isCurrent = w === weeksLived
                    const yearOfLife = Math.floor(w / 52)
                    const weekInYear = (w % 52) + 1
                    return (
                      <div
                        key={w}
                        title={`Age ${yearOfLife} · week ${weekInYear} (${birthYear + yearOfLife})`}
                        className={`aspect-square rounded-[2px]
                          ${isLived ? CELL.lived : isCurrent ? CELL.current : CELL.future}
                          ${isCurrent ? "ring-1 ring-amber-300" : ""}`}
                      />
                    )
                  })}
                </div>

                {milestones.map((m) => (
                  <MilestoneBand key={m.id} m={m} topPx={m.age * PITCH} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Legend unit="weeks" singular="week" milestones={milestones} />
    </div>
  )
}
