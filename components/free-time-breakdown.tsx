"use client"

import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Slider } from "@/components/ui/slider"
import type { ActivityHours, LifeData } from "@/lib/types"
import { ACTIVITY_META, computeFreeTime } from "@/lib/activity"

interface FreeTimeBreakdownProps {
  data: LifeData
  activity: ActivityHours
  onChange: (activity: ActivityHours) => void
}

const FREE_COLOR = "#10b981"

/** Bare content (no Card) — rendered inside a dialog. Controlled. */
export function FreeTimeBreakdown({ data, activity, onChange }: FreeTimeBreakdownProps) {
  const result = useMemo(() => computeFreeTime(activity, data.daysLeft), [activity, data.daysLeft])

  const pieData = useMemo(
    () => [
      ...result.breakdownYears
        .filter((b) => b.years > 0)
        .map((b) => ({ name: b.label, value: b.years, color: b.color })),
      { name: "Free time", value: result.freeYearsLeft, color: FREE_COLOR },
    ],
    [result],
  )

  const setHours = (key: keyof ActivityHours, v: number) => onChange({ ...activity, [key]: v })

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Sliders */}
      <div className="space-y-5">
        {ACTIVITY_META.map((meta) => (
          <div key={meta.key}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
                {meta.label}
              </span>
              <span className="font-medium tabular-nums text-white">{activity[meta.key]} h/day</span>
            </div>
            <Slider
              value={[activity[meta.key]]}
              min={0}
              max={meta.max}
              step={0.5}
              onValueChange={(v) => setHours(meta.key, v[0])}
            />
          </div>
        ))}
      </div>

      {/* Donut + headline number */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={1}
                stroke="none"
              >
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0b0f17",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [`${value.toFixed(1)} yrs`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-emerald-400">
              {result.freeYearsLeft.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">free years left</span>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-slate-300">
          Just{" "}
          <span className="font-semibold text-white">
            {result.freeHoursPerDay.toFixed(1)} discretionary hours
          </span>{" "}
          a day — about{" "}
          <span className="font-semibold text-emerald-400">
            {Math.round(result.freeDaysLeft).toLocaleString()}
          </span>{" "}
          free days remaining.
        </p>
      </div>
    </div>
  )
}
