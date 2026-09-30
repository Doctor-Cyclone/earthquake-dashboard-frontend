import { useCallback, useEffect, useRef, useState } from 'react';
import { loadEarthquakes } from '../api/loadEarthquakes';
import type { Feed } from './types';

const REQUEST_TIMEOUT_MS = 15_000;

export const useEarthquakes = () => {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [busy, setBusy] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const active = useRef<AbortController | null>(null);

  const fetchFeed = useCallback(() => {
    active.current?.abort();

    const controller = new AbortController();

    active.current = controller;

    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    return loadEarthquakes(controller.signal)
      .then((result) => {
        if (active.current === controller) {
          setFeed(result);
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
          setBusy(false);
        }
      });
  }, []);

  const refresh = () => {
    setBusy(true);
    setErrorMessage('');

    return fetchFeed();
  };

  useEffect(() => {
    void fetchFeed();

    return () => {
      const controller = active.current;

      active.current = null;
      controller?.abort();
    };
  }, [fetchFeed]);

  return { feed, busy, errorMessage, refresh };
};
