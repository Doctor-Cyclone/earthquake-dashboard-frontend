import type { Earthquake } from './types';

const HOUR_MS = 60 * 60 * 1000;
const HOURS = 24;

export const getHourlyActivity = (earthquakes: Earthquake[], generatedAt: string) => {
  const end = Date.parse(generatedAt);

  if (!Number.isFinite(end)) return [];

  const start = end - HOURS * HOUR_MS;
  const buckets = Array.from({ length: HOURS }, (_, index) => ({
    start: start + index * HOUR_MS,
    end: start + (index + 1) * HOUR_MS,
    count: 0,
  }));

  for (const event of earthquakes) {
    const time = Date.parse(event.time);

    if (!Number.isFinite(time) || time < start || time > end) continue;

    const index = Math.min(HOURS - 1, Math.floor((time - start) / HOUR_MS));

    buckets[index].count++;
  }

  return buckets;
};
