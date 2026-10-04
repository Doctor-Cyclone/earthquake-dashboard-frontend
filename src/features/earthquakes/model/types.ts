export interface Earthquake {
  id: string;
  magnitude: number | null;
  place: string | null;
  time: string;
  longitude: number;
  latitude: number;
  depthKm: number;
}

export interface Feed {
  stale: boolean;
  source: string;
  generatedAt: string;
  fetchedAt: string;
  count: number;
  earthquakes: Earthquake[];
}

export type EarthquakeFilters = Partial<
  Record<'minMagnitude' | 'maxMagnitude' | 'minDepth' | 'maxDepth', number>
>;
