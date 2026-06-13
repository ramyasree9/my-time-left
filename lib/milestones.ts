import type { Milestone } from "./types"

/**
 * Smart-default life milestones. Ages are editable by the user; these are
 * just sensible starting points. Each milestone marks the *start* age of a
 * life phase, drawn as a band/marker on the timelines.
 */
export const DEFAULT_MILESTONES: Milestone[] = [
  { id: "school", label: "School", age: 5, color: "#38bdf8", enabled: true },
  { id: "college", label: "College", age: 18, color: "#a78bfa", enabled: true },
  { id: "career", label: "Career", age: 22, color: "#f59e0b", enabled: true },
  { id: "retirement", label: "Retirement", age: 65, color: "#fb7185", enabled: true },
]

export type Granularity = "years" | "months" | "weeks" | "days"

const UNITS_PER_YEAR: Record<Granularity, number> = {
  years: 1,
  months: 12,
  weeks: 52,
  days: 365.25,
}

/**
 * Map a milestone age to a zero-based cell index for a given granularity.
 * e.g. age 18 in "weeks" -> 936.
 */
export function ageToIndex(age: number, granularity: Granularity): number {
  return Math.round(age * UNITS_PER_YEAR[granularity])
}

/** Visible milestones sorted by age, clamped to the life expectancy. */
export function visibleMilestones(milestones: Milestone[], lifeExpectancy: number): Milestone[] {
  return milestones
    .filter((m) => m.enabled && m.age >= 0 && m.age <= lifeExpectancy)
    .sort((a, b) => a.age - b.age)
}
