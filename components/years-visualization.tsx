"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { Legend, VizHeading } from "@/components/viz-shared"
import { MilestoneIcon } from "@/components/milestone-icon"

interface YearsVisualizationProps {
  data: LifeData
  milestones: Milestone[]
  selectedYear: number | null
  onSelectYear: (age: number) => void
}

export function YearsVisualization({ data, milestones, selectedYear, onSelectYear }: YearsVisualizationProps) {
  const { lifeExpectancy, ageInYears, birthDate } = data
  const livedFull = Math.floor(ageInYears)
  const birthYear = birthDate.getFullYear()

  const milestoneByAge = new Map(milestones.map((m) => [m.age, m]))

  // Chunk ages into decade rows so the grid reads as "your 20s, 30s…".
  const ages = Array.from({ length: lifeExpectancy }, (_, i) => i)
  const decades: number[][] = []
  for (let i = 0; i < ages.length; i += 10) decades.push(ages.slice(i, i + 10))

  return (
    <div className="space-y-6">
      <VizHeading
        title="Your life in years"
        subtitle="Each square is one year. Icons mark your milestones — tap any year for detail."
      />

      <Card className="border-slate-800 bg-white/[0.03] p-5 sm:p-7">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-2xl flex-col gap-2.5"
        >
          {decades.map((row, r) => (
            <div key={r} className="flex items-center gap-3">
              <span className="w-7 shrink-0 text-right text-[11px] font-medium tabular-nums text-slate-600">
                {r * 10}s
              </span>
              <div className="grid flex-1 grid-cols-10 gap-2">
                {row.map((i) => {
                  const isLived = i < livedFull
                  const isCurrent = i === livedFull
                  const milestone = milestoneByAge.get(i)
                  const isSelected = selectedYear === i

                  const stateClass = isLived
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-400"
                    : isCurrent
                      ? "bg-amber-400 text-black"
                      : "bg-white/[0.05] text-slate-500 hover:bg-white/[0.1]"

                  const iconColor = isCurrent ? "#0b0f17" : isLived ? "#ffffff" : milestone?.color

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSelectYear(i)}
                      title={`Age ${i} · ${birthYear + i}${milestone ? ` · ${milestone.label} begins` : ""}`}
                      className={`group relative flex aspect-square items-center justify-center rounded-lg text-[10px] font-semibold transition-all duration-150 hover:z-10 hover:scale-[1.12] ${stateClass} ${
                        isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#0b0f17]" : ""
                      } ${isCurrent ? "cursor-pointer shadow-[0_0_18px_rgba(251,191,36,0.55)]" : ""}`}
                      style={
                        milestone && !isSelected
                          ? { boxShadow: `inset 0 0 0 2px ${milestone.color}` }
                          : undefined
                      }
                    >
                      {isCurrent && (
                        <span className="pointer-events-none absolute inset-0 animate-ping rounded-lg ring-2 ring-amber-300/60" />
                      )}
                      {milestone ? (
                        <MilestoneIcon
                          icon={milestone.icon}
                          className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                          style={{ color: iconColor }}
                        />
                      ) : (
                        <span className={isLived || isCurrent ? "" : "opacity-60"}>{i}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </Card>

      <Legend unit="years" singular="year" milestones={milestones} />
    </div>
  )
}
