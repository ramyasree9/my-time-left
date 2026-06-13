"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface LifeStatsProps {
  data: {
    birthDate: Date
    lifeExpectancy: number
    ageInYears: number
    percentageLived: number
    yearsLeft: number
    totalDays: number
    daysLived: number
    daysLeft: number
  }
  activeVisualization: "years" | "months" | "weeks" | "days"
}

export function LifeStats({ data, activeVisualization }: LifeStatsProps) {
  const { birthDate, lifeExpectancy, ageInYears, percentageLived, yearsLeft, daysLived, daysLeft } = data

  // Calculate stats based on active visualization
  const getStats = () => {
    switch (activeVisualization) {
      case "years":
        return {
          lived: Math.floor(ageInYears),
          left: Math.ceil(yearsLeft),
          unit: "years",
        }
      case "months":
        const monthsLived = Math.floor(ageInYears * 12)
        const monthsLeft = Math.ceil(yearsLeft * 12)
        return {
          lived: monthsLived,
          left: monthsLeft,
          unit: "months",
        }
      case "weeks":
        const weeksLived = Math.floor(daysLived / 7)
        const weeksLeft = Math.ceil(daysLeft / 7)
        return {
          lived: weeksLived,
          left: weeksLeft,
          unit: "weeks",
        }
      case "days":
      default:
        return {
          lived: daysLived,
          left: daysLeft,
          unit: "days",
        }
    }
  }

  const stats = getStats()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-white/10 backdrop-blur-lg border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Your Life Timeline</h2>
              <p className="text-slate-300 mb-2">
                Born:{" "}
                <span className="font-medium text-white">
                  {birthDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="text-slate-300 mb-2">
                Current age: <span className="font-medium text-white">{ageInYears.toFixed(1)} years</span>
              </p>
              <p className="text-slate-300 mb-2">
                Life expectancy: <span className="font-medium text-white">{lifeExpectancy} years</span>
              </p>
            </div>

            <div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Life progress</span>
                  <span className="text-white font-medium">{percentageLived.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    style={{ width: `${percentageLived}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-900/30 rounded-lg p-4 text-center border border-emerald-800/30">
                  <p className="text-emerald-400 text-sm">You've lived</p>
                  <p className="text-white text-2xl font-bold">{stats.lived.toLocaleString()}</p>
                  <p className="text-emerald-400 text-sm">{stats.unit}</p>
                </div>

                <div className="bg-indigo-900/30 rounded-lg p-4 text-center border border-indigo-700/30">
                  <p className="text-indigo-300 text-sm">You have about</p>
                  <p className="text-white text-2xl font-bold">{stats.left.toLocaleString()}</p>
                  <p className="text-indigo-300 text-sm">{stats.unit} left</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

