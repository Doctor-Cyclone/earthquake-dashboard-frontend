import type { Earthquake } from './types'

export function getEarthquakeSummary(earthquakes: Earthquake[]) {
  let maximum: number | null = null
  let significantCount = 0
  for (const { magnitude } of earthquakes) {
    if (magnitude === null) continue
    maximum = maximum === null ? magnitude : Math.max(maximum, magnitude)
    if (magnitude >= 4.5) significantCount++
  }
  return { count: earthquakes.length, maximum, significantCount }
}
