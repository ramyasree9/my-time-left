import type { ActivityHours } from "./types"

export const DEFAULT_ACTIVITY: ActivityHours = {
  sleep: 8,
  work: 8,
  commute: 1,
  chores: 2,
  phone: 3,
}

export const ACTIVITY_META: {
  key: keyof ActivityHours
  label: string
  color: string
  max: number
}[] = [
  { key: "sleep", label: "Sleep", color: "#6366f1", max: 12 },
  { key: "work", label: "Work", color: "#f59e0b", max: 16 },
  { key: "commute", label: "Commute", color: "#14b8a6", max: 6 },
  { key: "chores", label: "Chores & meals", color: "#64748b", max: 8 },
  { key: "phone", label: "Screens", color: "#fb7185", max: 12 },
]

export interface FreeTimeResult {
  /** Hours/day committed to the tracked activities (capped at 24). */
  committedHoursPerDay: number
  /** Discretionary hours/day left over. */
  freeHoursPerDay: number
  /** Fraction (0..1) of each day that is discretionary. */
  freeFraction: number
  /** "Truly free" time left, expressed in years (free fraction of years left). */
  freeYearsLeft: number
  /** Same, in days. */
  freeDaysLeft: number
  /** Per-activity hours over the remaining lifetime, in years. */
  breakdownYears: { key: keyof ActivityHours; label: string; color: string; years: number }[]
}

/**
 * Given the user's daily activity budget, compute how much of their remaining
 * lifetime is actually discretionary "free" time.
 */
export function computeFreeTime(activity: ActivityHours, daysLeft: number): FreeTimeResult {
  const committedRaw =
    activity.sleep + activity.work + activity.commute + activity.chores + activity.phone
  const committedHoursPerDay = Math.min(24, committedRaw)
  const freeHoursPerDay = Math.max(0, 24 - committedHoursPerDay)
  const freeFraction = freeHoursPerDay / 24

  const yearsLeftTotal = daysLeft / 365.25

  const breakdownYears = [
    { key: "sleep" as const, label: "Sleep", color: "#6366f1", years: (activity.sleep / 24) * yearsLeftTotal },
    { key: "work" as const, label: "Work", color: "#f59e0b", years: (activity.work / 24) * yearsLeftTotal },
    { key: "commute" as const, label: "Commute", color: "#14b8a6", years: (activity.commute / 24) * yearsLeftTotal },
    { key: "chores" as const, label: "Chores & meals", color: "#64748b", years: (activity.chores / 24) * yearsLeftTotal },
    { key: "phone" as const, label: "Screens", color: "#fb7185", years: (activity.phone / 24) * yearsLeftTotal },
  ]

  return {
    committedHoursPerDay,
    freeHoursPerDay,
    freeFraction,
    freeYearsLeft: freeFraction * yearsLeftTotal,
    freeDaysLeft: freeFraction * daysLeft,
    breakdownYears,
  }
}
