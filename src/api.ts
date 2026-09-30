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
export async function loadEarthquakes(signal: AbortSignal): Promise<Feed> {
  const response = await fetch('/api/earthquakes', { signal })
  if (!response.ok) throw new Error('Не удалось получить данные. Проверьте подключение и попробуйте снова.')
  const data = await response.json()
  if (!data || !Array.isArray(data.earthquakes) || typeof data.fetchedAt !== 'string') throw new Error('Источник вернул данные в неизвестном формате.')
  return data
}
