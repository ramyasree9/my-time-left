"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { SandTimer } from "@/components/sand-timer"
import { LiveCountdown } from "@/components/live-countdown"
import { computeFreeTime } from "@/lib/activity"
import type { ActivityHours, LifeData } from "@/lib/types"

interface LifeRailProps {
  data: LifeData
  endDate: Date
  activity: ActivityHours
  onOpenFreeTime: () => void
}

export function LifeRail({ data, endDate, activity, onOpenFreeTime }: LifeRailProps) {
  const free = computeFreeTime(activity, data.daysLeft)

  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <Card className="border-slate-800 bg-white/[0.03] p-5">
        <div className="flex justify-center">
          <SandTimer percentageLived={data.percentageLived} size={150} />
        </div>

        <div className="mt-2">
          {data.exceeded ? (
            <p className="text-center text-lg font-bold text-amber-300">
              Every day now is a bonus.
            </p>
          ) : (
            <LiveCountdown endDate={endDate} />
          )}
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-slate-400">Life lived</span>
            <span className="font-medium text-white">{data.percentageLived.toFixed(1)}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${data.percentageLived}%` }}
            />
          </div>
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Age</dt>
            <dd className="font-medium text-white">{data.ageInYears.toFixed(1)} yrs</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Born</dt>
            <dd className="font-medium text-white">
              {data.birthDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Life expectancy</dt>
            <dd className="font-medium text-white">{data.lifeExpectancy} yrs</dd>
          </div>
        </dl>
      </Card>

      <Card className="border-slate-800 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-widest text-slate-500">What&apos;s actually yours</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-400">
          {free.freeYearsLeft.toFixed(1)} <span className="text-base font-medium text-slate-400">free yrs</span>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          after sleep, work &amp; obligations ({free.freeHoursPerDay.toFixed(1)} h/day)
        </p>
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onOpenFreeTime}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Customize
        </Button>
      </Card>
    </aside>
  )
}
