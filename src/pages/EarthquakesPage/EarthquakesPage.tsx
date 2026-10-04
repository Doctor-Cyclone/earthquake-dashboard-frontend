import { useState } from 'react';
import { EarthquakeMap } from '../../features/earthquakes/ui/EarthquakeMap/EarthquakeMap';
import type { Earthquake } from '../../features/earthquakes/model/types';
import { AppHeader } from '../../components/AppHeader/AppHeader';
import { AppFooter } from '../../components/AppFooter/AppFooter';
import { useEarthquakes } from '../../features/earthquakes/model/useEarthquakes';
import { EarthquakeToolbar } from '../../features/earthquakes/ui/EarthquakeToolbar/EarthquakeToolbar';
import { EarthquakeSummary } from '../../features/earthquakes/ui/EarthquakeSummary/EarthquakeSummary';
import { EarthquakeEvents } from '../../features/earthquakes/ui/EarthquakeEvents/EarthquakeEvents';
import styles from './EarthquakesPage.module.scss';

const EMPTY_EVENTS: Earthquake[] = [];

export const EarthquakesPage = () => {
  const { feed, isLoading, errorMessage, refresh } = useEarthquakes();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const earthquakes = feed?.earthquakes ?? EMPTY_EVENTS;
  const visibleSelectedId = earthquakes.some((event) => event.id === selectedId)
    ? selectedId
    : null;

  return (
    <main className={styles.page}>
      <AppHeader />
      <EarthquakeToolbar isLoading={isLoading} onRefresh={refresh} />
      {errorMessage && (
        <div className={styles.error} role="alert">
          {errorMessage}
          {feed && ' Показана последняя успешная загрузка.'}
        </div>
      )}
      <EarthquakeSummary earthquakes={feed?.earthquakes ?? null} />
      <EarthquakeMap
        earthquakes={earthquakes}
        selectedId={visibleSelectedId}
        onSelect={setSelectedId}
      />
      <EarthquakeEvents
        feed={feed}
        isLoading={isLoading}
        selectedId={visibleSelectedId}
        onSelect={setSelectedId}
      />
      <AppFooter />
    </main>
  );
};
