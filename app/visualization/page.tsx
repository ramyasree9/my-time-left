"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { VisualizationNav } from "@/components/visualization-nav"
import { DaysVisualization } from "@/components/days-visualization"
import { WeeksVisualization } from "@/components/weeks-visualization"
import { MonthsVisualization } from "@/components/months-visualization"
import { YearsVisualization } from "@/components/years-visualization"
import { LifeStats } from "@/components/life-stats"
import { calculateLifeData } from "@/lib/calculate-life-data"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type VisualizationType = "days" | "weeks" | "months" | "years"

export default function VisualizationPage() {
  const searchParams = useSearchParams()
  // Convert to a stable reference that won't change on every render
  const searchParamsString = searchParams.toString()
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("years")
  const [lifeData, setLifeData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dobParam = searchParams.get("dob")
    const expectancyParam = searchParams.get("expectancy")

    if (!dobParam || !expectancyParam) {
      setError("Missing required parameters")
      setLifeData(null)
      return
    }

    try {
      const dob = new Date(dobParam)
      const expectancy = Number.parseInt(expectancyParam, 10)

      if (isNaN(dob.getTime())) {
        setError("Invalid date of birth")
        setLifeData(null)
        return
      }

      if (isNaN(expectancy) || expectancy < 50 || expectancy > 120) {
        setError("Invalid life expectancy")
        setLifeData(null)
        return
      }

      const data = calculateLifeData(dob, expectancy)
      setLifeData(data)
      setError(null)
    } catch (err) {
      setError("Failed to calculate life data")
      setLifeData(null)
      console.error(err)
    }
  }, [searchParamsString]) // Use the stable string representation

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-slate-700 rounded-lg p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!lifeData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      <header className="border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            My Time Left
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              New Calculation
            </Button>
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <LifeStats data={lifeData} activeVisualization={visualizationType} />

        <VisualizationNav activeType={visualizationType} onChange={setVisualizationType} />

        <div className="mt-8">
          {visualizationType === "days" && <DaysVisualization data={lifeData} />}
          {visualizationType === "weeks" && <WeeksVisualization data={lifeData} />}
          {visualizationType === "months" && <MonthsVisualization data={lifeData} />}
          {visualizationType === "years" && <YearsVisualization data={lifeData} />}
        </div>
      </motion.div>
    </div>
  )
}

