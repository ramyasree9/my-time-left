"use client"

import { useEffect, useState } from "react"

interface LiveCountdownProps {
  /** End-of-life date to count down to. */
  endDate: Date
}

interface Parts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(end: Date): Parts {
  const ms = Math.max(0, end.getTime() - Date.now())
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

/**
 * Live-ticking countdown to the estimated end of life. Isolated into its own
 * component so the per-second re-render never touches the grids.
 */
export function LiveCountdown({ endDate }: LiveCountdownProps) {
  const [parts, setParts] = useState<Parts>(() => diff(endDate))

  useEffect(() => {
    const id = setInterval(() => setParts(diff(endDate)), 1000)
    return () => clearInterval(id)
  }, [endDate])

  const cells: { value: number; label: string }[] = [
    { value: parts.days, label: "days" },
    { value: parts.hours, label: "hours" },
    { value: parts.minutes, label: "min" },
    { value: parts.seconds, label: "sec" },
  ]

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-end gap-3 sm:gap-4">
          <div className="text-center">
            <div
              className={`tabular-nums font-extrabold leading-none tracking-tight ${
                i === 0
                  ? "text-5xl text-amber-300 sm:text-6xl"
                  : "text-2xl text-white sm:text-3xl"
              }`}
            >
              {i === 0 ? c.value.toLocaleString() : String(c.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{c.label}</div>
          </div>
          {i < cells.length - 1 && <span className="pb-5 text-2xl text-slate-700">:</span>}
        </div>
      ))}
    </div>
  )
}
