"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface YearsVisualizationProps {
  data: {
    lifeExpectancy: number
    ageInYears: number
  }
}

export function YearsVisualization({ data }: YearsVisualizationProps) {
  const { lifeExpectancy, ageInYears } = data
  const years = Array.from({ length: lifeExpectancy }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">Your Life in Years</h3>
        <p className="text-slate-400">Each square represents one year of your life</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-slate-700 p-6">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {years.map((year) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: year * 0.01,
                ease: "easeOut",
              }}
              className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium
                ${
                  year <= Math.floor(ageInYears)
                    ? "bg-emerald-600/80 text-white"
                    : year === Math.ceil(ageInYears)
                      ? "bg-emerald-600/40 text-white"
                      : "bg-indigo-500/30 text-indigo-100 hover:bg-indigo-500/40 transition-colors"
                }`}
            >
              {year}
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/80 rounded-sm mr-2"></div>
          <span className="text-slate-300">Years lived</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/40 rounded-sm mr-2"></div>
          <span className="text-slate-300">Current year</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500/30 rounded-sm mr-2"></div>
          <span className="text-slate-300">Future years</span>
        </div>
      </div>
    </div>
  )
}

