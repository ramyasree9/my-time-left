"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface DaysVisualizationProps {
  data: {
    totalDays: number
    daysLived: number
  }
}

export function DaysVisualization({ data }: DaysVisualizationProps) {
  const { totalDays, daysLived } = data

  // For performance reasons, we'll show a percentage representation
  const sampleSize = 2000
  const sampleDays = Array.from({ length: sampleSize }, (_, i) => i + 1)

  // Calculate how many sample days should be filled based on percentage lived
  const percentageLived = (daysLived / totalDays) * 100
  const filledSampleDays = Math.round((percentageLived / 100) * sampleSize)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">Your Life in Days</h3>
        <p className="text-slate-400">Each square represents one day of your life</p>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-slate-700 p-6 overflow-auto">
        <div className="grid grid-cols-40 sm:grid-cols-50 gap-[1px] min-w-[600px]">
          {sampleDays.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.05,
                delay: Math.min(day * 0.0001, 0.2),
              }}
              className={`aspect-square rounded-[1px] w-2
                ${day <= filledSampleDays ? "bg-emerald-600/80" : "bg-indigo-500/30"}`}
            />
          ))}
        </div>
      </Card>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-600/80 rounded-sm mr-2"></div>
          <span className="text-slate-300">Days lived</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-indigo-500/30 rounded-sm mr-2"></div>
          <span className="text-slate-300">Future days</span>
        </div>
      </div>
    </div>
  )
}

