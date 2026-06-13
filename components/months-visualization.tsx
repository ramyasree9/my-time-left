"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface MonthsVisualizationProps {
  data: {
    lifeExpectancy: number
    ageInYears: number
    birthDate: Date
  }
}

export function MonthsVisualization({ data }: MonthsVisualizationProps) {
  const { lifeExpectancy, ageInYears, birthDate } = data
  const totalMonths = lifeExpectancy * 12
  const currentDate = new Date()

  // Calculate months lived
  const yearDiff = currentDate.getFullYear() - birthDate.getFullYear()
  const monthDiff = currentDate.getMonth() - birthDate.getMonth()
  const monthsLived = yearDiff * 12 + monthDiff

  // Create array of all months
  const months = Array.from({ length: totalMonths }, (_, i) => i + 1)

  // Create year labels for the y-axis (every 5 years)
  const birthYear = birthDate.getFullYear()
  const yearLabels = Array.from({ length: Math.ceil(lifeExpectancy / 5) }, (_, i) => birthYear + i * 5)

  // Month abbreviations for x-axis
  const monthAbbreviations = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">Your Life in Months</h3>
        <p className="text-slate-400">Each square represents one month of your life</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-slate-700 p-6 overflow-auto">
        <div className="flex">
          {/* Y-axis labels (years) */}
          <div className="pr-2 flex flex-col justify-between text-xs text-slate-400">
            {yearLabels.map((year, index) => (
              <div
                key={year}
                style={{
                  height: index === yearLabels.length - 1 ? "20px" : `${(5 * 12 * 4) / (yearLabels.length - 1)}px`,
                }}
              >
                {year}
              </div>
            ))}
          </div>

          <div>
            {/* X-axis labels (months) */}
            <div className="flex mb-1 pl-1">
              {monthAbbreviations.map((month, index) => (
                <div key={month} className="text-xs text-slate-400" style={{ width: "33px" }}>
                  {month}
                </div>
              ))}
            </div>

            {/* Months grid */}
            <div className="grid grid-cols-12 gap-1 min-w-[600px]">
              {months.map((month) => {
                // Calculate the year and month number for this cell
                const yearOfMonth = Math.floor((month - 1) / 12) + birthYear
                const monthOfYear = ((month - 1) % 12) + 1

                // Determine if we should show the month number
                const showNumber = month <= 24 || month % 12 === 1 || month === monthsLived || month === monthsLived + 1

                return (
                  <motion.div
                    key={month}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(month * 0.001, 0.5),
                      ease: "easeOut",
                    }}
                    className={`aspect-square rounded-sm hover:opacity-80 transition-opacity flex items-center justify-center
                      ${
                        month <= monthsLived
                          ? "bg-emerald-600/80"
                          : month === monthsLived + 1
                            ? "bg-emerald-600/40"
                            : "bg-indigo-500/30"
                      }`}
                  >
                    {showNumber && <span className="text-[7px] text-white/70 font-medium">{monthOfYear}</span>}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/80 rounded-sm mr-2"></div>
          <span className="text-slate-300">Months lived</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/40 rounded-sm mr-2"></div>
          <span className="text-slate-300">Current month</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500/30 rounded-sm mr-2"></div>
          <span className="text-slate-300">Future months</span>
        </div>
      </div>
    </div>
  )
}

