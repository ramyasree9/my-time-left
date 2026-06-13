"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { LifeData } from "@/lib/types"

interface CurrentYearDetailProps {
  data: LifeData
  onClose?: () => void
}

const DAYS_IN_YEAR = 365.25

/**
 * Zoom into the user's current year of life: a bar showing how much of this
 * single year is already gone, plus the days left in the calendar year.
 */
export function CurrentYearDetail({ data, onClose }: CurrentYearDetailProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Bring the panel into view when it opens, so the click visibly does something.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  const { currentYearProgress, ageInYears } = data
  const pct = Math.round(currentYearProgress * 100)
  const ageNow = Math.floor(ageInYears)
  const daysIntoYear = Math.round(currentYearProgress * DAYS_IN_YEAR)
  const daysLeftThisYearOfLife = Math.max(0, Math.round(DAYS_IN_YEAR - daysIntoYear))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-24"
    >
      <Card className="relative border-amber-500/20 bg-amber-500/[0.04] p-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 text-slate-500 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <h4 className="text-sm font-medium text-amber-300">
          You&apos;re partway through year {ageNow + 1} of your life
        </h4>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-slate-400">
            <span>{daysIntoYear} days into this year</span>
            <span>{daysLeftThisYearOfLife} days to your next birthday</span>
          </div>
          <div className="h-6 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-amber-300/90">
            {pct}% of this year already spent
          </p>
        </div>

        <p className="mt-4 text-sm text-slate-300">
          Only <span className="font-bold text-white">{daysLeftThisYearOfLife}</span> days until your next
          birthday. What will you do with them?
        </p>
      </Card>
    </motion.div>
  )
}
