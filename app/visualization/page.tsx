"use client"

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check, Flag, Home, Pencil, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisualizationNav } from "@/components/visualization-nav"
import { YearsVisualization } from "@/components/years-visualization"
import { MonthsVisualization } from "@/components/months-visualization"
import { WeeksVisualization } from "@/components/weeks-visualization"
import { DaysVisualization } from "@/components/days-visualization"
import { LifeRail } from "@/components/life-rail"
import { YearFocus } from "@/components/year-focus"
import { SettingsDialog } from "@/components/settings-dialog"
import { MilestonesEditor } from "@/components/milestones-editor"
import { FreeTimeBreakdown } from "@/components/free-time-breakdown"

import { calculateLifeData } from "@/lib/calculate-life-data"
import { DEFAULT_MILESTONES, visibleMilestones } from "@/lib/milestones"
import { DEFAULT_ACTIVITY } from "@/lib/activity"
import type { ActivityHours, Milestone } from "@/lib/types"

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
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [dob, setDob] = useState<Date | null>(null)
  const [expectancy, setExpectancy] = useState<number | null>(null)
  const [initError, setInitError] = useState<string | null>(null)

  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES)
  const [activity, setActivity] = useState<ActivityHours>(DEFAULT_ACTIVITY)
  const [view, setView] = useState<VisualizationType>("years")
  const [selectedAge, setSelectedAge] = useState<number | null>(null)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [milestonesOpen, setMilestonesOpen] = useState(false)
  const [freeTimeOpen, setFreeTimeOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Parse inputs from the URL after mount (keeps SSR/client clocks from disagreeing).
  useEffect(() => {
    setMounted(true)
    const dobParam = searchParams.get("dob")
    const expParam = searchParams.get("expectancy")
    if (!dobParam || !expParam) return setInitError("Missing required parameters")
    const d = new Date(dobParam)
    const e = Number.parseInt(expParam, 10)
    if (isNaN(d.getTime())) return setInitError("Invalid date of birth")
    if (isNaN(e) || e < 50 || e > 120) return setInitError("Invalid life expectancy")
    setInitError(null)
    setDob(d)
    setExpectancy(e)
  }, [searchParams])

  const data = useMemo(
    () => (dob && expectancy ? calculateLifeData(dob, expectancy) : null),
    [dob, expectancy],
  )

  if (!mounted) return <Spinner />

  if (initError) {
    return (
      <Shell>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-700 bg-white/5 p-6 text-center backdrop-blur-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Something&apos;s missing</h2>
            <p className="mb-6 text-slate-300">{initError}</p>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" /> Start over
              </Button>
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  if (!data || !dob || expectancy === null) return <Spinner />

  const visible = visibleMilestones(milestones, data.lifeExpectancy)
  const endDate = new Date(dob.getTime() + expectancy * 365.25 * 86400000)
  const focusAge = selectedAge ?? Math.min(data.lifeExpectancy - 1, Math.floor(data.ageInYears))

  const applySettings = (newDob: Date, newExp: number) => {
    setDob(newDob)
    setExpectancy(newExp)
    setSelectedAge(null)
    const params = new URLSearchParams()
    params.set("dob", newDob.toISOString())
    params.set("expectancy", String(newExp))
    router.replace(`/visualization?${params.toString()}`)
  }

  const handleShare = async () => {
    const url = window.location.href
    const copy = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url)
          return true
        }
      } catch {
        /* fall through */
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
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070a12]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-tight text-white">
            My Time Left
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
              <Pencil className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMilestonesOpen(true)}>
              <Flag className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Milestones</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4 text-emerald-400 sm:mr-2" /> : <Share2 className="h-4 w-4 sm:mr-2" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_290px]">
          <LifeRail data={data} endDate={endDate} activity={activity} onOpenFreeTime={() => setFreeTimeOpen(true)} />

          <main className="min-w-0 space-y-6">
            <VisualizationNav activeType={view} onChange={setView} />
            {view === "years" && (
              <YearsVisualization data={data} milestones={visible} selectedYear={selectedAge} onSelectYear={setSelectedAge} />
            )}
            {view === "months" && <MonthsVisualization data={data} milestones={visible} />}
            {view === "weeks" && <WeeksVisualization data={data} milestones={visible} />}
            {view === "days" && <DaysVisualization data={data} milestones={visible} />}
          </main>

          <YearFocus data={data} age={focusAge} milestones={visible} />
        </div>
      </div>

      {/* Modals (progressive disclosure) */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initialDob={dob}
        initialExpectancy={expectancy}
        onApply={applySettings}
      />

      <Dialog open={milestonesOpen} onOpenChange={setMilestonesOpen}>
        <DialogContent className="border-slate-800 bg-[#0b0f17] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Your milestones</DialogTitle>
            <DialogDescription className="text-slate-400">
              Adjust the ages — they appear as icons across every timeline.
            </DialogDescription>
          </DialogHeader>
          <MilestonesEditor milestones={milestones} lifeExpectancy={data.lifeExpectancy} onChange={setMilestones} />
        </DialogContent>
      </Dialog>

      <Dialog open={freeTimeOpen} onOpenChange={setFreeTimeOpen}>
        <DialogContent className="border-slate-800 bg-[#0b0f17] text-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>What&apos;s actually left for you</DialogTitle>
            <DialogDescription className="text-slate-400">
              Sleep, work and obligations eat most of a day. Adjust the sliders to see your truly free time.
            </DialogDescription>
          </DialogHeader>
          <FreeTimeBreakdown data={data} activity={activity} onChange={setActivity} />
        </DialogContent>
      </Dialog>
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
