import { useCallback, useEffect, useRef, useState } from 'react';
import { loadEarthquakes } from '../api/loadEarthquakes';
import type { Feed, EarthquakeFilters } from './types';

const REQUEST_TIMEOUT_MS = 15_000;
const REFRESH_INTERVAL_MS = 60_000;

export const useEarthquakes = () => {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const filters = useRef<EarthquakeFilters>({});
  const active = useRef<AbortController | null>(null);

  const fetchFeed = useCallback(() => {
    active.current?.abort();

    const controller = new AbortController();

    active.current = controller;

    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    return loadEarthquakes(controller.signal, filters.current)
      .then((result) => {
        if (active.current === controller) {
          setFeed(result);
          setErrorMessage('');
        }
      })
      .catch((error: unknown) => {
        if (active.current === controller) {
          setErrorMessage(
            error instanceof Error && error.name !== 'AbortError'
              ? error.message
              : 'Ответ задерживается. Попробуйте обновить данные ещё раз.',
          );
        }
      })
      .finally(() => {
        clearTimeout(timeout);

        if (active.current === controller) {
          active.current = null;
          setIsLoading(false);
        }
      });
  }, []);

  const refresh = () => {
    setIsLoading(true);
    setErrorMessage('');

    void fetchFeed();
  };

  const applyFilters = (nextFilters: EarthquakeFilters) => {
    filters.current = nextFilters;
    setFeed(null);
    refresh();
  };

  useEffect(() => {
    void fetchFeed();

    const interval = setInterval(() => {
      if (document.hidden || active.current) return;

      void fetchFeed();
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(interval);

      const controller = active.current;

      active.current = null;
      controller?.abort();
    };
  }, [fetchFeed]);

  return { feed, isLoading, errorMessage, refresh, applyFilters };
};
