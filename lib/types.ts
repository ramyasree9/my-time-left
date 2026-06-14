// Shared domain types for the "My Time Left" app.

export interface LifeData {
  birthDate: Date
  lifeExpectancy: number

  // Age / progress
  ageInYears: number
  percentageLived: number
  /** Clamped to >= 0. */
  yearsLeft: number

  // Days
  totalDays: number
  daysLived: number
  daysLeft: number

  // Weeks
  totalWeeks: number
  weeksLived: number
  weeksLeft: number

  // Months
  totalMonths: number
  monthsLived: number
  monthsLeft: number

  /** 0..1 progress through the user's current year of life. */
  currentYearProgress: number
  /** Days remaining in the current calendar year. */
  daysLeftInCalendarYear: number
  /** The current calendar year, e.g. 2026. */
  currentCalendarYear: number

  /** True when the user has already passed their chosen life expectancy. */
  exceeded: boolean
}

export interface Milestone {
  id: string
  label: string
  /** Age in years at which this milestone begins. */
  age: number
  /** Tailwind-friendly hex color used for the band/marker. */
  color: string
  /** Icon key resolved by <MilestoneIcon /> (e.g. "graduation"). */
  icon: string
  enabled: boolean
}

export interface ActivityHours {
  /** Hours per day spent sleeping. */
  sleep: number
  /** Hours per day spent working. */
  work: number
  /** Hours per day commuting. */
  commute: number
  /** Hours per day on chores / errands / eating. */
  chores: number
  /** Hours per day on phone / screens (non-work). */
  phone: number
}
