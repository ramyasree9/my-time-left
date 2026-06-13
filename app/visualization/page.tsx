"use client"

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Home, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VisualizationNav } from "@/components/visualization-nav"
import { YearsVisualization } from "@/components/years-visualization"
import { MonthsVisualization } from "@/components/months-visualization"
import { WeeksVisualization } from "@/components/weeks-visualization"
import { DaysVisualization } from "@/components/days-visualization"
import { LifeStats } from "@/components/life-stats"
import { SandTimer } from "@/components/sand-timer"
import { LiveCountdown } from "@/components/live-countdown"
import { CurrentYearDetail } from "@/components/current-year-detail"
import { FreeTimeBreakdown } from "@/components/free-time-breakdown"
import { MilestonesEditor } from "@/components/milestones-editor"

import { calculateLifeData } from "@/lib/calculate-life-data"
import { DEFAULT_MILESTONES, visibleMilestones } from "@/lib/milestones"
import type { Milestone } from "@/lib/types"

type VisualizationType = "years" | "months" | "weeks" | "days"

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#070a12] text-white">{children}</div>
}

function Spinner() {
  return (
    <Shell>
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-400" />
      </div>
    </Shell>
  )
}

function VisualizationContent() {
  const searchParams = useSearchParams()
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("years")
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES)
  const [showCurrentYear, setShowCurrentYear] = useState(false)
  const [copied, setCopied] = useState(false)
  // The whole experience is time-dependent (countdown, % lived). Render only
  // after mount so the server HTML never disagrees with the client clock.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const dobParam = searchParams.get("dob")
  const expectancyParam = searchParams.get("expectancy")

  const parsed = useMemo(() => {
    if (!dobParam || !expectancyParam) return { error: "Missing required parameters" as const }
    const dob = new Date(dobParam)
    const expectancy = Number.parseInt(expectancyParam, 10)
    if (isNaN(dob.getTime())) return { error: "Invalid date of birth" as const }
    if (isNaN(expectancy) || expectancy < 50 || expectancy > 120)
      return { error: "Invalid life expectancy" as const }
    return { data: calculateLifeData(dob, expectancy) }
  }, [dobParam, expectancyParam, mounted])

  if (!mounted) return <Spinner />

  if ("error" in parsed) {
    return (
      <Shell>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-white/5 p-6 text-center backdrop-blur-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Something&apos;s missing</h2>
            <p className="mb-6 text-slate-300">{parsed.error}</p>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Start over
              </Button>
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  const data = parsed.data
  const visible = visibleMilestones(milestones, data.lifeExpectancy)
  const endDate = new Date(data.birthDate.getTime() + data.lifeExpectancy * 365.25 * 86400000)

  const handleShare = async () => {
    const url = window.location.href
    const copy = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url)
          return true
        }
      } catch {
        /* fall through to execCommand */
      }
      try {
        const ta = document.createElement("textarea")
        ta.value = url
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(ta)
        return ok
      } catch {
        return false
      }
    }
    if (await copy()) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Shell>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070a12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            My Time Left
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {copied ? <Check className="mr-2 h-4 w-4 text-emerald-400" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Share"}
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                New
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8 rounded-2xl border border-slate-800 bg-white/[0.03] p-8 sm:flex-row sm:justify-between"
        >
          <div className="order-2 text-center sm:order-1 sm:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300/70">Time remaining</p>
            <div className="mt-3 flex justify-center sm:justify-start">
              {data.exceeded ? (
                <p className="text-3xl font-bold text-amber-300">
                  You&apos;ve already outlived your estimate. Every day now is a bonus.
                </p>
              ) : (
                <LiveCountdown endDate={endDate} />
              )}
            </div>
            <p className="mt-5 max-w-md text-slate-400">
              <span className="font-semibold text-white">{data.percentageLived.toFixed(1)}%</span> of your
              expected life is behind you. The sand keeps falling.
            </p>
          </div>
          <div className="order-1 shrink-0 sm:order-2">
            <SandTimer percentageLived={data.percentageLived} size={200} />
          </div>
        </motion.section>

        <LifeStats data={data} activeVisualization={visualizationType} />

        <VisualizationNav activeType={visualizationType} onChange={setVisualizationType} />

        <div>
          {visualizationType === "years" && (
            <YearsVisualization
              data={data}
              milestones={visible}
              onCurrentYearClick={() => setShowCurrentYear((v) => !v)}
            />
          )}
          {visualizationType === "months" && <MonthsVisualization data={data} milestones={visible} />}
          {visualizationType === "weeks" && <WeeksVisualization data={data} milestones={visible} />}
          {visualizationType === "days" && <DaysVisualization data={data} milestones={visible} />}
        </div>

        {showCurrentYear && (
          <CurrentYearDetail data={data} onClose={() => setShowCurrentYear(false)} />
        )}

        <FreeTimeBreakdown data={data} />

        <MilestonesEditor
          milestones={milestones}
          lifeExpectancy={data.lifeExpectancy}
          onChange={setMilestones}
        />
      </main>
    </Shell>
  )
}

export default function VisualizationPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <VisualizationContent />
    </Suspense>
  )
}
