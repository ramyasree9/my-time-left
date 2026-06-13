"use client"

import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { CELL, Legend, MilestoneBand, VizHeading } from "@/components/viz-shared"

interface MonthsVisualizationProps {
  data: LifeData
  milestones: Milestone[]
}

const CELL_PX = 30
const GAP_PX = 5
const PITCH = CELL_PX + GAP_PX
const HEADER_H = 18

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function MonthsVisualization({ data, milestones }: MonthsVisualizationProps) {
  const { lifeExpectancy, totalMonths, monthsLived, birthDate } = data
  const birthYear = birthDate.getFullYear()
  const birthMonth = birthDate.getMonth()
  const rows = lifeExpectancy

  const months = Array.from({ length: totalMonths }, (_, i) => i)
  const yearLabels = Array.from({ length: Math.floor(lifeExpectancy / 5) + 1 }, (_, i) => i * 5).filter(
    (y) => y <= lifeExpectancy,
  )

  const gridHeight = rows * CELL_PX + (rows - 1) * GAP_PX

  return (
    <div className="space-y-6">
      <VizHeading
        title="Your life in months"
        subtitle="Each row is one year of your life; each square, one month."
      />

      <Card className="border-slate-800 bg-white/[0.03] p-6">
        <div className="flex justify-center">
          {/* Year axis (left) */}
          <div className="relative mr-3 w-10 shrink-0" style={{ height: gridHeight + HEADER_H }}>
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
            {/* Month-number header (1..12), aligned to columns */}
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(12, ${CELL_PX}px)`, gap: GAP_PX, height: HEADER_H }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="text-center text-[9px] text-slate-600">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Months grid + milestone bands */}
            <div className="relative">
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(12, ${CELL_PX}px)`, gap: GAP_PX }}
              >
                {months.map((m) => {
                  const isLived = m < monthsLived
                  const isCurrent = m === monthsLived
                  const yearOfLife = Math.floor(m / 12)
                  const calMonth = (birthMonth + m) % 12
                  const calYear = birthYear + Math.floor((birthMonth + m) / 12)
                  return (
                    <div
                      key={m}
                      title={`${MONTH_NAMES[calMonth]} ${calYear} · age ${yearOfLife}`}
                      className={`aspect-square rounded-[3px] transition-opacity hover:opacity-80
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
      </Card>

      <Legend unit="months" singular="month" milestones={milestones} />
    </div>
  )
}
