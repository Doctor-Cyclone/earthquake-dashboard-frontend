import { useEffect, useRef, useState } from 'react';
import { loadEarthquakes } from '../api/loadEarthquakes';
import type { Feed } from './types';

export const useEarthquakes = () => {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const active = useRef<AbortController | null>(null);

  const refresh = async () => {
    active.current?.abort();

    const controller = new AbortController();

    active.current = controller;

    const timer = setTimeout(() => controller.abort(), 15000);

    setBusy(true);
    setError('');

    try {
      const result = await loadEarthquakes(controller.signal);

      if (active.current === controller) setFeed(result);
    } catch (problem) {
      if (active.current === controller)
        setError(
          problem instanceof Error && problem.name !== 'AbortError'
            ? problem.message
            : 'Ответ задерживается. Попробуйте обновить данные ещё раз.',
        );
    } finally {
      clearTimeout(timer);

      if (active.current === controller) setBusy(false);
    }
  };

  useEffect(() => {
    const initialLoad = setTimeout(() => void refresh(), 0);

    return () => {
      clearTimeout(initialLoad);

      const previous = active.current;

      active.current = null;
      previous?.abort();
    };
  }, []);

  return { feed, busy, error, refresh };
};
