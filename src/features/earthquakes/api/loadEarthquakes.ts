import type { Feed } from '../model/types';

export async function loadEarthquakes(signal: AbortSignal): Promise<Feed> {
  const response = await fetch('/api/earthquakes', { signal });

  if (!response.ok)
    throw new Error(
      'Не удалось получить данные. Проверьте подключение и попробуйте снова.',
    );

  const data = await response.json();

  if (!data || !Array.isArray(data.earthquakes) || typeof data.fetchedAt !== 'string')
    throw new Error('Источник вернул данные в неизвестном формате.');

  return data;
}
