"use client"

import { Card } from "@/components/ui/card"
import type { LifeData, Milestone } from "@/lib/types"
import { MilestoneIcon } from "@/components/milestone-icon"

interface YearFocusProps {
  data: LifeData
  /** Selected age (year of life), 0-based. */
  age: number
  milestones: Milestone[]
}

const DAYS_IN_YEAR = 365.25

export function YearFocus({ data, age, milestones }: YearFocusProps) {
  const livedFull = Math.floor(data.ageInYears)
  const birthYear = data.birthDate.getFullYear()
  const calYear = birthYear + age

  const status =
    age < livedFull
      ? { label: "Lived", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }
      : age === livedFull
        ? { label: "You are here", cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" }
        : { label: "Yet to come", cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" }

  const sorted = [...milestones].sort((a, b) => a.age - b.age)
  const phase = [...sorted].reverse().find((m) => m.age <= age) ?? null
  const milestoneHere = sorted.find((m) => m.age === age) ?? null

  const relative =
    age === livedFull ? "this is your current year" : age > livedFull ? `in ${age - livedFull} years` : `${livedFull - age} years ago`

  // Current-year progress (only meaningful for the year you're in).
  const isCurrent = age === livedFull
  const pct = Math.round(data.currentYearProgress * 100)
  const daysIntoYear = Math.round(data.currentYearProgress * DAYS_IN_YEAR)
  const daysToBirthday = Math.max(0, Math.round(DAYS_IN_YEAR - daysIntoYear))

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <Card className="border-slate-800 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-widest text-slate-500">In focus</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">Age {age}</span>
          <span className="text-sm text-slate-400">· {calYear}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.cls}`}>
            {status.label}
          </span>
          <span className="text-xs text-slate-500">{relative}</span>
        </div>

        {milestoneHere && (
          <div
            className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: `${milestoneHere.color}55`, background: `${milestoneHere.color}14` }}
          >
            <MilestoneIcon icon={milestoneHere.icon} className="h-4 w-4" style={{ color: milestoneHere.color }} />
            <span className="text-white">{milestoneHere.label} begins this year</span>
          </div>
        )}

        {isCurrent && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-slate-400">
              <span>{daysIntoYear} days in</span>
              <span>{daysToBirthday} to your birthday</span>
            </div>
            <div className="h-5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-amber-300/90">
              {pct}% of this year already spent
            </p>
          </div>
        )}

        <div className="mt-4 border-t border-white/[0.06] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Life phase</span>
            <span className="flex items-center gap-1.5 font-medium text-white">
              {phase ? (
                <>
                  <MilestoneIcon icon={phase.icon} className="h-3.5 w-3.5" style={{ color: phase.color }} />
                  {phase.label}
                </>
              ) : (
                "Early years"
              )}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Year {age + 1} of {data.lifeExpectancy} · {((age / data.lifeExpectancy) * 100).toFixed(0)}% of a
            full life
          </p>
        </div>
      </Card>
    </aside>
  )
}
