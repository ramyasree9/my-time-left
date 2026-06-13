export function calculateLifeData(birthDate: Date, lifeExpectancy: number) {
  const currentDate = new Date()

  // Calculate age in milliseconds
  const ageInMs = currentDate.getTime() - birthDate.getTime()

  // Convert to years
  const msInYear = 1000 * 60 * 60 * 24 * 365.25
  const ageInYears = ageInMs / msInYear

  // Calculate percentage of life lived
  const percentageLived = (ageInYears / lifeExpectancy) * 100

  // Calculate years left
  const yearsLeft = lifeExpectancy - ageInYears

  // Calculate days
  const msInDay = 1000 * 60 * 60 * 24
  const daysLived = Math.floor(ageInMs / msInDay)
  const totalDays = Math.floor(lifeExpectancy * 365.25)
  const daysLeft = totalDays - daysLived

  return {
    birthDate,
    lifeExpectancy,
    ageInYears,
    percentageLived,
    yearsLeft,
    totalDays,
    daysLived,
    daysLeft,
  }
}

