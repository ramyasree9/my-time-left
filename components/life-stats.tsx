"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LifeData } from "@/lib/types"

interface LifeStatsProps {
  data: LifeData
  activeVisualization: "years" | "months" | "weeks" | "days"
}

export function LifeStats({ data, activeVisualization }: LifeStatsProps) {
  const { birthDate, lifeExpectancy, ageInYears, percentageLived } = data

  const byUnit = {
    years: { lived: Math.floor(ageInYears), left: Math.ceil(data.yearsLeft), unit: "years" },
    months: { lived: data.monthsLived, left: data.monthsLeft, unit: "months" },
    weeks: { lived: data.weeksLived, left: data.weeksLeft, unit: "weeks" },
    days: { lived: data.daysLived, left: data.daysLeft, unit: "days" },
  } as const
  const stats = byUnit[activeVisualization]

  return (
    <Card className="border-slate-800 bg-white/[0.04] backdrop-blur-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">Your timeline</h2>
            <p className="mb-1.5 text-sm text-slate-300">
              Born:{" "}
              <span className="font-medium text-white">
                {birthDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </p>
            <p className="mb-1.5 text-sm text-slate-300">
              Current age: <span className="font-medium text-white">{ageInYears.toFixed(1)} years</span>
            </p>
            <p className="text-sm text-slate-300">
              Life expectancy: <span className="font-medium text-white">{lifeExpectancy} years</span>
            </p>
          </div>

          <div>
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">Life progress</span>
                <span className="font-medium text-white">{percentageLived.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${percentageLived}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-800/30 bg-emerald-900/30 p-4 text-center">
                <p className="text-sm text-emerald-400">You&apos;ve lived</p>
                <p className="text-2xl font-bold text-white">{stats.lived.toLocaleString()}</p>
                <p className="text-sm text-emerald-400">{stats.unit}</p>
              </div>
              <div className="rounded-lg border border-amber-700/30 bg-amber-900/20 p-4 text-center">
                <p className="text-sm text-amber-300/90">You have about</p>
                <p className="text-2xl font-bold text-white">{stats.left.toLocaleString()}</p>
                <p className="text-sm text-amber-300/90">{stats.unit} left</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
