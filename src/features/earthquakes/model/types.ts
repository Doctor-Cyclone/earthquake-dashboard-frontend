export interface Earthquake {
  id: string
  magnitude: number | null
  place: string | null
  time: string
  longitude: number
  latitude: number
  depthKm: number
}
export interface Feed {
  source: string
  generatedAt: string
  fetchedAt: string
  count: number
  earthquakes: Earthquake[]
}
