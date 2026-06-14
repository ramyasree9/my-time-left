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
 * Live-ticking countdown to the estimated end of life. Big day count with a
 * ticking hh:mm:ss beneath. Isolated so the per-second re-render never touches
 * the grids.
 */
export function LiveCountdown({ endDate }: LiveCountdownProps) {
  const [parts, setParts] = useState<Parts>(() => diff(endDate))

  useEffect(() => {
    const id = setInterval(() => setParts(diff(endDate)), 1000)
    return () => clearInterval(id)
  }, [endDate])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="text-center">
      <div className="text-5xl font-extrabold leading-none tracking-tight text-amber-300 tabular-nums">
        {parts.days.toLocaleString()}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-slate-500">days left</div>
      <div className="mt-2 font-mono text-sm tabular-nums text-slate-400">
        {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
      </div>
    </div>
  )
}
