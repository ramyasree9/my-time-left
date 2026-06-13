import type { LifeData } from "./types"

const MS_IN_DAY = 1000 * 60 * 60 * 24
const DAYS_IN_YEAR = 365.25

/**
 * Single source of truth for all life-timeline math.
 * All "lived" values are derived from the real elapsed milliseconds so the
 * grids, stats card and counters never disagree.
 */
export function calculateLifeData(birthDate: Date, lifeExpectancy: number): LifeData {
  const now = new Date()

  const ageInMs = Math.max(0, now.getTime() - birthDate.getTime())
  const ageInYears = ageInMs / (MS_IN_DAY * DAYS_IN_YEAR)

  const percentageLived = Math.min(100, (ageInYears / lifeExpectancy) * 100)
  const yearsLeft = Math.max(0, lifeExpectancy - ageInYears)
  const exceeded = ageInYears >= lifeExpectancy

  // Days
  const daysLived = Math.floor(ageInMs / MS_IN_DAY)
  const totalDays = Math.round(lifeExpectancy * DAYS_IN_YEAR)
  const daysLeft = Math.max(0, totalDays - daysLived)

  // Weeks
  const totalWeeks = Math.round(lifeExpectancy * 52)
  const weeksLived = Math.min(totalWeeks, Math.floor(daysLived / 7))
  const weeksLeft = Math.max(0, totalWeeks - weeksLived)

  // Months — derived from the same age so it matches everywhere.
  const totalMonths = Math.round(lifeExpectancy * 12)
  const monthsLived = Math.min(totalMonths, Math.floor(ageInYears * 12))
  const monthsLeft = Math.max(0, totalMonths - monthsLived)

  // Progress through the current *year of life* (birthday to birthday).
  const currentYearProgress = exceeded ? 1 : ageInYears - Math.floor(ageInYears)

  // Days left in the current *calendar* year.
  const currentCalendarYear = now.getFullYear()
  const endOfYear = new Date(currentCalendarYear + 1, 0, 1)
  const daysLeftInCalendarYear = Math.ceil((endOfYear.getTime() - now.getTime()) / MS_IN_DAY)

  return {
    birthDate,
    lifeExpectancy,
    ageInYears,
    percentageLived,
    yearsLeft,
    totalDays,
    daysLived,
    daysLeft,
    totalWeeks,
    weeksLived,
    weeksLeft,
    totalMonths,
    monthsLived,
    monthsLeft,
    currentYearProgress,
    daysLeftInCalendarYear,
    currentCalendarYear,
    exceeded,
  }
}
