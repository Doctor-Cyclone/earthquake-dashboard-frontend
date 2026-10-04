import type { Feed, EarthquakeFilters } from '../model/types';

export const loadEarthquakes = async (
  signal: AbortSignal,
  filters: EarthquakeFilters,
): Promise<Feed> => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([name, value]) => query.set(name, String(value)));

  const response = await fetch('/api/earthquakes?' + query.toString(), { signal });

  if (!response.ok)
    throw new Error(
      'Не удалось получить данные. Проверьте подключение и попробуйте снова.',
    );

  const data = await response.json();

  if (!data || !Array.isArray(data.earthquakes) || typeof data.fetchedAt !== 'string')
    throw new Error('Источник вернул данные в неизвестном формате.');

  return data;
};
