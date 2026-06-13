"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface WeeksVisualizationProps {
  data: {
    lifeExpectancy: number
    daysLived: number
    birthDate: Date
  }
}

export function WeeksVisualization({ data }: WeeksVisualizationProps) {
  const { lifeExpectancy, birthDate } = data
  const totalWeeks = lifeExpectancy * 52
  const weeksLived = Math.floor(data.daysLived / 7)

  // Create array of all weeks
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1)

  // Create array of years for y-axis labels
  const birthYear = birthDate.getFullYear()
  const years = Array.from({ length: Math.ceil(lifeExpectancy / 5) }, (_, i) => birthYear + i * 5)

  // Create array of week numbers for x-axis labels (every 13 weeks = quarterly)
  const weekLabels = [1, 13, 26, 39, 52]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">Your Life in Weeks</h3>
        <p className="text-slate-400">Each square represents one week of your life</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-slate-700 p-6 overflow-auto">
        <div className="flex">
          {/* Y-axis labels (years) */}
          <div className="pr-2 flex flex-col justify-between text-xs text-slate-400">
            {years.map((year, index) => (
              <div
                key={year}
                style={{
                  height: index === years.length - 1 ? "20px" : `${(5 * 52 * 3) / (years.length - 1)}px`,
                }}
              >
                {year}
              </div>
            ))}
          </div>

          <div>
            {/* X-axis labels (weeks) */}
            <div className="flex mb-1 pl-3">
              {weekLabels.map((week) => (
                <div
                  key={week}
                  className="text-xs text-slate-400"
                  style={{
                    width: `${(52 * 3) / weekLabels.length}px`,
                    marginLeft:
                      week === 1 ? 0 : `${(52 * 3 * (week - weekLabels[weekLabels.indexOf(week) - 1])) / 52 - 20}px`,
                  }}
                >
                  W{week}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="grid grid-cols-52 gap-[2px] min-w-[800px]">
              {weeks.map((week) => (
                <motion.div
                  key={week}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: Math.min(week * 0.0001, 0.3),
                  }}
                  className={`aspect-square rounded-[1px] w-3
                    ${
                      week <= weeksLived
                        ? "bg-emerald-600/80"
                        : week === weeksLived + 1
                          ? "bg-emerald-600/40"
                          : "bg-indigo-500/30"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/80 rounded-sm mr-2"></div>
          <span className="text-slate-300">Weeks lived</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/40 rounded-sm mr-2"></div>
          <span className="text-slate-300">Current week</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500/30 rounded-sm mr-2"></div>
          <span className="text-slate-300">Future weeks</span>
        </div>
      </div>
    </div>
  )
}

